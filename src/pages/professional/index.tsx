import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import ProfessionalForm from "../../components/form/professionalForm"
import ProfessionalList from "../../components/list/professionalList"
import { defaultProfessional, Professional } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Professionals() {
    const [title, setTitle] = useState("Lista de profissionais")
    const [professional, setProfessional] = useState<Professional>(defaultProfessional)
    const [isRegister, setIsRegister] = useState(false)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setIsRegister(false)
        setProfessional(defaultProfessional)
        setTitle("Lista de profissionais")
    }

    const handleNewClick = () => {
        setIsRegister(true)
        setProfessional(defaultProfessional)
        setTitle("Novo profissional")
    }

    const handleListItemClick = (professional) => {
        setIsRegister(true)
        setProfessional(professional)
        setTitle("Editar profissional")
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
                <ProfessionalList
                    haveNew={true}
                    onNewClick={handleNewClick}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <ProfessionalForm
                    isBack={true}
                    professional={professional}
                    onBack={handleBackClick}
                    title="Informações do profissional"
                    onAfterSave={handleAfterSave}
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre o profissional" />
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
