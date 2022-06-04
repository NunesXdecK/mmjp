import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import PersonForm from "../../components/form/personForm"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Person() {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleAfterSave = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
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
            title="Nova pessoa">
            <Head>
                <title>Nova pessoa</title>
                <meta name="description" content="Nova pessoa" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PersonForm
                title="Informações pessoais"
                onAfterSave={handleAfterSave}
                onShowMessage={handleShowMessage}
                subtitle="Dados importantes sobre a pessoa" />

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen} />
        </Layout>
    )
}
