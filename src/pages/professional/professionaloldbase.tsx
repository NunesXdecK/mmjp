import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import { collection, getDocs } from "firebase/firestore"
import PersonForm from "../../components/form/personForm"
import { handleRemoveCPFMask } from "../../util/maskUtil"
import ProfessionalList from "../../components/list/professionalList"
import ProfessionalForm from "../../components/form/professionalForm"
import { PersonConversor, ProfessionalConversor } from "../../db/converters"
import { extratePerson, handlePreparePersonForShow } from "../../util/converterUtil"
import { db, PERSON_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME } from "../../db/firebaseDB"
import { defaultPerson, defaultProfessional, Person, Professional } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function ProfessionalOldBase() {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    const [title, setTitle] = useState("Lista de propriedades da base antiga")
    const [person, setPerson] = useState<Person>(defaultPerson)
    const [professional, setProfessional] = useState<Professional>(defaultProfessional)

    const [isForRegisterProfessional, setIsForRegisterProfessional] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setPerson(defaultPerson)
        setProfessional(defaultProfessional)
        setIsForRegisterProfessional(false)
        setTitle("Lista de propriedades da base antiga")
    }

    const handleAfterSaveProfessional = (feedbackMessage: FeedbackMessage) => {
        handleShowMessage(feedbackMessage)
        handleBackClick()
    }

    const handleAfterSavePerson = (feedbackMessage: FeedbackMessage, person: Person) => {
        setProfessional({ ...professional, person: handlePreparePersonForShow(person) })
        setIsForRegisterProfessional(true)
        handleShowMessage(feedbackMessage)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    const handleListItemClick = async (professional: Professional) => {
        let localPerson = professional.person
        try {
            const querySnapshot = await getDocs(personCollection)
            querySnapshot.forEach((doc) => {
                const localCpf = handleRemoveCPFMask(localPerson.cpf)
                const baseCpf = handleRemoveCPFMask(doc.data().cpf)
                if (doc.id && localCpf === baseCpf) {
                    localPerson = doc.data()
                    localPerson = { ...localPerson, oldData: professional.oldData }
                }
            })
        } catch (err) {
            console.error(err)
            let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu, tente novamente."], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
        }
        localPerson = handlePreparePersonForShow(localPerson)
        setProfessional(professional)
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
                <ProfessionalList
                    isOldBase={true}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <>
                    {isForRegisterProfessional === false ? (
                        <PersonForm
                            isBack={true}
                            person={person}
                            isForOldRegister={true}
                            onBack={handleBackClick}
                            title="Informações pessoais"
                            onShowMessage={handleShowMessage}
                            onAfterSave={handleAfterSavePerson}
                            subtitle="Dados importantes sobre a pessoa" />
                    ) : (
                        <ProfessionalForm
                            isBack={true}
                            isForOldRegister={true}
                            onBack={handleBackClick}
                            title="Informações básicas"
                            professional={professional}
                            onShowMessage={handleShowMessage}
                            onAfterSave={handleAfterSaveProfessional}
                            subtitle="Dados importantes sobre a propriedade"
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
