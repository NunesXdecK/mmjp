import ActionBar from "./actionBar";
import Button from "../button/button";
import { useEffect, useState } from "react";
import MenuButton from "../button/menuButton";
import DropDownButton from "../button/dropDownButton";
import StartProjectButton from "../button/startProjectButton";
import { handleRemoveCurrencyMask } from "../../util/maskUtil";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleValidationNotNull, ValidationReturn } from "../../util/validationUtil";
import { Budget, BudgetPayment, BudgetStatus, defaultBudget } from "../../interfaces/objectInterfaces";

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

export const handleBudgetValidationForDB = (budget: Budget) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let nameCheck = handleValidationNotNull(budget.title)
    let clientsCheck = budget?.clients?.length > 0 ?? false
    let clientsOnBaseCheck = true
    let serviceOnBaseCheck = true
    let paymentOnBaseCheck = true

    if (!nameCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo titulo está em branco."] }
    }

    if (!clientsCheck) {
        validation = { ...validation, messages: [...validation.messages, "O serviço precisa de um cliente."] }
    }

    budget.clients.map((element, index) => {
        if (!handleValidationNotNull(element.id) || element.id === 0) {
            clientsOnBaseCheck = false
            validation = { ...validation, messages: [...validation.messages, "O serviço precisa de um cliente."] }
        }
    })
    /*
        let servicesCheck = budget?.services?.length > 0 ?? false
        let paymentsCheck = budget?.payments?.length > 0 ?? false
        if (!servicesCheck) {
            validation = { ...validation, messages: [...validation.messages, "O serviço precisa de ao menos um serviço."] }
        }
        if (!paymentsCheck) {
            validation = { ...validation, messages: [...validation.messages, "O serviço precisa de ao menos um pagamento."] }
        }
    budget.services.map((element, index) => {
        if (!handleValidationNotNull(element.title)) {
            serviceOnBaseCheck = false
            validation = { ...validation, messages: [...validation.messages, "O serviço " + (index + 1) + " está sem titulo."] }
        }
    })
    
    budget.payments.map((element, index) => {
        if (!handleValidationNotNull(element.title)) {
            paymentOnBaseCheck = false
            validation = { ...validation, messages: [...validation.messages, "O pagamento " + (index + 1) + " está sem titulo."] }
        }
        serviceOnBaseCheck &&
        paymentOnBaseCheck
        servicesCheck &&
        paymentsCheck &&
    })
    */

    validation = {
        ...validation,
        validation:
            nameCheck &&
            clientsCheck &&
            clientsOnBaseCheck
    }
    return validation
}

