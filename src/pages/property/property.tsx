import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import PropertyForm from "../../components/form/propertyForm"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Property() {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleAfterSave = (feedbackMessage: FeedbackMessage) => {
        handleShowMessage(feedbackMessage)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    function handleListItemClick(property) {
    }

    return (
        <Layout
            title="Nova propriedade">
            <Head>
                <title>Nova propriedade</title>
                <meta name="description" content="Nova propriedade" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PropertyForm
                title="Informações básicas"
                onAfterSave={handleAfterSave}
                onShowMessage={handleShowMessage}
                subtitle="Dados importantes sobre a propriedade" />

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen} />
        </Layout>
    )
}
