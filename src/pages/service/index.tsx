import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import ServiceView from "../../components/view/serviceView"
import { handlePrepareServiceForShow } from "../../util/converterUtil"
import ServiceSingleForm from "../../components/form/serviceSingleForm"
import { defaultService, Service } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

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

    const handleFilterList = (string) => {
        let listItems = [...services]
        let listItemsFiltered: Service[] = []
        let listItemsNormal: Service[] = []
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
            let prorityTwo = 0
            if (elementOne && elementTwo) {
                if ("priority" in elementOne) {
                    priorityOne = elementOne.priority
                }
                if ("priority" in elementTwo) {
                    prorityTwo = elementTwo.priority
                }
            }
            return priorityOne - prorityTwo
        }
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
                        return (<ServiceView id={element.id} />)
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
