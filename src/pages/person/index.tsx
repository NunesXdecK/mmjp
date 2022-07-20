import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import PersonForm from "../../components/form/personForm"
import { handlePreparePersonForShow } from "../../util/converterUtil"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Persons() {
    const [title, setTitle] = useState("Lista de pessoas")
    const [person, setPerson] = useState<Person>(defaultPerson)
    const [persons, setPersons] = useState<Person[]>([])
    const [personsForShow, setPersonsForShow] = useState<Person[]>([])

    const [isLoading, setIsLoading] = useState(true)
    const [isRegister, setIsRegister] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setPersons([])
        setPersonsForShow([])
        setPerson(defaultPerson)
        setIsLoading(true)
        setIsRegister(false)
        setTitle("Lista de pessoas")
    }

    const handleDeleteClick = async (person) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/person", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: person.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        handleShowMessage(feedbackMessage)
        setPersons([])
    }

    const handleNewClick = () => {
        setIsRegister(true)
        setPerson(defaultPerson)
        setTitle("Nova pessoa")
    }

    const handleFilterList = (string) => {
        let listItems = [...persons]
        let listItemsFiltered: Person[] = []
        listItemsFiltered = listItems.filter((element: Person, index) => {
            return element.name.toLowerCase().includes(string.toLowerCase())
        })
        setPersonsForShow((old) => listItemsFiltered)
    }

    const handleEditClick = (person) => {
        let localPerson = { ...person }
        localPerson = handlePreparePersonForShow(localPerson)
        setIsRegister(true)
        setPerson(localPerson)
        setTitle("Editar pessoa")
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
        if (persons.length === 0) {
            fetch("api/persons").then((res) => res.json()).then((res) => {
                setPersons(res.list)
                setPersonsForShow(res.list)
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
                    haveNew
                    canEdit
                    canDelete
                    canSeeInfo
                    autoSearch
                    title={title}
                    list={personsForShow}
                    isLoading={isLoading}
                    onNewClick={handleNewClick}
                    onEditClick={handleEditClick}
                    onFilterList={handleFilterList}
                    onDeleteClick={handleDeleteClick}
                    onTitle={(element: Person) => {
                        return (<p>{element.name}</p>)
                    }}
                    onInfo={(element: Person) => {
                        return (<p>{element.name}</p>)
                    }}
                />
            ) : (
                <PersonForm
                    canMultiple
                    isBack={true}
                    person={person}
                    onBack={handleBackClick}
                    title="Informações pessoais"
                    onAfterSave={handleAfterSave}
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre a pessoa" />
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
