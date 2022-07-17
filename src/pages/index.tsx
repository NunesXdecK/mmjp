import Head from "next/head"
import { useEffect, useState } from "react"
import Form from "../components/form/form"
import List from "../components/list/list"
import Button from "../components/button/button"
import FormRow from "../components/form/formRow"
import Layout from "../components/layout/layout"
import FormRowColumn from "../components/form/formRowColumn"
import ProjectPaymentFormTest from "../components/form/projectPaymentFormNew"
import { defaultProjectPayment, ProjectPayment } from "../interfaces/objectInterfaces"

export default function Index() {
    const mockData = [
        { ...defaultProjectPayment, description: "teste 01" },
        { ...defaultProjectPayment, description: "teste 02" },
        { ...defaultProjectPayment, description: "teste 03" },
        { ...defaultProjectPayment, description: "teste 04" },
        { ...defaultProjectPayment, description: "teste 05" },
        { ...defaultProjectPayment, description: "teste 06" },
        { ...defaultProjectPayment, description: "teste 07" },
        { ...defaultProjectPayment, description: "teste 08" },
        { ...defaultProjectPayment, description: "teste 09" },
        { ...defaultProjectPayment, description: "teste 10" },
        { ...defaultProjectPayment, description: "teste 11" },
    ]
    const [projectPayments, setProjectPayments] = useState<ProjectPayment[]>(mockData)

    const handleFilterList = (string) => {
        let listItems = [...mockData]
        let listItemsFiltered: ProjectPayment[] = []
        listItemsFiltered = listItems.filter((element: ProjectPayment, index) => {
            return element.description.toLowerCase().includes(string.toLowerCase())
        })
        setProjectPayments((old) => listItemsFiltered)
    }

    const handleReturnData = (projectPayment: ProjectPayment) => {
        console.log(projectPayment)
    }

    const handeOnDelete = (index: number) => {
        let localProjectPayments = [...projectPayments]
        localProjectPayments.splice(index, 1)
        setProjectPayments((old) => localProjectPayments)
    }


    const test = async () => {
        return await fetch("api/persons").then(res => res.json())
    }

    useEffect(() => {
        test().then(res => console.log(res))
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
                    <FormRowColumn unit="6">
                        <List
                            haveNew
                            canDelete
                            canSeeInfo
                            autoSearch
                            isLoading={false}
                            list={projectPayments}
                            title="Teste de lista dinamica"
                            onNewClick={() => console.log("Novo")}
                            onEditClick={() => console.log("Editou")}
                            onDeleteClick={() => console.log("Deletou")}
                            onListItemClick={() => console.log("Clicou")}
                            onFilterList={handleFilterList}
                            onTitle={(element: ProjectPayment) => {
                                return (<p>{element.description}</p>)
                            }}
                            onInfo={(element: ProjectPayment) => {
                                return (<p>{element.description}</p>)
                            }}
                        />

                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="6" className="flex justify-end">
                        <Button
                            onClick={() => {
                                setProjectPayments((old) => [...old, { ...defaultProjectPayment }])
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
