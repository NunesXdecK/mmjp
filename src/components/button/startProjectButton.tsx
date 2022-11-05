import MenuButton from "./menuButton"
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
            let saveRes = false
            try {
                saveRes = await fetch("api/projectByBudget", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", data: project, history: history }),
                }).then((res) => res.json()).then((res) => res.status === "SUCCESS")
                console.log(saveRes)
            } catch (err) {
                console.error(err)
            }
            if (saveRes) {
                let professional: Professional = defaultProfessional
                try {
                    professional = await fetch("api/lastProfessional").then((res) => res.json()).then((res) => res.professional)
                } catch (err) {
                    console.error(err)
                }
                console.log(professional)
                let services: Service[] = []
                props?.budget?.services?.map((element, index) => {
                    let service: BudgetService = element
                    services = [...services,
                    {
                        ...defaultService,
                        status: "NORMAL",
                        title: service.title,
                        value: service.value,
                        total: service.total,
                        index: service.index,
                        quantity: service.quantity,
                        dateDue: props.budget.dateDue,
                        professional: { id: professional.id },
                        project: { id: project.id },
                    }
                    ]
                })
                console.log(services)
                let payments: Payment[] = []
                props?.budget?.payments?.map((element, index) => {
                    let payment: BudgetPayment = element
                    payments = [...payments,
                    {
                        ...defaultPayment,
                        status: "NORMAL",
                        value: payment.value,
                        index: payment.index,
                        dateDue: payment.dateDue,
                        description: payment.description,
                    }
                    ]
                })
                console.log(payments)
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
