import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import ImmobileForm from "../../components/form/immobileForm"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Immobile() {
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

    function handleListItemClick(immobile) {
    }

    return (
        <Layout
            title="Novo imóvel">
            <Head>
                <title>Novo imóvel</title>
                <meta name="description" content="Novo imóvel" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ImmobileForm
                title="Informações básicas"
                onAfterSave={handleAfterSave}
                onShowMessage={handleShowMessage}
                subtitle="Dados importantes sobre o imóvel" />

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen} />
        </Layout>
    )
}
