import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import { PersonConversor } from "../../db/converters"
import { collection, getDocs } from "firebase/firestore"
import PersonList from "../../components/list/personList"
import PersonForm from "../../components/form/personForm"
import { db, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function PersonOldBase() {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)

    const [title, setTitle] = useState("Lista de pessoas da base antiga")
    const [person, setPerson] = useState<Person>(defaultPerson)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setPerson(defaultPerson)
        setTitle("Lista de pessoas da base antiga")
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

    const handleListItemClick = async (person: Person) => {
        setPerson(person)
        setTitle("Pessoa da base antiga")
        try {
            const querySnapshot = await getDocs(personCollection)
            querySnapshot.forEach((doc) => {
                const name = doc.data().name
                const cpf = doc.data().cpf
                if (doc.id && (person.cpf === cpf || person.name === name)) {
                    setPerson(doc.data())
                }
            })
        } catch (err) {
            console.error(err)
            let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu, tente novamente."], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
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

            {person.cpf === "" ? (
                <PersonList
                    isOldBase={true}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <PersonForm
                    isBack={true}
                    person={person}
                    isForOldRegister={true}
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
