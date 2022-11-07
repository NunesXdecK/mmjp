import ActionBar from "./actionBar";
import Button from "../button/button";
import { useEffect, useState } from "react";
import MenuButton from "../button/menuButton";
import DropDownButton from "../button/dropDownButton";
import StartProjectButton from "../button/startProjectButton";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleBudgetValidationForDB } from "../../util/validationUtil";
import { handleGetDateFormatedToUTC, handleNewDateToUTC } from "../../util/dateUtils";
import { Budget, BudgetPayment, defaultBudget } from "../../interfaces/objectInterfaces";

interface BudgetActionBarFormProps {
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    budget?: Budget,
    onPrintBudget?: () => void,
    onPrintContract?: () => void,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any?, boolean?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function BudgetActionBarForm(props: BudgetActionBarFormProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [hasProject, setHasProject] = useState(true)

    const handleSetIsLoading = (value: boolean) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleBudgetForDB = (budget: Budget) => {
        if (budget?.dateString?.length > 0) {
            budget = { ...budget, dateDue: handleGetDateFormatedToUTC(budget.dateString) }
        }
        if (budget.dateDue === 0) {
            budget = { ...budget, dateDue: handleNewDateToUTC() }
        }
        let clients = []
        if (budget.clients && budget.clients.length) {
            budget.clients?.map((element, index) => {
                if (element && "id" in element && element.id.length) {
                    if ("cpf" in element) {
                        clients = [...clients, { id: element.id, cpf: "" }]
                    } else if ("cnpj" in element) {
                        clients = [...clients, { id: element.id, cnpj: "" }]
                    }
                }
            })
        }
        let payments = []
        if (budget.payments && budget.payments?.length) {
            budget.payments?.map((element: BudgetPayment, index) => {
                let payment = { ...element }
                payment = { ...payment, dateDue: handleGetDateFormatedToUTC(payment.dateString) }
                payments = [...payments, payment]
            })
        }
        budget = {
            ...budget,
            clients: clients,
            payments: payments,
            title: budget.title.trim(),
        }
        return budget
    }

    const handleStartProjectButton = async (id) => {
        let hasProject = false
        if (id) {
            try {
                const saveRes = await fetch("api/hasProject", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", data: id }),
                }).then((res) => res.json())
                hasProject = saveRes.hasProject
            } catch (e) {
                console.error("Error adding document: ", e)
            }
        }
        return hasProject
    }

    const handleSaveBudgetInner = async (budget, history) => {
        let res = { status: "ERROR", id: "", budget: budget }
        try {
            const saveRes = await fetch("api/budget", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: budget, history: history }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, budget: { ...budget, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async (status: "ORÇAMENTO" | "ARQUIVADO" | "FINALIZADO", isForCloseModal) => {
        const isBudgetValid = handleBudgetValidationForDB(props.budget)
        if (!isBudgetValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: [...isBudgetValid.messages], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        handleSetIsLoading(true)
        let budget = props.budget
        if (status?.length > 0) {
            budget = { ...budget, status: status }
        }
        budget = handleBudgetForDB(budget)
        let res = await handleSaveBudgetInner(budget, true)
        budget = { ...budget, id: res.id }
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            handleSetIsLoading(false)
            return
        }
        handleSetIsLoading(false)
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (props.isMultiple && props.onSet) {
            props.onSet(defaultBudget)
        } else if (isForCloseModal) {
            props.onSet(budget)
        }
        if (props.onAfterSave) {
            if (budget.dateString?.length > 0) {
                budget = { ...budget, dateDue: handleGetDateFormatedToUTC(budget.dateString) }
            }
            props.onAfterSave(feedbackMessage, budget, isForCloseModal)
        }
    }

    useEffect(() => {
        if (isFirst && props?.budget?.id?.length > 0) {
            handleStartProjectButton(props.budget.id).then((res) => {
                setIsFirst(false)
                setHasProject(res)
            })
        }
    })

    return (
        <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
            <div className="w-full flex flex-row justify-between">
                <Button
                    isLoading={props.isLoading}
                    onClick={() => handleSave(props.budget.status, false)}
                >
                    Salvar
                </Button>
                <DropDownButton
                    isLeft
                    title="...">
                    <div className="w-full flex flex-col">
                        <StartProjectButton
                            budget={props.budget}
                            isLoading={props.isLoading}
                            canStartProject={hasProject}
                            onAfterClick={() => handleSetIsLoading(true)}
                            onBeforeClick={() => {
                                handleSetIsLoading(false)
                                const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
                                handleShowMessage(feedbackMessage)
                                if (props.onAfterSave) {
                                    props.onAfterSave(feedbackMessage, props.budget, false)
                                }
                            }}
                        />
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.budget.status !== "ORÇAMENTO"}
                            isDisabled={props.budget.status !== "ORÇAMENTO"}
                            onClick={() => {
                                handleSave("FINALIZADO", true)
                            }}
                        >
                            Finalizar orçamento
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.budget.status === "ORÇAMENTO"}
                            isDisabled={props.budget.status === "ORÇAMENTO"}
                            onClick={() => {
                                handleSave("ORÇAMENTO", true)
                            }}
                        >
                            Reativar orçamento
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            onClick={props.onPrintBudget}
                            isHidden={!props.onPrintBudget}
                        >
                            Imprimir orçamento
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            onClick={props.onPrintContract}
                            isHidden={!props.onPrintContract}
                        >
                            Imprimir contrato
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.budget.status !== "ORÇAMENTO"}
                            isDisabled={props.budget.status !== "ORÇAMENTO"}
                            onClick={() => {
                                handleSave("ARQUIVADO", true)
                            }}
                        >
                            Arquivar orçamento
                        </MenuButton>
                    </div>
                </DropDownButton>
            </div>
        </ActionBar>
    )
}
