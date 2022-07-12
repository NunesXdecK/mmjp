import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import ProjectStageForm from "../../components/form/projectStageForm"
import ProjectStageList from "../../components/list/projectStageList"
import { defaultProjectStage, ProjectStage } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Properties() {
    const [title, setTitle] = useState("Lista de etapas")
    const [projectStage, setProjectStage] = useState<ProjectStage>(defaultProjectStage)
    const [isRegister, setIsRegister] = useState(false)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setIsRegister(false)
        setProjectStage(defaultProjectStage)
        setTitle("Lista de etapas")
    }
    
    const handleNewClick = () => {
        setIsRegister(true)
        setProjectStage(defaultProjectStage)
        setTitle("Nova etapa")
    }
    
    const handleListItemClick = (projectStage) => {
        setIsRegister(true)
        setProjectStage(projectStage)
        setTitle("Editar etapa")
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
                <ProjectStageList
                    haveNew={true}
                    onNewClick={handleNewClick}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <ProjectStageForm
                    isBack={true}
                    projectStage={projectStage}
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
