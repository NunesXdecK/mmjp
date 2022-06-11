import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import { collection, getDocs } from "firebase/firestore"
import PersonForm from "../../components/form/personForm"
import { handleRemoveCPFMask } from "../../util/maskUtil"
import PropertyList from "../../components/list/propertyList"
import PropertyForm from "../../components/form/propertyForm"
import { PersonConversor, PropertyConversor } from "../../db/converters"
import { extratePerson, handlePreparePersonForShow } from "../../util/converterUtil"
import { db, PERSON_COLLECTION_NAME, PROPERTY_COLLECTION_NAME } from "../../db/firebaseDB"
import { defaultPerson, defaultProperty, Person, Property } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function PersonOldBase() {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const propertyCollection = collection(db, PROPERTY_COLLECTION_NAME).withConverter(PropertyConversor)

    const [title, setTitle] = useState("Lista de propriedades da base antiga")
    const [person, setPerson] = useState<Person>(defaultPerson)
    const [property, setProperty] = useState<Property>(defaultProperty)

    const [isForRegisterProperty, setIsForRegisterProperty] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setPerson(defaultPerson)
        setProperty(defaultProperty)
        setIsForRegisterProperty(false)
        setTitle("Lista de propriedades da base antiga")
    }

    const handleAfterSaveProperty = (feedbackMessage: FeedbackMessage) => {
        handleShowMessage(feedbackMessage)
        handleBackClick()
    }

    const handleAfterSavePerson = (feedbackMessage: FeedbackMessage, person: Person) => {
        setProperty({ ...property, owners: [handlePreparePersonForShow(person)] })
        setIsForRegisterProperty(true)
        handleShowMessage(feedbackMessage)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    const handleListItemClick = async (property: Property) => {
        let localPerson = extratePerson(property.oldData)
        try {
            const querySnapshot = await getDocs(personCollection)
            querySnapshot.forEach((doc) => {
                const localCpf = handleRemoveCPFMask(localPerson.cpf)
                const baseCpf = handleRemoveCPFMask(doc.data().cpf)
                if (doc.id && localCpf === baseCpf) {
                    localPerson = doc.data()
                    localPerson = { ...localPerson, oldData: property.oldData }
                }
            })
        } catch (err) {
            console.error(err)
            let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu, tente novamente."], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
        }
        localPerson = handlePreparePersonForShow(localPerson)
        setProperty(property)
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
                <PropertyList
                    isOldBase={true}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <>
                    {isForRegisterProperty === false ? (
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
                        <PropertyForm
                            isBack={true}
                            property={property}
                            isForOldRegister={true}
                            onBack={handleBackClick}
                            title="Informações básicas"
                            onShowMessage={handleShowMessage}
                            onAfterSave={handleAfterSaveProperty}
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
