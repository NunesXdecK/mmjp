import Head from "next/head"
import { useEffect, useState } from "react"
import Form from "../components/form/form"
import Button from "../components/button/button"
import FormRow from "../components/form/formRow"
import Layout from "../components/layout/layout"
import FormRowColumn from "../components/form/formRowColumn"
import ProjectPaymentFormTest from "../components/form/projectPaymentFormNew"
import { defaultProjectPayment, ProjectPayment } from "../interfaces/objectInterfaces"

export default function Index() {
    const [projectPayments, setProjectPayments] = useState([])

    const handleReturnData = (projectPayment: ProjectPayment) => {
        console.log(projectPayment)
    }

    const handeOnDelete = (index: number) => {
        let localProjectPayments = [...projectPayments]
        localProjectPayments.splice(index, 1)
        setProjectPayments((old) => localProjectPayments)
    }

    {/*
    useEffect(() => {
        const handleBackButton = (event) => {
            event.preventDefault()
            event.stopPropagation()
            console.log("retornei")
        }
        
        window.onpopstate = () => {}
        window.addEventListener("popstate", handleBackButton);
    })
*/}

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
                    <FormRowColumn unit="6" className="flex justify-end">
                        <Button
                            onClick={() => {
                                setProjectPayments((old) => [...old, { ...defaultProjectPayment, returnFunc: handleReturnData }])
                            }}>
                            Adicionar
                        </Button>
                    </FormRowColumn>
                </FormRow>

                {projectPayments.map((element, index) => (
                    <ProjectPaymentFormTest
                        key={index}
                        index={index}
                        onDelete={handeOnDelete}
                        onSet={setProjectPayments}
                        projectPayments={projectPayments}
                    />
                ))}

                <FormRow>
                    <FormRowColumn unit="6" className="flex justify-end">
                        <Button
                            onClick={() => projectPayments.map((element, index) => {
                                console.log(element)
                            })}>
                            ver tudo
                        </Button>
                    </FormRowColumn>
                </FormRow>
            </Form>
        </Layout>
    )
}
