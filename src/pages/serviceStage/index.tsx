import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import Button from "../../components/button/button"
import ServiceStageView from "../../components/view/serviceStageView"
import { handlePrepareServicePaymentStageForShow, handlePrepareServiceStageForDB } from "../../util/converterUtil"
import ServiceStageSingleForm from "../../components/form/serviceStageSingleForm"
import { defaultServiceStage, ServiceStage } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid"
import FeedbackPendency from "../../components/modal/feedbackPendencyModal"

export default function ServiceStages() {
    const [title, setTitle] = useState("Lista de etapas")
    const [serviceStage, setServiceStage] = useState<ServiceStage>(defaultServiceStage)
    const [serviceStages, setServiceStages] = useState<ServiceStage[]>([])
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
        setServiceStages([])
        setServiceStage(defaultServiceStage)
        setIsFirst(true)
        setIsLoading(true)
        setIsRegister(false)
        setTitle("Lista de etapas")
    }

    const handleDeleteClick = async (serviceStage) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/serviceStage", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: serviceStage.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const index = serviceStages.indexOf(serviceStage)
        const list = [
            ...serviceStages.slice(0, index),
            ...serviceStages.slice(index + 1, serviceStages.length),
        ]
        setServiceStages(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = () => {
        setIsRegister(true)
        setServiceStage(defaultServiceStage)
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
        let listItems = [...serviceStages]
        let listItemsFiltered: ServiceStage[] = []
        let listItemsNormal: ServiceStage[] = []
        let listItemsNormalFinal: ServiceStage[] = []
        let listItemsArchive: ServiceStage[] = []
        let listItemsFinished: ServiceStage[] = []
        let listItemsPendency: ServiceStage[] = []

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

        listItemsNormal = listItemsNormal.sort(sortByDate).sort(sortByPriority)
        listItemsNormal.map((element, index) => {
            listItemsNormalFinal = [...listItemsNormalFinal, { ...element, priorityView: index + 1 }]
        })

        listItemsFiltered = [
            ...listItemsPendency.sort(sortByDate).sort(sortByPriority),
            ...listItemsNormalFinal.sort(sortByDate).sort(sortByPriority),
            ...listItemsFinished.sort(sortByDate).sort(sortByPriority),
            ...listItemsArchive.sort(sortByDate).sort(sortByPriority),
        ]

        return listItemsFiltered.filter((element: ServiceStage, index) => {
            return element.title.toLowerCase().includes(string.toLowerCase())
        })
    }

    const handleEditClick = async (serviceStage) => {
        setIsLoading(true)
        let localServiceStage: ServiceStage = { ...serviceStage }
        try {
            localServiceStage = await fetch("api/serviceStage/" + localServiceStage.id).then((res) => res.json()).then((res) => res.data)
        } catch (err) {
            console.error(err)
        }
        localServiceStage = handlePrepareServicePaymentStageForShow([localServiceStage])[0]
        setIsLoading(false)
        setServiceStage(localServiceStage)
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

    const handleSaveServiceStage = async (serviceStage, history) => {
        let res = { status: "ERROR", id: "", serviceStage: serviceStage }
        let serviceStageForDB = handlePrepareServiceStageForDB(serviceStage)
        try {
            const saveRes = await fetch("api/serviceStage", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: serviceStageForDB, history: history, changeProject: false }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, serviceStage: { ...serviceStage, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleCustomButtonsClick = async (element: ServiceStage, option: "top" | "up" | "down" | "bottom") => {
        setIsLoading(true)
        let listItems: ServiceStage[] = []
        serviceStages.map((serviceStage: ServiceStage, index) => {
            let status = serviceStage.status
            if (status === "NORMAL") {
                listItems = [...listItems, serviceStage]
            }
        })
        let priority = -1
        let priorityUp = -1
        let priorityDown = -1
        listItems = listItems.sort(sortByPriority)
        listItems.map((serviceStage: ServiceStage, index) => {
            if (serviceStage.id === element.id) {
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
                listItems.map((serviceStage, index) => {
                    if (priority === -1) {
                        if (element.priority === serviceStage.priority) {
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
                listItems.map((serviceStage, index) => {
                    if (priority === -1) {
                        if (element.priority === serviceStage.priority) {
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
        await handleSaveServiceStage({ ...element, priority: priority }, true)
        setIsFirst(true)
    }

    const handlePutCustomButtons = (element: ServiceStage) => {
        let listItems: ServiceStage[] = []
        serviceStages.map((serviceStage: ServiceStage, index) => {
            let status = serviceStage.status
            if (status === "NORMAL") {
                if (element.id === serviceStage.id) {
                    localIndex = index
                }
                listItems = [...listItems, serviceStage]
            }
        })
        let localIndex = -1
        listItems = listItems.sort(sortByPriority)
        listItems.map((serviceStage: ServiceStage, index) => {
            if (element.id === serviceStage.id) {
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
            fetch("api/serviceStages").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setServiceStages(res.list)
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
                    onSetElement={setServiceStage}
                    deleteWindowTitle={"Deseja realmente deletar " + serviceStage.title + "?"}
                    onTitle={(element: ServiceStage) => {
                        return (
                            <ServiceStageView
                                title=""
                                hideData
                                hideBorder
                                hidePaddingMargin
                                serviceStage={element}
                            />
                        )
                    }}
                    onInfo={(element: ServiceStage) => {
                        return (<ServiceStageView elementId={element.id} />)
                    }}
                />
            ) : (
                <ServiceStageSingleForm
                    isBack={true}
                    serviceStage={serviceStage}
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
