import Head from "next/head"
import List from "../components/list/list"
import Form from "../components/form/form"
import { useEffect, useState } from "react"
import FormRow from "../components/form/formRow"
import Layout from "../components/layout/layout"
import FormRowColumn from "../components/form/formRowColumn"
import { ProjectPayment, ProjectStage } from "../interfaces/objectInterfaces"

export default function Index() {
    const [isLoading, setIsLoading] = useState(true)
    const [projectStages, setProjectStages] = useState<ProjectStage[]>([])
    const [projectStagesForShow, setProjectStagesForShow] = useState<ProjectStage[]>([])

    const [projectPayments, setProjectPayments] = useState<ProjectPayment[]>([])
    const [projectPaymentsForShow, setProjectPaymentsForShow] = useState<ProjectPayment[]>([])

    const handleFilterStagesList = (string) => {
        let listItems = [...projectStages]
        let listItemsFiltered: ProjectStage[] = []
        listItemsFiltered = listItems.filter((element: ProjectStage, index) => {
            return element.description.toLowerCase().includes(string.toLowerCase())
        })
        setProjectStagesForShow((old) => listItemsFiltered)
    }

    const handleFilterPaymentsList = (string) => {
        let listItems = [...projectPayments]
        let listItemsFiltered: ProjectPayment[] = []
        listItemsFiltered = listItems.filter((element: ProjectPayment, index) => {
            return element.description.toLowerCase().includes(string.toLowerCase())
        })
        setProjectPaymentsForShow((old) => listItemsFiltered)
    }

    useEffect(() => {
        if (projectStages.length === 0) {
            fetch("api/projectStages").then((res) => res.json()).then((res) => {
                setProjectStages(res.list)
                setProjectStagesForShow(res.list)
                setIsLoading(false)
            })
        }

        if (projectPayments.length === 0) {
            fetch("api/projectPayments").then((res) => res.json()).then((res) => {
                setProjectPayments(res.list)
                setProjectPaymentsForShow(res.list)
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
                            list={projectStagesForShow}
                            onFilterList={handleFilterStagesList}
                            onTitle={(element: ProjectStage) => {
                                return (<p>{element.description}</p>)
                            }}
                            onInfo={(element: ProjectStage) => {
                                return (<p>{element.description}</p>)
                            }}
                        />
                    </FormRowColumn>

                    <FormRowColumn unit="2"></FormRowColumn>
                    
                    <FormRowColumn unit="2">
                        <List
                            autoSearch
                            canSeeInfo
                            title="Pagamentos"
                            isLoading={isLoading}
                            list={projectPaymentsForShow}
                            onFilterList={handleFilterPaymentsList}
                            onTitle={(element: ProjectPayment) => {
                                return (<p>{element.description}</p>)
                            }}
                            onInfo={(element: ProjectPayment) => {
                                return (<p>{element.description}</p>)
                            }}
                        />

                    </FormRowColumn>
                </FormRow>
            </Form>
        </Layout>
    )
}
