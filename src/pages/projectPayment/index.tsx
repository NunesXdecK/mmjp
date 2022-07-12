import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import ProjectPaymentForm from "../../components/form/projectPaymentForm"
import ProjectPaymentList from "../../components/list/projectPaymentList"
import { defaultProjectPayment, ProjectPayment } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Properties() {
    const [title, setTitle] = useState("Lista de pagamentos")
    const [projectPayment, setProjectPayment] = useState<ProjectPayment>(defaultProjectPayment)
    const [isRegister, setIsRegister] = useState(false)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setIsRegister(false)
        setProjectPayment(defaultProjectPayment)
        setTitle("Lista de pagamentos")
    }
    
    const handleNewClick = () => {
        setIsRegister(true)
        setProjectPayment(defaultProjectPayment)
        setTitle("Novo pagamento")
    }
    
    const handleListItemClick = (projectPayment) => {
        setIsRegister(true)
        setProjectPayment(projectPayment)
        setTitle("Editar pagamento")
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
                <ProjectPaymentList
                    haveNew={true}
                    isPayedAllowed
                    onNewClick={handleNewClick}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <ProjectPaymentForm
                    isBack={true}
                    projectPayment={projectPayment}
                    onBack={handleBackClick}
                    title="Informações do etapa"
                    onAfterSave={handleAfterSave}
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre a etapa" />
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