const handleBudgetForDB = (budget: Budget) => {
    let clients = []
    if (budget.clients && budget.clients.length) {
        budget.clients?.map((element, index) => {
            if (element && "id" in element && element.id > 0) {
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
            payment = { ...payment, index: index, value: handleRemoveCurrencyMask(payment?.value) }
            payments = [...payments, payment]
        })
    }
    let services = []
    if (budget.services && budget.services?.length) {
        budget.services?.map((element: BudgetPayment, index) => {
            let service = { ...element }
            service = { ...service, index: index, value: handleRemoveCurrencyMask(service?.value) }
            services = [...services, service]
        })
    }
    budget = {
        ...budget,
        clients: clients,
        services: services,
        payments: payments,
        title: budget.title.trim(),
    }
    return budget
}

export const handleSaveBudgetInner = async (budget, history) => {
    let res = { status: "ERROR", id: 0, budget: budget }
    let budgetForDB = handleBudgetForDB(budget)
    try {
        const saveRes = await fetch("api/budget", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: budgetForDB, history: history }),
        }).then((res) => res.json())
        res = { ...res, status: "SUCCESS", id: saveRes.id, budget: { ...budgetForDB, id: saveRes.id } }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export default function BudgetActionBarForm(props: BudgetActionBarFormProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [hasProject, setHasProject] = useState(true)

    const canSwitchStatus =
        props.budget.status === "APROVADO"
        || props.budget.status === "VENCIDO"
        || props.budget.status === "REJEITADO"
        || props.budget.status === "NEGOCIANDO"

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

    const handleSave = async (status: BudgetStatus, isForCloseModal) => {
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
        let res = await handleSaveBudgetInner(budget, true)
        budget = {
            ...budget,
            id: res.id,
        }
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
            props.onAfterSave(feedbackMessage, budget, isForCloseModal)
        }
    }

    useEffect(() => {
        if (isFirst && props?.budget?.id > 0) {
            handleStartProjectButton(props.budget.id).then((res) => {
                setIsFirst(false)
                setHasProject(res)
            })
        }
    })

    return (
        <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
            <div className="w-full flex flex-row justify-between">
                <div className="flex flex-row gap-2 flex-wrap">
                    <Button
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onClick={() => handleSave(props.budget.status, true)}
                    >
                        Salvar
                    </Button>
                    <Button
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onClick={() => handleSave(props.budget.status, false)}
                    >
                        Salvar e sair
                    </Button>
                    {props?.budget?.id > 0 &&
                        <div className="hidden sm:flex sm:flex-row gap-2 flex-wrap">
                            <StartProjectButton
                                budget={props.budget}
                                isLoading={props.isLoading}
                                canStartProject={hasProject}
                                onAfterClick={() => handleSetIsLoading(true)}
                                onBeforeClick={(created) => {
                                    handleSetIsLoading(false)
                                    if (!created) {
                                        const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
                                        handleShowMessage(feedbackMessage)
                                        return
                                    }
                                    const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
                                    handleShowMessage(feedbackMessage)
                                    setHasProject(false)
                                    if (props.onAfterSave) {
                                        let budget = props.budget
                                        props.onAfterSave(feedbackMessage, budget, false)
                                    }
                                }}
                            />
                            <Button
                                isLoading={props.isLoading}
                                isHidden={props.budget.status === "APROVADO"}
                                isDisabled={props.budget.status === "APROVADO"}
                                onClick={() => {
                                    handleSave("APROVADO", true)
                                }}
                            >
                                Aprovar orçamento
                            </Button>
                            <Button
                                isLoading={props.isLoading}
                                isHidden={props.budget.status === "NEGOCIANDO"}
                                isDisabled={props.budget.status === "NEGOCIANDO"}
                                onClick={() => {
                                    handleSave("NEGOCIANDO", true)
                                }}
                            >
                                Negociar orçamento
                            </Button>
                            <Button
                                isLoading={props.isLoading}
                                isHidden={props.budget.status === "REJEITADO"}
                                isDisabled={props.budget.status === "REJEITADO"}
                                onClick={() => {
                                    handleSave("REJEITADO", true)
                                }}
                            >
                                Rejeitar orçamento
                            </Button>
                            <Button
                                isLoading={props.isLoading}
                                onClick={props.onPrintBudget}
                                isHidden={!props.onPrintBudget}
                            >
                                Imprimir orçamento
                            </Button>
                            <Button
                                isLoading={props.isLoading}
                                onClick={props.onPrintContract}
                                isHidden={!props.onPrintContract}
                            >
                                Imprimir contrato
                            </Button>
                        </div>
                    }
                </div>
                <div className="block sm:hidden">
                    <DropDownButton
                        isLeft
                        title="..."
                        isLoading={props.isLoading}
                    >
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
                                        let budget = props.budget
                                        props.onAfterSave(feedbackMessage, budget, false)
                                    }
                                }}
                            />
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.budget.status === "APROVADO"}
                                isDisabled={props.budget.status === "APROVADO"}
                                onClick={() => {
                                    handleSave("APROVADO", true)
                                }}
                            >
                                Aprovar orçamento
                            </MenuButton>
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.budget.status === "NEGOCIANDO"}
                                isDisabled={props.budget.status === "NEGOCIANDO"}
                                onClick={() => {
                                    handleSave("NEGOCIANDO", true)
                                }}
                            >
                                Negociar orçamento
                            </MenuButton>
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.budget.status === "REJEITADO"}
                                isDisabled={props.budget.status === "REJEITADO"}
                                onClick={() => {
                                    handleSave("REJEITADO", true)
                                }}
                            >
                                Rejeitar orçamento
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
                        </div>
                    </DropDownButton>
                </div>
            </div>
        </ActionBar>
    )
}
