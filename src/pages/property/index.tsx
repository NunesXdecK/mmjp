import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import PropertyForm from "../../components/form/propertyForm"
import PropertyList from "../../components/list/propertyList"
import { defaultProperty, Property } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Properties() {
    const [title, setTitle] = useState("Lista de propriedades")
    const [property, setProperty] = useState<Property>(defaultProperty)
    const [isRegister, setIsRegister] = useState(false)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setIsRegister(false)
        setProperty(defaultProperty)
        setTitle("Lista de propriedades")
    }

    const handleNewClick = () => {
        setIsRegister(true)
        setProperty(defaultProperty)
        setTitle("Nova propriedade")
    }

    const handleListItemClick = (property) => {
        setIsRegister(true)
        setProperty(property)
        setTitle("Editar propriedade")
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
                <PropertyList
                    haveNew={true}
                    onNewClick={handleNewClick}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <PropertyForm
                    isBack={true}
                    property={property}
                    onBack={handleBackClick}
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
