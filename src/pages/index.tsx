import Head from "next/head"
import List from "../components/list/list"
import Form from "../components/form/form"
import { useEffect, useState } from "react"
import FormRow from "../components/form/formRow"
import Layout from "../components/layout/layout"
import FormRowColumn from "../components/form/formRowColumn"
import { defaultProject, defaultService, defaultServicePayment, defaultServiceStage, Service, ServicePayment, ServiceStage } from "../interfaces/objectInterfaces"
import ServiceForm from "../components/listForm/serviceForm"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../components/modal/feedbackMessageModal"
import Button from "../components/button/button"
import { handleServicePaymentsValidationForDB, handleServiceStagesValidationForDB, handleServicesValidationForDB } from "../util/validationUtil"
import { handlePrepareServiceForDB, handlePrepareServicePaymentForDB, handlePrepareServiceStageForDB } from "../util/converterUtil"

export default function Index() {
    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [serviceStages, setServiceStages] = useState<ServiceStage[]>([])
    const [serviceStagesForShow, setServiceStagesForShow] = useState<ServiceStage[]>([])
    const [services, setServices] = useState<Service[]>([])

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)
    const [servicePayments, setServicePayments] = useState<ServicePayment[]>([])
    const [servicePaymentsForShow, setServicePaymentsForShow] = useState<ServicePayment[]>([])

    const handleFilterStagesList = (string) => {
        let listItems = [...serviceStages]
        let listItemsFiltered: ServiceStage[] = []
        listItemsFiltered = listItems.filter((element: ServiceStage, index) => {
            return element.description.toLowerCase().includes(string.toLowerCase())
        })
        setServiceStagesForShow((old) => listItemsFiltered)
    }

    const handleFilterPaymentsList = (string) => {
        let listItems = [...servicePayments]
        let listItemsFiltered: ServicePayment[] = []
        listItemsFiltered = listItems.filter((element: ServicePayment, index) => {
            return element.description.toLowerCase().includes(string.toLowerCase())
        })
        setServicePaymentsForShow((old) => listItemsFiltered)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    useEffect(() => {
        {/*
        if (isFirst) {
            fetch("api/serviceStages").then((res) => res.json()).then((res) => {
                console.log("entrou aqui etapas")
                if (res.list.length) {
                    setServiceStages(res.list)
                    setServiceStagesForShow(res.list)
                }
                setIsFirst(false)
                setIsLoading(false)
            })
            fetch("api/servicePayments").then((res) => res.json()).then((res) => {
                console.log("entrou aqui pagamentos")
                if (res.list.length) {
                    setServicePayments(res.list)
                    setServicePaymentsForShow(res.list)
                }
                setIsFirst(false)
                setIsLoading(false)
            })
        }
    */}
    })

    const handleServiceSave = async () => {
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }
        let localServices = []
        if (services.length === 0) {
            return
        }
        services.map((element: Service, index) => {
            localServices = [...localServices, {
                ...element,
                project: { ...defaultProject, id: "Kj0oXZlraJsxXThZmiW8" }
            }]
        })
        let validation = handleServicesValidationForDB(localServices, false, false)
        if (!validation.validation) {
            feedbackMessage = { ...feedbackMessage, messageType: "ERROR", messages: validation.messages }
            handleShowMessage(feedbackMessage)
            return
        }
        let localServiceWithId = []
        let res = { status: "ERROR", id: "", message: "" }
        if (localServices.length) {
            await Promise.all(localServices.map(async (element: Service, index) => {
                let serviceForDB = handlePrepareServiceForDB(element)
                res = await fetch("api/service", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", data: serviceForDB }),
                }).then((res) => res.json())
                if (res.status === "ERROR") {
                    feedbackMessage = { ...feedbackMessage, messageType: "ERROR", messages: ["Erro ao adicionar"] }
                    handleShowMessage(feedbackMessage)
                    return
                }
                localServiceWithId = [...localServiceWithId, { ...element, id: res.id }]
            }))
        }
        if (res.status === "ERROR") {
            feedbackMessage = { ...feedbackMessage, messageType: "ERROR", messages: ["Erro ao adicionar"] }
            handleShowMessage(feedbackMessage)
            return
        }
        let localServiceStages = []
        let localServicePayments = []
        localServiceWithId.map((element: Service, index) => {
            element.serviceStages.map((elementStage: ServiceStage, index) => {
                let localServiceStage = { ...elementStage, service: element }
                localServiceStages = [...localServiceStages, localServiceStage]
            })
            element.servicePayments.map((elementPayment: ServicePayment, index) => {
                let localServicePayment = { ...elementPayment, service: element }
                localServicePayments = [...localServicePayments, localServicePayment]
            })
        })
        let validationStages = handleServiceStagesValidationForDB(localServiceStages, true)
        let validationPayments = handleServicePaymentsValidationForDB(localServicePayments, true)
        validation = {
            validation: validationStages.validation && validationPayments.validation,
            messages: [...validationStages.messages, ...validationPayments.messages]
        }
        if (!validation.validation) {
            feedbackMessage = { ...feedbackMessage, messageType: "ERROR", messages: validation.messages }
            handleShowMessage(feedbackMessage)
            return
        }
        let localServiceStagesWithId = []
        let localServicePaymentsWithId = []
        if (localServiceStages.length) {
            await Promise.all(localServiceStages.map(async (element: ServiceStage, index) => {
                let serviceStageForDB = handlePrepareServiceStageForDB(element)
                res = await fetch("api/serviceStage", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", data: serviceStageForDB }),
                }).then((res) => res.json())
                if (res.status === "ERROR") {
                    feedbackMessage = { ...feedbackMessage, messageType: "ERROR", messages: ["Erro ao adicionar"] }
                    handleShowMessage(feedbackMessage)
                    return
                }
                localServiceStagesWithId = [...localServiceStagesWithId, { ...element, id: res.id }]
            }))
        }
        if (res.status === "ERROR") {
            feedbackMessage = { ...feedbackMessage, messageType: "ERROR", messages: ["Erro ao adicionar"] }
            handleShowMessage(feedbackMessage)
            return
        }
        if (localServicePayments.length) {
            await Promise.all(localServicePayments.map(async (element: ServicePayment, index) => {
                let serviceStageForDB = handlePrepareServicePaymentForDB(element)
                res = await fetch("api/servicePayment", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", data: serviceStageForDB }),
                }).then((res) => res.json())
                if (res.status === "ERROR") {
                    feedbackMessage = { ...feedbackMessage, messageType: "ERROR", messages: ["Erro ao adicionar"] }
                    handleShowMessage(feedbackMessage)
                    return
                }
                localServicePaymentsWithId = [...localServicePaymentsWithId, { ...element, id: res.id }]
            }))
        }
        if (res.status === "ERROR") {
            feedbackMessage = { ...feedbackMessage, messageType: "ERROR", messages: ["Erro ao adicionar"] }
            handleShowMessage(feedbackMessage)
            return
        }
        let localServiceFinal = []
        localServiceWithId.map((element, index) => {
            let serviceStages = []
            let servicePayments = []
            localServiceStagesWithId.map((elementStages, index) => {
                if (element.id === elementStages.service.id) {
                    serviceStages = [...serviceStages, elementStages]
                }
            })
            localServicePaymentsWithId.map((elementPayments, index) => {
                if (element.id === elementPayments.service.id) {
                    servicePayments = [...servicePayments, elementPayments]
                }
            })
            element = { ...element, serviceStages: serviceStages, servicePayments: servicePayments }
            localServiceFinal = [...localServiceFinal, element]
        })
        setServices(localServiceFinal.sort((elementOne: Service, elementTwo: Service) => {
            return elementOne.index - elementTwo.index
        }))
        feedbackMessage = { ...feedbackMessage, messageType: "SUCCESS", messages: ["Deu tudo certo"] }
        handleShowMessage(feedbackMessage)
    }

    return (
        <Layout
            title="Dashboard">
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="Dashboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ServiceForm
                title="Serviços"
                services={services}
                onSetServices={setServices}
                subtitle="Adicione os serviços"
                onShowMessage={handleShowMessage}
            />
            <Button onClick={handleServiceSave}>Teste</Button>

            {/*
            <Form>
                <FormRow>
                    <FormRowColumn unit="2">
                        <List
                            autoSearch
                            canSeeInfo
                            title="Etapas"
                            isLoading={isLoading}
                            list={serviceStagesForShow}
                            onFilterList={handleFilterStagesList}
                            onTitle={(element: ServiceStage) => {
                                return (<p>{element.description}</p>)
                            }}
                            onInfo={(element: ServiceStage) => {
                                return (<p>{element.description}</p>)
                            }}
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="2">
                    </FormRowColumn>
                    <FormRowColumn unit="2">
                        <List
                            autoSearch
                            canSeeInfo
                            title="Pagamentos"
                            isLoading={isLoading}
                            list={servicePaymentsForShow}
                            onFilterList={handleFilterPaymentsList}
                            onTitle={(element: ServicePayment) => {
                                return (<p>{element.description}</p>)
                            }}
                            onInfo={(element: ServicePayment) => {
                                return (<p>{element.description}</p>)
                            }}
                        />

                    </FormRowColumn>
                </FormRow>
            </Form>
                */}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
