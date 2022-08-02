import Head from "next/head"
import List from "../components/list/list"
import Form from "../components/form/form"
import { useEffect, useState } from "react"
import FormRow from "../components/form/formRow"
import Layout from "../components/layout/layout"
import FormRowColumn from "../components/form/formRowColumn"
import ServiceForm from "../components/listForm/serviceForm"
import { ServicePayment, ServiceStage } from "../interfaces/objectInterfaces"

export default function Index() {
    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [serviceStages, setServiceStages] = useState<ServiceStage[]>([])
    const [serviceStagesForShow, setServiceStagesForShow] = useState<ServiceStage[]>([])

    const [servicePayments, setServicePayments] = useState<ServicePayment[]>([])
    const [servicePaymentsForShow, setServicePaymentsForShow] = useState<ServicePayment[]>([])

    const [clients, setClients] = useState([])

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

    useEffect(() => {
        if (isFirst) {
            fetch("api/serviceStages").then((res) => res.json()).then((res) => {
                if (res.list.length) {
                    setServiceStages(res.list)
                    setServiceStagesForShow(res.list)
                }
                setIsFirst(false)
                setIsLoading(false)
            })
            fetch("api/servicePayments").then((res) => res.json()).then((res) => {
                if (res.list.length) {
                    setServicePayments(res.list)
                    setServicePaymentsForShow(res.list)
                }
                setIsFirst(false)
                setIsLoading(false)
            })
        }
    })
    return (
        <Layout
            title="Dashboard">
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="Dashboard" />
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
        </Layout>
    )
}
