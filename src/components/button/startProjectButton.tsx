import MenuButton from "./menuButton"
import { handlePaymentForDB } from "../bar/paymentActionBar"
import { Budget, BudgetPayment, BudgetService, defaultPayment, defaultProfessional, defaultProject, defaultService, Payment, Professional, Project, Service } from "../../interfaces/objectInterfaces"

interface StartProjectButtonProps {
    id?: string,
    className?: string,
    isLoading?: boolean,
    canStartProject?: boolean,
    budget?: Budget,
    onClick?: (any) => void,
    onAfterClick?: () => void,
    onBeforeClick?: () => void,
}

export default function StartProjectButton(props: StartProjectButtonProps) {
    const handleCreateProject = async () => {
        if (props.onAfterClick) {
            props.onAfterClick()
        }
        const hasProject = await fetch("api/hasProject", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: props?.budget?.id }),
        }).then((res) => res.json()).then((res) => res.hasProject)
        if (!hasProject) {
            //mount client
            let client = props.budget.clients[0]
            if (client?.id?.length > 0) {
                if ("cpf" in client) {
                    client = { id: client.id, cpf: "" }
                } else if ("cnpj" in client) {
                    client = { id: client.id, cnpj: "" }
                }
            }
            //mount project number
            const year = new Date().getFullYear()
            let number = ""
            number = number + year + "-"
            props.budget?.clients?.map((element, index) => {
                if ("clientCode" in element && element.clientCode !== "") {
                    number = number + element.clientCode + "-"
                }
            })
            let numberOfProjectsInYear = await fetch("api/projectnumber/" + number).then((res) => res.json()).then((res) => res.data)
            number = number + numberOfProjectsInYear
            //mount project
            let project: Project = {
                ...defaultProject,
                number: number,
                status: "NORMAL",
                clients: [client],
                title: props.budget.title,
                dateDue: props.budget.dateDue,
                budget: { id: props.budget.id },
            }
            //save project
            let projectSaveRes = { status: "", id: "" }
            try {
                projectSaveRes = await fetch("api/projectByBudget", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", data: project, history: history }),
                }).then((res) => res.json())
            } catch (err) {
                console.error(err)
            }
            if (projectSaveRes?.status === "SUCCESS" && projectSaveRes?.id?.length > 0) {
                //get last professional
                let professional: Professional = defaultProfessional
                try {
                    professional = await fetch("api/lastProfessional").then((res) => res.json()).then((res) => res.professional)
                } catch (err) {
                    console.error(err)
                }
                //save services
                await Promise.all(
                    props?.budget?.services?.map(async (element, index) => {
                        let service: BudgetService = element
                        let serviceNew =
                        {
                            ...defaultService,
                            status: "NORMAL",
                            title: service.title,
                            value: service.value,
                            total: service.total,
                            index: service.index,
                            quantity: service.quantity,
                            project: { id: projectSaveRes?.id },
                            dateDue: props.budget.dateDue,
                            professional: { id: professional.id },
                        }
                        await fetch("api/serviceNew", {
                            method: "POST",
                            body: JSON.stringify({ token: "tokenbemseguro", data: serviceNew, history: history }),
                        })
                    })
                )
                //save payments
                await Promise.all(
                    props?.budget?.payments?.map(async (element, index) => {
                        let payment: BudgetPayment = element
                        let paymentNew: Payment =
                        {
                            ...defaultPayment,
                            status: "NORMAL",
                            value: payment.value,
                            index: payment.index,
                            dateDue: payment.dateDue,
                            description: payment.description,
                            project: { id: projectSaveRes?.id },
                        }
                        paymentNew = handlePaymentForDB(paymentNew)
                        await fetch("api/payment", {
                            method: "POST",
                            body: JSON.stringify({ token: "tokenbemseguro", data: paymentNew, history: history }),
                        })
                    })
                )
            }
        }
        if (props.onBeforeClick) {
            props.onBeforeClick()
        }
    }

    return (
        <>
            {!props.canStartProject && (
                <MenuButton
                    isLoading={props.isLoading}
                    onClick={handleCreateProject}
                    isHidden={props.budget.status !== "FINALIZADO"}
                    isDisabled={props.budget.status !== "FINALIZADO"}
                >
                    Iniciar projeto
                </MenuButton>
            )}
        </>
    )
}
