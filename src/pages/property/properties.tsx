import Head from "next/head"
import { useState } from "react"
import PersonForm from "../../components/form/personForm"
import Layout from "../../components/layout/layout"
import PersonList from "../../components/list/personList"
import { defaultPerson, defaultProperty, Person, Property } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import PropertyForm from "../../components/form/propertyForm"
import PropertyList from "../../components/list/propertyList"

export default function Properties() {
    const [title, setTitle] = useState("Lista de propriedades")
    const [property, setProperty] = useState<Property>(defaultProperty)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleListItemClick = (property) => {
        setProperty(property)
        setTitle("Editar propriedade")
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage) => {
        setProperty(defaultPerson)
        setTitle("Lista de propriedades")
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
            
            {property.id === "" ? (
                <PropertyList
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <PropertyForm
                    property={property}
                    title="Informações da propriedade"
                    onAfterSave={handleAfterSave}
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre a propriedade" />
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
