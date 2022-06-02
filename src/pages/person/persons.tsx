import Head from "next/head"
import { useState } from "react"
import PersonForm from "../../components/form/personForm"
import Layout from "../../components/layout/layout"
import PersonList from "../../components/list/personList"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Persons() {
    const [title, setTitle] = useState("Lista de pessoas")
    const [person, setPerson] = useState<Person>(defaultPerson)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleListItemClick = (person) => {
        setPerson(person)
        setTitle("Editar pessoa")
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        setPerson(defaultPerson)
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    return (
        <Layout
            title={title}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={title} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {person.id === "" ? (
                <PersonList
                    isForSelect={true}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <PersonForm
                    person={person}
                    title="Informações pessoais"
                    onAfterSave={handleShowMessage}
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