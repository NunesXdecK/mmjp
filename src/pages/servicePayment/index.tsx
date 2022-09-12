import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import Button from "../../components/button/button"
import ServicePaymentView from "../../components/view/servicePaymentView"
import { handlePrepareServicePaymentForDB } from "../../util/converterUtil"
import ServicePaymentSingleForm from "../../components/form/servicePaymentSingleForm"
import { defaultServicePayment, ServicePayment } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid"
import FeedbackPendency from "../../components/modal/feedbackPendencyModal"

export default function ServicePayments() {
    const [title, setTitle] = useState("Lista de pagamentos")
    const [servicePayment, setServicePayment] = useState<ServicePayment>(defaultServicePayment)
    const [servicePayments, setServicePayments] = useState<ServicePayment[]>([])
    const [messages, setMessages] = useState<string[]>([])

    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isRegister, setIsRegister] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setServicePayments([])
        setServicePayment(defaultServicePayment)
        setIsFirst(true)
        setIsLoading(true)
        setIsRegister(false)
        setTitle("Lista de pagamentos")
    }

    const handleDeleteClick = async (servicePayment) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/servicePayment", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: servicePayment.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const index = servicePayments.indexOf(servicePayment)
        const list = [
            ...servicePayments.slice(0, index),
            ...servicePayments.slice(index + 1, servicePayments.length),
        ]
        setServicePayments(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = () => {
        setIsRegister(true)
        setServicePayment(defaultServicePayment)
        setTitle("Novo etapa")
    }

    const sortByDate = (elementOne, elementTwo) => {
        let dateOne = 0
        let dateTwo = 0
        if (elementOne && elementTwo) {
            if ("dateLastUpdateUTC" in elementOne) {
                dateOne = elementOne.dateLastUpdateUTC
            } else if ("dateInsertUTC" in elementOne) {
                dateOne = elementOne.dateInsertUTC
            }
            if ("dateLastUpdateUTC" in elementTwo) {
                dateTwo = elementTwo.dateLastUpdateUTC
            } else if ("dateInsertUTC" in elementTwo) {
                dateTwo = elementTwo.dateInsertUTC
            }
        }
        return dateTwo - dateOne
    }

    const sortByPriority = (elementOne, elementTwo) => {
        let priorityOne = 0
        let priorityTwo = 0
        if (elementOne && elementTwo) {
            if ("priority" in elementOne) {
                priorityOne = elementOne.priority
            }
            if ("priority" in elementTwo) {
                priorityTwo = elementTwo.priority
            }
        }
        return priorityTwo - priorityOne
    }

    const handleFilterList = (string) => {
        let listItems = [...servicePayments]
        let listItemsFiltered: ServicePayment[] = []
        let listItemsNormal: ServicePayment[] = []
        let listItemsNormalFinal: ServicePayment[] = []
        let listItemsArchive: ServicePayment[] = []
        let listItemsFinished: ServicePayment[] = []
        let listItemsPendency: ServicePayment[] = []

        listItems.map((element, index) => {
            let status = element.status
            switch (status) {
                case "NORMAL":
                    listItemsNormal = [...listItemsNormal, element]
                    break
                case "ARQUIVADO":
                    listItemsArchive = [...listItemsArchive, element]
                    break
                case "FINALIZADO":
                    listItemsFinished = [...listItemsFinished, element]
                    break
                case "PENDENTE":
                    listItemsPendency = [...listItemsPendency, element]
                    break
            }
        })

        listItemsFiltered = [
            ...listItemsPendency.sort(sortByDate).sort(sortByPriority),
            ...listItemsNormal.sort(sortByDate).sort(sortByPriority),
            ...listItemsFinished.sort(sortByDate).sort(sortByPriority),
            ...listItemsArchive.sort(sortByDate).sort(sortByPriority),
        ]

        return listItemsFiltered.filter((element: ServicePayment, index) => {
            return element.description.toLowerCase().includes(string.toLowerCase())
        })
    }

    const handleEditClick = async (servicePayment) => {
        setIsLoading(true)
        let localServicePayment: ServicePayment = { ...servicePayment }
        try {
            localServicePayment = await fetch("api/servicePayment/" + localServicePayment.id).then((res) => res.json()).then((res) => res.data)
        } catch (err) {
            console.error(err)
        }
        setIsLoading(false)
        setServicePayment(localServicePayment)
        setIsRegister(true)
        setTitle("Editar etapa")
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage) => {
        handleBackClick()
        handleShowMessage(feedbackMessage)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    const handleSaveServicePayment = async (servicePayment, history) => {
        let res = { status: "ERROR", id: "", servicePayment: servicePayment }
        let servicePaymentForDB = handlePrepareServicePaymentForDB(servicePayment)
        try {
            const saveRes = await fetch("api/servicePayment", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: servicePaymentForDB, history: history, changeProject: false }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, servicePayment: { ...servicePayment, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleCustomButtonsClick = async (element: ServicePayment, option: "top" | "up" | "down" | "bottom") => {
        setIsLoading(true)
        let listItems: ServicePayment[] = []
        servicePayments.map((servicePayment: ServicePayment, index) => {
            let status = servicePayment.status
            if (status === "NORMAL") {
                listItems = [...listItems, servicePayment]
            }
        })
        let priority = -1
        let priorityUp = -1
        let priorityDown = -1
        listItems = listItems.sort(sortByPriority)
        listItems.map((servicePayment: ServicePayment, index) => {
            if (servicePayment.id === element.id) {
                if (listItems[index - 1]) {
                    priorityUp = listItems[index - 1].priority
                }
                if (listItems[index + 1]) {
                    priorityDown = listItems[index + 1].priority
                }
            }
        })
        switch (option) {
            case "top":
                priority = listItems[0].priority + 1
                break
            case "up":
                /*
                listItems.map((servicePayment, index) => {
                    if (priority === -1) {
                        if (element.priority === servicePayment.priority) {
                            priority = listItems[index - 1].priority
                        }
                    }
                })
                priority = priority + 1
                */
                priority = priorityUp + 1
                break
            case "down":
                /*
                listItems.map((servicePayment, index) => {
                    if (priority === -1) {
                        if (element.priority === servicePayment.priority) {
                            priority = listItems[index + 1].priority
                        }
                    }
                })
                if (priority > 0) {
                    priority = priority - 1
                }
                */
                priority = priorityDown - 1
                break
            case "bottom":
                priority = listItems[listItems.length - 1].priority - 1
                break
        }
        await handleSaveServicePayment({ ...element, priority: priority }, true)
        setIsFirst(true)
    }

    const handlePutCustomButtons = (element: ServicePayment) => {
        let listItems: ServicePayment[] = []
        servicePayments.map((servicePayment: ServicePayment, index) => {
            let status = servicePayment.status
            if (status === "NORMAL") {
                if (element.id === servicePayment.id) {
                    localIndex = index
                }
                listItems = [...listItems, servicePayment]
            }
        })
        let localIndex = -1
        listItems = listItems.sort(sortByPriority)
        listItems.map((servicePayment: ServicePayment, index) => {
            if (element.id === servicePayment.id) {
                localIndex = index
            }
        })
        let priorityMax = listItems[0]?.priority
        let priorityMin = listItems[listItems.length - 1]?.priority
        return (
            <>
                {element.status === "NORMAL" && (
                    <>
                        {localIndex > 0 && (
                            <>
                                <Button
                                    className="mr-2 mb-2 sm:mb-0"
                                    onClick={() => handleCustomButtonsClick(element, "top")}
                                >
                                    <ChevronDoubleUpIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                </Button>
                                <Button
                                    className="mr-2 mb-2 sm:mb-0"
                                    onClick={() => handleCustomButtonsClick(element, "up")}
                                >
                                    <ChevronUpIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                </Button>
                            </>
                        )}
                        {localIndex < (listItems.length - 1) && (
                            <>
                                <Button
                                    className="mr-2 mb-2 sm:mb-0"
                                    onClick={() => handleCustomButtonsClick(element, "down")}
                                >
                                    <ChevronDownIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                </Button>
                                <Button
                                    className="mr-2 mb-2 sm:mb-0"
                                    onClick={() => handleCustomButtonsClick(element, "bottom")}
                                >
                                    <ChevronDoubleDownIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                </Button>
                            </>
                        )}
                    </>
                )}
            </>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/servicePayments").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setServicePayments(res.list)
                }
                setIsLoading(false)
            })
            fetch("api/checkPendencies").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.messages.length) {
                    setMessages(res.messages)
                }
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

            {!isRegister ? (
                <List
                    canEdit
                    canDelete
                    canSeeInfo
                    autoSearch
                    title={title}
                    isLoading={isLoading}
                    onNewClick={handleNewClick}
                    onEditClick={handleEditClick}
                    onFilterList={handleFilterList}
                    onDeleteClick={handleDeleteClick}
                    onCustomButtons={handlePutCustomButtons}
                    onSetElement={setServicePayment}
                    deleteWindowTitle={"Deseja realmente deletar " + servicePayment.description + "?"}
                    onTitle={(element: ServicePayment) => {
                        return (
                            <ServicePaymentView
                                title=""
                                hideData
                                hideBorder
                                hidePaddingMargin
                                servicePayment={element}
                            />
                        )
                    }}
                    onInfo={(element: ServicePayment) => {
                        return (<ServicePaymentView elementId={element.id} />)
                    }}
                />
            ) : (
                <ServicePaymentSingleForm
                    canAutoSave
                    isBack={true}
                    servicePayment={servicePayment}
                    onBack={handleBackClick}
                    title="Informações do etapa"
                    onAfterSave={handleAfterSave}
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre a etapa" />
            )}

            <FeedbackPendency messages={messages} />

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
