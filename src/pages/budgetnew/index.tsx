import Head from "next/head"
import { useEffect, useState } from "react"
import Layout from "../../components/layout/layout"
import { handleUTCToDateShow, handleNewDateToUTC } from "../../util/dateUtils"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import { Budget, Company, defaultBudget, Person } from "../../interfaces/objectInterfaces"
import ListTable from "../../components/list/listTable"
import FormRow from "../../components/form/formRow"
import FormRowColumn from "../../components/form/formRowColumn"
import Button from "../../components/button/button"
import WindowModal from "../../components/modal/windowModal"
import BudgetForm from "../../components/form/budgetForm"
import ActionBar from "../../components/bar/actionBar"
import BudgetView from "../../components/view/budgetView"
import BudgetActionBarForm from "../../components/bar/budgetActionBar"
import BudgetDataForm from "../../components/form/budgetDataForm"

export default function Index() {
    const [title, setTitle] = useState("Orçamentos")
    const [budget, setBudget] = useState<Budget>(defaultBudget)
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [messages, setMessages] = useState<string[]>([])

    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setBudget(defaultBudget)
        setIsRegister(false)
        setTitle("Orçamentos")
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
            ...budgets.slice(0, index),
            ...budgets.slice(index + 1, budgets.length),
        ]
        setBudgets(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setBudget({ ...defaultBudget, dateString: handleUTCToDateShow(handleNewDateToUTC().toString()) })
        setIsRegister(true)
    }

    const handleFilterList = (string) => {
        let listItems = [...budgets]
        let listItemsFiltered: Budget[] = []
        listItemsFiltered = listItems.filter((element: Budget, index) => {
            return element.title.toLowerCase().includes(string.toLowerCase())
        })
        return listItemsFiltered
    }

    const handleShowClick = async (project) => {
        setIsLoading(true)
        setBudget({ ...defaultBudget, ...project })
        setIsForShow(true)
        setIsLoading(false)
    }

    const handleEditClick = async (budget, index?) => {
        setIsLoading(true)
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
            console.log(budget)
            list = [
                ...budgets.slice(0, index),
                budget,
                ...budgets.slice(index + 1, budgets.length),
            ]
            setIndex(-1)
        }
        list = list.sort((elementOne: Budget, elementTwo: Budget) => {
            let dateOne = elementOne.dateInsertUTC
            let dateTwo = elementTwo.dateInsertUTC
            if (elementOne.dateLastUpdateUTC > 0 && elementOne.dateLastUpdateUTC > dateOne) {
                dateOne = elementOne.dateLastUpdateUTC
            }
            if (elementTwo.dateLastUpdateUTC > 0 && elementTwo.dateLastUpdateUTC > dateTwo) {
                dateTwo = elementTwo.dateLastUpdateUTC
            }
            return dateTwo - dateOne
        })
        setBudgets(list)
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
                    <span className="rounded text-slate-600 bg-slate-300 py-1 px-2 text-xs font-bold">
                        {element.status}
                    </span>
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
            /*
            fetch("api/checkPendencies").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.messages.length) {
                    setMessages(res.messages)
                }
            })
            */
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
                title="Orçamento"
                isLoading={isLoading}
                onSetIndex={setIndex}
                onTableRow={handlePutRows}
                onShowClick={handleShowClick}
                onEditClick={handleEditClick}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />

            {/*
            <FeedbackPendency messages={messages} />
*/}

            <WindowModal
                max
                title={title}
                isOpen={isRegister}
                id="budget-register-modal"
                headerBottom={(
                    <div className="p-4 pb-0">
                        <BudgetActionBarForm
                            budget={budget}
                            onSet={setBudget}
                            isLoading={isLoading}
                            onSetIsLoading={setIsLoading}
                            onAfterSave={handleAfterSave}
                            onShowMessage={handleShowMessage}
                        />
                    </div>
                )}
                setIsOpen={setIsRegister}>
                {isRegister && (
                    <BudgetDataForm
                        budget={budget}
                        onSet={setBudget}
                        isLoading={isLoading}
                        onShowMessage={handleShowMessage}
                    />
                )}
            </WindowModal>

            <WindowModal
                max
                isOpen={isForShow}
                title="Ver orçamento"
                id="budget-show-modal"
                setIsOpen={setIsForShow}>
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
