import Head from "next/head"
import { useState } from "react"
import Form from "../components/form/form"
import Button from "../components/button/button"
import FormRow from "../components/form/formRow"
import Layout from "../components/layout/layout"
import FormRowColumn from "../components/form/formRowColumn"
import ProjectPaymentFormTest from "../components/form/projectPaymentFormNew"
import { defaultProjectPayment, ProjectPayment } from "../interfaces/objectInterfaces"
import InputTextArea from "../components/inputText/inputTextArea"
import { JSON_MARK } from "../util/patternValidationUtil"
import { handleJSONcheck } from "../util/validationUtil"
import InputImmobilePoints from "../components/inputText/inputImmobilePoints"

export default function Index() {
    const mockData = [
        { ...defaultProjectPayment, description: "teste 01" },
        { ...defaultProjectPayment, description: "teste 02" },
    ]
    const [text, setText] = useState<string>("")
    const [projectPayments, setProjectPayments] = useState<ProjectPayment[]>([])

    const handleFilterList = (string) => {
        let listItems = [...mockData]
        let listItemsFiltered: ProjectPayment[] = []
        listItemsFiltered = listItems.filter((element: ProjectPayment, index) => {
            return element.description.toLowerCase().includes(string.toLowerCase())
        })
        setProjectPayments((old) => listItemsFiltered)
    }

    const handleAddTest = () => {
        if (text) {
            const element = JSON.parse(text)
            setProjectPayments((old) => element)
        }
    }

    const handleReturnData = () => {
        console.log(JSON.stringify(projectPayments))
    }

    const handleChangeText = (event) => {
        const text = event.target.value
        if (handleJSONcheck(text)) {
            const element = JSON.parse(text)
            let localProjectPayments = [element]
            setProjectPayments((old) => localProjectPayments)
        }
    }

    const handeOnDelete = (index: number) => {
        let localProjectPayments = [...projectPayments]
        localProjectPayments.splice(index, 1)
        setProjectPayments((old) => localProjectPayments)
    }


    return (
        <Layout
            title="Dashboard">
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="Dashboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <InputImmobilePoints
                canTest
                points={projectPayments}
                onSetPoints={setProjectPayments}
            />

            {/*
                    <Form>
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
                            onClick={handleReturnData}>
                            ver tudo
                        </Button>
                    </FormRowColumn>
                </FormRow>
            </Form>
*/}

        </Layout >
    )
}
