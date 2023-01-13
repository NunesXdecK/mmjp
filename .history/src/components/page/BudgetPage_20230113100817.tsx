import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import BudgetView from "../view/budgetView"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { PlusIcon } from "@heroicons/react/solid"
import NavBar, { NavBarPath } from "../bar/navBar"
import BudgetDataForm from "../form/budgetDataForm"
import ContractPrintView from "../view/contractPrintView"
import SwiftInfoButton from "../button/switchInfoButton"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { handleUTCToDateShow, handleNewDateToUTC, handleDateToShow, handleOnlyDate } from "../../util/dateUtils"
import BudgetActionBarForm, { handleSaveBudgetInner } from "../bar/budgetActionBar"
import { Budget, BudgetPayment, Company, defaultBudget, Person } from "../../interfaces/objectInterfaces"

interface BudgetPageProps {
    id?: string,
    getInfo?: boolean,
    canSave?: boolean,
    canDelete?: boolean,
    canUpdate?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    prevPath?: NavBarPath[],
    onSetPage?: (any) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function BudgetPage(props: BudgetPageProps) {
    const [budget, setBudget] = useState<Budget>(defaultBudget)
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
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

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleDeleteClick = async (budget, index) => {
        handleSetIsLoading(true)
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
        handleSetIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setBudget({
            ...defaultBudget,
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
        handleSetIsLoading(true)
        setBudget({ ...defaultBudget, ...budget })
        setIsForShow(true)
        handleSetIsLoading(false)
    }

    const handleEditClick = async (budget, index?) => {
        handleSetIsLoading(true)
        setIsForShow(false)
        let localBudget: Budget = await fetch("api/budget/" + budget?.id).then((res) => res.json()).then((res) => res.data)
        let localPayments = []
        if (localBudget?.payments?.length > 0) {
            localBudget.payments.map((element: BudgetPayment, index) => {
                localPayments = [...localPayments, { ...element, dateDue: handleOnlyDate(localBudget.dateDue) }]
            })
        }
        localBudget = {
            ...localBudget,
            payments: localPayments,
            dateDue: handleOnlyDate(localBudget.dateDue)
        }
        handleSetIsLoading(false)
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

    const handlePutModalTitle = (short: boolean) => {
        let paths = []
        let path: NavBarPath = { path: "Novo orçamento", onClick: null }
        if (short) {
            //path = { ...path, path: "S" }
        }
        if (budget?.id > 0) {
            path = { ...path, path: "Orçamento-" + budget.title, onClick: null }
        }
        try {
            if (props.prevPath?.length > 0) {
                let prevPath: NavBarPath = {
                    ...props.prevPath[props.prevPath?.length - 1],
                    onClick: handleBackClick,
                    path: props.prevPath[props.prevPath?.length - 1]?.path + "/",
                }
                paths = [...props.prevPath.slice(0, props.prevPath?.length - 1), prevPath,]
            }
            paths = [...paths, path]
        } catch (err) {
            console.error(err)
        }
        if (short) {
            return paths
        } else {
            return (
                <>
                    {paths?.length > 0 ? (<NavBar pathList={paths} />) : path.path}
                </>
            )
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
                            handleSetIsLoading(true)
                            const res = await handleSaveBudgetInner(budget, true)
                            handleSetIsLoading(false)
                            if (res.status === "ERROR") {
                                handleShowMessage(feedbackMessage)
                                return
                            }
                            feedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
                            handleAfterSave(feedbackMessage, budget, true)
                        }}
                    />
                </FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">{handleDateToShow(element.dateDue)}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            handleSetIsLoading(true)
            fetch("api/budgets").then((res) => res.json()).then((res) => {
                setBudgets(res.list ?? [])
                setIsFirst(old => false)
                handleSetIsLoading(false)
            })
        }
    })

    return (
        <>
            {!isPrintBudget && !isPrintContract && (
                <>
                    <ActionBar
                        isHidden={!props.canSave}
                        className="flex flex-row justify-end"
                    >
                        {/*
                        <Button
                            isLoading={props.isLoading}
                            isHidden={!props.canUpdate}
                            isDisabled={props.isDisabled}
                            onClick={() => {
                                setIndex(-1)
                                setIsFirst(true)
                                handleSetIsLoading(true)
                                handleBackClick()
                            }}
                        >
                            <RefreshIcon className="block h-4 w-4" aria-hidden="true" />
                        </Button>
                        */}
                        <Button
                            onClick={handleNewClick}
                            isHidden={!props.canSave}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                        >
                            <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                        </Button>
                    </ActionBar>
                    <ListTable
                        list={budgets}
                        isActive={index}
                        title="Orçamentos"
                        onSetIsActive={setIndex}
                        onTableRow={handlePutRows}
                        canDelete={props.canDelete}
                        isLoading={props.isLoading}
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
                            isLoading={props.isLoading}
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
                id="budget-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                title={(handlePutModalTitle(false))}
                headerBottom={(
                    <div className="p-4 pb-0">
                        {isRegister && (
                            <BudgetActionBarForm
                                budget={budget}
                                onSet={setBudget}
                                isLoading={props.isLoading}
                                onAfterSave={handleAfterSave}
                                onShowMessage={handleShowMessage}
                                onPrintBudget={handlePrintBudget}
                                onSetIsLoading={handleSetIsLoading}
                                onPrintContract={handlePrintContract}
                            />
                        )}
                        {isForShow && (
                            <ActionBar
                                className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"
                            >
                                <Button
                                    isLoading={props.isLoading}
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
                        isLoading={props.isLoading}
                        onShowMessage={handleShowMessage}
                        onSetIsLoading={handleSetIsLoading}
                        prevPath={(handlePutModalTitle(true))}
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
