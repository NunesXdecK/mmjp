import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import BudgetView from "../view/budgetView"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import BudgetDataForm from "../form/budgetDataForm"
import BudgetActionBarForm, { handleSaveBudgetInner } from "../bar/budgetActionBar"
import ContractPrintView from "../view/contractPrintView"
import SwiftInfoButton from "../button/switchInfoButton"
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { handleUTCToDateShow, handleNewDateToUTC } from "../../util/dateUtils"
import { Budget, BudgetPayment, Company, defaultBudget, Person } from "../../interfaces/objectInterfaces"

interface BudgetPageProps {
    id?: string,
    getInfo?: boolean,
    canSave?: boolean,
    canUpdate?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    onSetPage?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function BudgetPage(props: BudgetPageProps) {
    const [budget, setBudget] = useState<Budget>(defaultBudget)
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
    const [isLoading, setIsLoading] = useState(props.getInfo)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)
    const [isPrintBudget, setIsPrintBudget] = useState(false)
    const [isPrintContract, setIsPrintContract] = useState(false)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setBudget(defaultBudget)
        setIndex(-1)
        setIsForShow(false)
        setIsRegister(false)
        setIsPrintBudget(false)
        setIsPrintContract(false)
    }

    const handleDeleteClick = async (budget, index) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/budget", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: budget.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const list = [
            ...budgets.slice(0, (index - 1)),
            ...budgets.slice(index, budgets.length),
        ]
        setBudgets(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setBudget({
            ...defaultBudget,
            dateString: handleUTCToDateShow(handleNewDateToUTC().toString())
        })
        setIsRegister(true)
        setIndex(-1)
    }

    const handlePrintBudget = () => {
        setIsForShow(false)
        setIsRegister(false)
        setIsPrintBudget(true)
        setIsPrintContract(false)
    }

    const handlePrintContract = () => {
        setIsForShow(false)
        setIsRegister(false)
        setIsPrintBudget(false)
        setIsPrintContract(true)
    }

    const handleCloseModal = (value) => {
        setIsRegister(value)
        setIsForShow(value)
    }

    const handleShowClick = (budget) => {
        setIsLoading(true)
        setBudget({ ...defaultBudget, ...budget })
        setIsForShow(true)
        setIsLoading(false)
    }

    const handleEditClick = async (budget, index?) => {
        setIsLoading(true)
        setIsForShow(false)
        let localBudget: Budget = await fetch("api/budget/" + budget?.id).then((res) => res.json()).then((res) => res.data)
        let localClients = []
        if (localBudget?.clients?.length > 0) {
            await Promise.all(
                localBudget.clients.map(async (element, index) => {
                    if (element && element?.id?.length) {
                        let localClient: (Person | Company) = {}
                        if ("cpf" in element) {
                            localClient = await fetch("api/person/" + element.id).then((res) => res.json()).then((res) => res.data)
                        } else if ("cnpj" in element) {
                            localClient = await fetch("api/company/" + element.id).then((res) => res.json()).then((res) => res.data)
                        }
                        if (localClient && "id" in localClient && localClient?.id?.length) {
                            localClients = [...localClients, localClient]
                        }
                    }
                })
            )
        }
        let localPayments = []
        if (localBudget?.payments?.length > 0) {
            localBudget.payments.map((element: BudgetPayment, index) => {
                localPayments = [...localPayments, { ...element, dateString: handleUTCToDateShow(element.dateDue?.toString()) }]
            })
        }
        localBudget = {
            ...localBudget,
            clients: localClients,
            payments: localPayments,
            dateString: handleUTCToDateShow(localBudget?.dateDue?.toString()),
        }
        setIsLoading(false)
        setIsRegister(true)
        setBudget(localBudget)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, budget: Budget, isForCloseModal) => {
        let localIndex = -1
        budgets.map((element, index) => {
            if (element.id === budget.id) {
                localIndex = index
            }
        })
        let list: Budget[] = [
            budget,
            ...budgets,
        ]
        if (localIndex > -1) {
            list = [
                budget,
                ...budgets.slice(0, localIndex),
                ...budgets.slice(localIndex + 1, budgets.length),
            ]
        }
        setBudgets((old) => list)
        handleShowMessage(feedbackMessage)
        if (!isForCloseModal) {
            handleBackClick()
            setIndex((old) => -1)
        } else {
            setIndex((old) => 1)
        }
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="4">Nome</FormRowColumn>
                <FormRowColumn unit="1">Status</FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">Prazo</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: Budget) => {
        return (
            <FormRow>
                <FormRowColumn unit="4">{element.title}</FormRowColumn>
                <FormRowColumn unit="1">
                    <SwiftInfoButton
                        id={element.id + "-"}
                        value={element.status}
                        isDisabled={props.isDisabled || props.isStatusDisabled}
                        values={[
                            "APROVADO",
                            "NEGOCIANDO",
                            "REJEITADO",
                        ]}
                        onClick={async (value) => {
                            const budget = { ...element, status: value }
                            let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
                            setIsLoading(true)
                            const res = await handleSaveBudgetInner(budget, true)
                            setIsLoading(false)
                            if (res.status === "ERROR") {
                                handleShowMessage(feedbackMessage)
                                return
                            }
                            feedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
                            handleAfterSave(feedbackMessage, budget, true)
                        }}
                    />
                </FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">{handleUTCToDateShow(element.dateDue?.toString())}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/budgets").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setBudgets(res.list)
                }
                setIsLoading(false)
            })
        }
    })

    return (
        <>
            {!isPrintBudget && !isPrintContract && (
                <>
                    <ActionBar className="flex flex-row justify-end">
                        <Button
                            isLoading={isLoading}
                            isHidden={!props.canUpdate}
                            isDisabled={props.isDisabled}
                            onClick={() => {
                                setIndex(-1)
                                setIsFirst(true)
                                setIsLoading(true)
                                handleBackClick()
                            }}
                        >
                            <RefreshIcon className="block h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                            isLoading={isLoading}
                            onClick={handleNewClick}
                            isHidden={!props.canSave}
                            isDisabled={props.isDisabled}
                        >
                            <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                        </Button>
                    </ActionBar>
                    <ListTable
                        list={budgets}
                        isActive={index}
                        title="Orçamento"
                        isLoading={isLoading}
                        onSetIsActive={setIndex}
                        onTableRow={handlePutRows}
                        onShowClick={handleShowClick}
                        onEditClick={handleEditClick}
                        isDisabled={props.isDisabled}
                        onTableHeader={handlePutHeaders}
                        onDeleteClick={handleDeleteClick}
                    />
                </>
            )}

            {(isPrintBudget || isPrintContract) && (
                <div className="p-4 pb-0">
                    <ActionBar>
                        <Button
                            isLoading={isLoading}
                            onClick={() => {
                                setIsRegister(true)
                                setIsPrintBudget(false)
                                setIsPrintContract(false)
                            }}
                        >
                            Voltar
                        </Button>
                    </ActionBar>
                    {isPrintBudget && (
                        <BudgetView elementId={budget.id} />
                    )}
                    {isPrintContract && (
                        <ContractPrintView />
                    )}
                </div>
            )}

            <WindowModal
                max
                title="Orçamento"
                id="budget-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                headerBottom={(
                    <div className="p-4 pb-0">
                        {isRegister && (
                            <BudgetActionBarForm
                                budget={budget}
                                onSet={setBudget}
                                isLoading={isLoading}
                                onSetIsLoading={setIsLoading}
                                onAfterSave={handleAfterSave}
                                onShowMessage={handleShowMessage}
                                onPrintBudget={handlePrintBudget}
                                onPrintContract={handlePrintContract}
                            />
                        )}
                        {isForShow && (
                            <ActionBar
                                className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"
                            >
                                <Button
                                    isLoading={isLoading}
                                    onClick={() => {
                                        handleEditClick(budget)
                                    }}
                                >
                                    Editar
                                </Button>
                            </ActionBar>
                        )}
                    </div>
                )}
            >
                {isRegister && (
                    <BudgetDataForm
                        budget={budget}
                        onSet={setBudget}
                        isLoading={isLoading}
                        onShowMessage={handleShowMessage}
                        isDisabled={
                            budget.status === "VENCIDO" ||
                            budget.status === "APROVADO" ||
                            budget.status === "REJEITADO"
                        }
                    />
                )}
                {isForShow && (
                    <BudgetView elementId={budget.id} />
                )}
            </WindowModal>
        </>
    )
}
