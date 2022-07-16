import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import { collection, getDocs } from "firebase/firestore"
import PersonForm from "../../components/form/personForm"
import { handleRemoveCPFMask } from "../../util/maskUtil"
import ImmobileList from "../../components/list/immobileList"
import ImmobileForm from "../../components/form/immobileForm"
import { PersonConversor, ImmobileConversor } from "../../db/converters"
import { extratePerson, handlePreparePersonForShow } from "../../util/converterUtil"
import { db, PERSON_COLLECTION_NAME, IMMOBILE_COLLECTION_NAME } from "../../db/firebaseDB"
import { defaultPerson, defaultImmobile, Person, Immobile } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function ImmobileOldBase() {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const immobileCollection = collection(db, IMMOBILE_COLLECTION_NAME).withConverter(ImmobileConversor)

    const [title, setTitle] = useState("Lista de imóveis da base antiga")
    const [person, setPerson] = useState<Person>(defaultPerson)
    const [immobile, setImmobile] = useState<Immobile>(defaultImmobile)

    const [isForRegisterImmobile, setIsForRegisterImmobile] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setPerson(defaultPerson)
        setImmobile(defaultImmobile)
        setIsForRegisterImmobile(false)
        setTitle("Lista de imóveis da base antiga")
    }

    const handleAfterSaveImmobile = (feedbackMessage: FeedbackMessage) => {
        handleShowMessage(feedbackMessage)
        handleBackClick()
    }

    const handleAfterSavePerson = (feedbackMessage: FeedbackMessage, person: Person) => {
        setImmobile({ ...immobile, owners: [handlePreparePersonForShow(person)] })
        setIsForRegisterImmobile(true)
        handleShowMessage(feedbackMessage)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    const handleListItemClick = async (immobile: Immobile) => {
        let localPerson = extratePerson(immobile.oldData)
        try {
            const querySnapshot = await getDocs(personCollection)
            querySnapshot.forEach((doc) => {
                const localCpf = handleRemoveCPFMask(localPerson.cpf)
                const baseCpf = handleRemoveCPFMask(doc.data().cpf)
                if (doc.id && localCpf === baseCpf) {
                    localPerson = doc.data()
                    localPerson = { ...localPerson, oldData: immobile.oldData }
                }
            })
        } catch (err) {
            console.error(err)
            let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu, tente novamente."], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
        }
        localPerson = handlePreparePersonForShow(localPerson)
        setImmobile(immobile)
        setPerson(localPerson)
        setTitle("Pessoa da base antiga")
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
                <ImmobileList
                    isOldBase={true}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <>
                    {isForRegisterImmobile === false ? (
                        <PersonForm
                            isBack={true}
                            person={person}
                            isForOldRegister={true}
                            onBack={handleBackClick}
                            title="Informações pessoais"
                            onAfterSave={handleAfterSavePerson}
                            onShowMessage={handleShowMessage}
                            subtitle="Dados importantes sobre a pessoa" />
                    ) : (
                        <ImmobileForm
                            isBack={true}
                            immobile={immobile}
                            isForOldRegister={true}
                            onBack={handleBackClick}
                            title="Informações básicas"
                            onShowMessage={handleShowMessage}
                            onAfterSave={handleAfterSaveImmobile}
                            subtitle="Dados importantes sobre o imóvel"
                        />
                    )}
                </>
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
