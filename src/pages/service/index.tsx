import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import ServiceView from "../../components/view/serviceView"
import { handlePrepareServiceForDB, handlePrepareServiceForShow } from "../../util/converterUtil"
import ServiceSingleForm from "../../components/form/serviceSingleForm"
import { defaultService, Service } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import Button from "../../components/button/button"
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid"

export default function Services() {
    const [title, setTitle] = useState("Lista de serviços")
    const [service, setService] = useState<Service>(defaultService)
    const [services, setServices] = useState<Service[]>([])

    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isRegister, setIsRegister] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setServices([])
        setService(defaultService)
        setIsFirst(true)
        setIsLoading(true)
        setIsRegister(false)
        setTitle("Lista de serviços")
    }

    const handleDeleteClick = async (service) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/service", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: service.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const index = services.indexOf(service)
        const list = [
            ...services.slice(0, index),
            ...services.slice(index + 1, services.length),
        ]
        setServices(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = () => {
        setIsRegister(true)
        setService(defaultService)
        setTitle("Novo serviço")
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
        let listItems = [...services]
        let listItemsFiltered: Service[] = []
        let listItemsNormal: Service[] = []
        let listItemsNormalFinal: Service[] = []
        let listItemsArchive: Service[] = []
        let listItemsFinished: Service[] = []
        let listItemsPendency: Service[] = []

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
            ...listItemsNormal.sort(sortByDate).sort(sortByPriority),
            ...listItemsFinished.sort(sortByDate).sort(sortByPriority),
            ...listItemsArchive.sort(sortByDate).sort(sortByPriority),
        ]

        return listItemsFiltered.filter((element: Service, index) => {
            return element.title.toLowerCase().includes(string.toLowerCase())
        })
    }

    const handleEditClick = async (service) => {
        setIsLoading(true)
        let localService: Service = { ...service }
        try {
            localService = await fetch("api/service/" + localService.id).then((res) => res.json()).then((res) => res.data)
        } catch (err) {
            console.error(err)
        }
        localService = handlePrepareServiceForShow(localService)
        setIsLoading(false)
        setService(localService)
        setIsRegister(true)
        setTitle("Editar serviço")
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

    const handleSaveService = async (service, history) => {
        let res = { status: "ERROR", id: "", service: service }
        let serviceForDB = handlePrepareServiceForDB(service)
        try {
            const saveRes = await fetch("api/service", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: serviceForDB, history: history, changeProject: false }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, service: { ...service, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleCustomButtonsClick = async (element: Service, option: "top" | "up" | "down" | "bottom") => {
        setIsLoading(true)
        let listItems: Service[] = []
        services.map((service: Service, index) => {
            let status = service.status
            if (status === "NORMAL") {
                listItems = [...listItems, service]
            }
        })
        let priority = -1
        let priorityUp = -1
        let priorityDown = -1
        listItems = listItems.sort(sortByPriority)
        listItems.map((service: Service, index) => {
            if (service.id === element.id) {
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
                listItems.map((service, index) => {
                    if (priority === -1) {
                        if (element.priority === service.priority) {
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
                listItems.map((service, index) => {
                    if (priority === -1) {
                        if (element.priority === service.priority) {
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
        await handleSaveService({ ...element, priority: priority }, true)
        setIsFirst(true)
    }

    const handlePutCustomButtons = (element: Service) => {
        let listItems: Service[] = []
        services.map((service: Service, index) => {
            let status = service.status
            if (status === "NORMAL") {
                if (element.id === service.id) {
                    localIndex = index
                }
                listItems = [...listItems, service]
            }
        })
        let localIndex = -1
        listItems = listItems.sort(sortByPriority)
        listItems.map((service: Service, index) => {
            if (element.id === service.id) {
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
            fetch("api/services").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setServices(res.list)
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
                    onSetElement={setService}
                    deleteWindowTitle={"Deseja realmente deletar " + service.title + "?"}
                    onTitle={(element: Service) => {
                        return (
                            <ServiceView
                                title=""
                                hideData
                                hideBorder
                                hidePaddingMargin
                                service={element}
                            />
                        )
                    }}
                    onInfo={(element: Service) => {
                        return (<ServiceView elementId={element.id} />)
                    }}
                />
            ) : (
                <ServiceSingleForm
                    canAutoSave
                    isBack={true}
                    service={service}
                    onBack={handleBackClick}
                    title="Informações do serviço"
                    onAfterSave={handleAfterSave}
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre a serviço" />
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
