import Head from "next/head"
import List from "../components/list/list"
import Form from "../components/form/form"
import { useEffect, useState } from "react"
import FormRow from "../components/form/formRow"
import Layout from "../components/layout/layout"
import FormRowColumn from "../components/form/formRowColumn"
import { ServicePayment, ServiceStage } from "../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../components/modal/feedbackMessageModal"

export default function Index() {
    const [isFirst, setIsFirst] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [serviceStages, setServiceStages] = useState<ServiceStage[]>([])

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)
    const [servicePayments, setServicePayments] = useState<ServicePayment[]>([])

    const handleFilterStagesList = (string) => {
        let listItems = [...serviceStages]
        let listItemsFiltered: ServiceStage[] = []
        listItemsFiltered = listItems.filter((element: ServiceStage, index) => {
            return element.description.toLowerCase().includes(string.toLowerCase())
        })
        return listItemsFiltered
    }

    const handleFilterPaymentsList = (string) => {
        let listItems = [...servicePayments]
        let listItemsFiltered: ServicePayment[] = []
        listItemsFiltered = listItems.filter((element: ServicePayment, index) => {
            return element.description.toLowerCase().includes(string.toLowerCase())
        })
        return listItemsFiltered
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
            fetch("api/serviceStages").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setServiceStages(res.list)
                }
                setIsLoading(false)
            })
            fetch("api/servicePayments").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setServicePayments(res.list)
                }
                setIsLoading(false)
            })
        }
    })


    return (
        <Layout
            title="Testes">
            <Head>
                <title>Testes</title>
                <meta name="description" content="Testes" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Form>
                <FormRow>
                    <FormRowColumn unit="2">
                        <List
                            autoSearch
                            canSeeInfo
                            title="Etapas"
                            isLoading={isLoading}
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

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
