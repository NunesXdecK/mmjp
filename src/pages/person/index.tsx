import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import PersonForm from "../../components/form/personForm"
import PersonView from "../../components/view/personView"
import { handlePreparePersonForShow } from "../../util/converterUtil"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Persons() {
    const [title, setTitle] = useState("Lista de pessoas")
    const [person, setPerson] = useState<Person>(defaultPerson)
    const [persons, setPersons] = useState<Person[]>([])
    const [personsForShow, setPersonsForShow] = useState<Person[]>([])

    const [isFirst, setIsFirst] = useState(true)
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
        setIsFirst(true)
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
        const index = persons.indexOf(person)
        const list = [
            ...persons.slice(0, index),
            ...persons.slice(index + 1, persons.length),
        ]
        setPersons(list)
        setPersonsForShow(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
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
        if (isFirst) {
            fetch("api/persons").then((res) => res.json()).then((res) => {
                if (res.list.length) {
                    setPersons(res.list)
                    setPersonsForShow(res.list)
                }
                setIsFirst(false)
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
                    onSetElement={setPerson}
                    deleteWindowTitle={"Deseja realmente deletar " + person.name + "?"}
                    onTitle={(element: Person) => {
                        return (
                            <PersonView
                                title=""
                                hideData
                                hideBorder
                                hidePaddingMargin
                                person={element}
                                classNameHolder="pb-0 pt-0 px-0 mt-0"
                                classNameContentHolder="py-0 px-0 mt-0"
                            />
                        )
                    }}
                    onInfo={(element: Person) => {
                        return (<PersonView id={element.id} person={element} />)
                    }}
                />
            ) : (
                <PersonForm
                    canMultiple
                    canAutoSave
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
