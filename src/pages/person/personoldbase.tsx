import Head from "next/head"
import { useState } from "react"
import PersonForm from "../../components/form/personForm"
import Layout from "../../components/layout/layout"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function PersonOldBase() {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    return (
        <Layout
            title="Pessoas vindas da antiga base">
            <Head>
                <title>Pessoa</title>
                <meta name="description" content="Pessoa" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PersonForm
                isForSelect={true}
                isForOldRegister={true}
                title="Informações pessoais"
                onAfterSave={handleShowMessage}
                onShowMessage={handleShowMessage}
                subtitle="Dados importantes sobre a pessoa" />

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
