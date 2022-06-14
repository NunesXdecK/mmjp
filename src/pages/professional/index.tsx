import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import ProfessionalForm from "../../components/form/professionalForm"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Professional() {
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

    function handleListItemClick(professional) {
    }

    return (
        <Layout
            title="Novo profissional">
            <Head>
                <title>Novo profissional</title>
                <meta name="description" content="Novo profissional" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ProfessionalForm
                title="Informações básicas"
                onAfterSave={handleAfterSave}
                onShowMessage={handleShowMessage}
                subtitle="Dados importantes sobre o profissional" />

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen} />
        </Layout>
    )
}
