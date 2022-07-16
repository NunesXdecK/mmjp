import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import PersonForm from "../../components/form/personForm"
import PersonList from "../../components/list/personList"
import { handlePreparePersonForShow } from "../../util/converterUtil"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Persons() {
    const [title, setTitle] = useState("Lista de pessoas")
    const [person, setPerson] = useState<Person>(defaultPerson)
    const [isRegister, setIsRegister] = useState(false)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setPerson(defaultPerson)
        setIsRegister(false)
        setTitle("Lista de pessoas")
    }

    const handleNewClick = () => {
        setIsRegister(true)
        setPerson(defaultPerson)
        setTitle("Nova pessoa")
    }

    const handleListItemClick = (person) => {
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

    return (
        <Layout
            title={title}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={title} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {!isRegister ? (
                <PersonList
                    canDelete
                    canSeeInfo
                    haveNew={true}
                    onNewClick={handleNewClick}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
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
