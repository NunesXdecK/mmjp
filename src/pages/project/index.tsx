import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import ProjectForm from "../../components/form/projectForm"
import ProjectList from "../../components/list/projectList"
import { defaultProject, Project } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Properties() {
    const [title, setTitle] = useState("Lista de projetos")
    const [project, setProject] = useState<Project>(defaultProject)
    const [isRegister, setIsRegister] = useState(false)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setIsRegister(false)
        setProject(defaultProject)
        setTitle("Lista de projetos")
    }
    
    const handleNewClick = () => {
        setIsRegister(true)
        setProject(defaultProject)
        setTitle("Novo projeto")
    }
    
    const handleListItemClick = (project) => {
        setIsRegister(true)
        setProject(project)
        setTitle("Editar projeto")
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
                <ProjectList
                    haveNew={true}
                    onNewClick={handleNewClick}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <ProjectForm
                    isBack={true}
                    project={project}
                    onBack={handleBackClick}
                    title="Informações do projeto"
                    onAfterSave={handleAfterSave}
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre o projeto" />
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
