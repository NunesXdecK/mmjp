import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import ImmobileForm from "../../components/form/immobileForm"
import ImmobileList from "../../components/list/immobileList"
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Properties() {
    const [title, setTitle] = useState("Lista de imóveis")
    const [immobile, setImmobile] = useState<Immobile>(defaultImmobile)
    const [isRegister, setIsRegister] = useState(false)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setIsRegister(false)
        setImmobile(defaultImmobile)
        setTitle("Lista de imóveis")
    }

    const handleNewClick = () => {
        setIsRegister(true)
        setImmobile(defaultImmobile)
        setTitle("Novo imóvel")
    }

    const handleListItemClick = (immobile) => {
        setIsRegister(true)
        setImmobile(immobile)
        setTitle("Editar imóvel")
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
                <ImmobileList
                    haveNew={true}
                    onNewClick={handleNewClick}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <ImmobileForm
                    isBack={true}
                    immobile={immobile}
                    onBack={handleBackClick}
                    title="Informações do imóvel"
                    onAfterSave={handleAfterSave}
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre o imóvel" />
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
