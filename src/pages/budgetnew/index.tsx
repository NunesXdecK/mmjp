import Head from "next/head"
import { useEffect, useState } from "react"
import Layout from "../../components/layout/layout"
import FormRow from "../../components/form/formRow"
import Button from "../../components/button/button"
import ActionBar from "../../components/bar/actionBar"
import ListTable from "../../components/list/listTable"
import BudgetView from "../../components/view/budgetView"
import WindowModal from "../../components/modal/windowModal"
import FormRowColumn from "../../components/form/formRowColumn"
import BudgetDataForm from "../../components/form/budgetDataForm"
import BudgetActionBarForm from "../../components/bar/budgetActionBar"
import FeedbackPendency from "../../components/modal/feedbackPendencyModal"
import { handleUTCToDateShow, handleNewDateToUTC } from "../../util/dateUtils"
import { Budget, Company, defaultBudget, Person } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import ContractPrintView from "../../components/view/contractPrintView"

export default function Index() {
    const [title, setTitle] = useState("Orçamentos")
    const [budget, setBudget] = useState<Budget>(defaultBudget)
    const [budgets, setBudgets] = useState<Budget[]>([])

    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)
    const [isPrintBudget, setIsPrintBudget] = useState(false)
    const [isPrintContract, setIsPrintContract] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

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
        setBudget({ ...defaultBudget, dateString: handleUTCToDateShow(handleNewDateToUTC().toString()) })
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

    const handleShowClick = (project) => {
        setIsLoading(true)
        setBudget({ ...defaultBudget, ...project })
        setIsForShow(true)
        setIsLoading(false)
    }

    const handleEditClick = async (budget, index?) => {
        setIsLoading(true)
        setIsForShow(false)
        let localBudget: Budget = await fetch("api/budget/" + budget.id).then((res) => res.json()).then((res) => res.data)
        let localClients = []
        if (localBudget.clients && localBudget.clients?.length > 0) {
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
        localBudget = {
            ...localBudget,
            clients: localClients,
            dateString: handleUTCToDateShow(localBudget.date.toString()),
        }
        setIsLoading(false)
        setIsRegister(true)
        setBudget(localBudget)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, budget: Budget) => {
        handleBackClick()
        let list: Budget[] = [
            budget,
            ...budgets,
        ]
        if (index > -1) {
            list = [
                budget,
                ...budgets.slice(0, (index - 1)),
                ...budgets.slice(index, budgets.length),
            ]
        }
        setIndex((old) => -1)
        setBudgets((old) => list)
        handleShowMessage(feedbackMessage)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    const handlePutHeaders = () => {
        return (
            <FormRow className="flex flex-row">
                <FormRowColumn unit="4">Nome</FormRowColumn>
                <FormRowColumn unit="1">Status</FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">Data</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: Budget) => {
        return (
            <>
                <FormRowColumn unit="4">{element.title}</FormRowColumn>
                <FormRowColumn unit="1">
                    {element.status === "ORÇAMENTO" && (
                        <span className="rounded text-slate-600 bg-slate-300 py-1 px-2 text-xs font-bold">
                            {element.status}
                        </span>
                    )}
                    {element.status === "ARQUIVADO" && (
                        <span className="rounded text-red-600 bg-red-300 py-1 px-2 text-xs font-bold">
                            {element.status}
                        </span>
                    )}
                    {element.status === "FINALIZADO" && (
                        <span className="rounded text-green-600 bg-green-300 py-1 px-2 text-xs font-bold">
                            {element.status}
                        </span>
                    )}
                </FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">{handleUTCToDateShow(element.date.toString())}</FormRowColumn>
            </>
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
        <Layout
            title={title}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={title} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {!isPrintBudget && !isPrintContract && (
                <>
                    <div className="p-4 pb-0">
                        <ActionBar>
                            <Button
                                isLoading={isLoading}
                                onClick={handleNewClick}
                            >
                                Novo
                            </Button>
                            <Button
                                isLoading={isLoading}
                                onClick={() => {
                                    setIndex(-1)
                                    setIsFirst(true)
                                    setIsLoading(true)
                                    handleBackClick()
                                }}
                            >
                                Atualizar
                            </Button>
                        </ActionBar>
                    </div>

                    <ListTable
                        list={budgets}
                        isActive={index}
                        title="Orçamento"
                        isLoading={isLoading}
                        onSetIsActive={setIndex}
                        onTableRow={handlePutRows}
                        onShowClick={handleShowClick}
                        onEditClick={handleEditClick}
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

            <FeedbackPendency isFirst={isFirst} />

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
                                className="bg-slate-50 dark:bg-slate-800"
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
                    />
                )}
                {isForShow && (
                    <BudgetView elementId={budget.id} />
                )}
            </WindowModal>

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
