import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import ProjectList from "../../components/list/projectList"
import ProjectPaymentForm from "../../components/form/projectPaymentForm"
import { defaultProject, Project, ProjectPayment } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import { collection, doc, getDocs, query, where } from "firebase/firestore"
import { db, PROJECT_COLLECTION_NAME, PROJECT_PAYMENT_COLLECTION_NAME } from "../../db/firebaseDB"
import { ProjectConversor, ProjectPaymentConversor } from "../../db/converters"

export default function Properties() {
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const projectPaymentCollection = collection(db, PROJECT_PAYMENT_COLLECTION_NAME).withConverter(ProjectPaymentConversor)

    const [isLoading, setIsLoading] = useState(true)
    const [title, setTitle] = useState("Lista de projetos")
    const [project, setProject] = useState<Project>(defaultProject)
    const [projectPayments, setProjectPayments] = useState<ProjectPayment[]>([])
    const [isRegister, setIsRegister] = useState(false)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setIsRegister(false)
        setProjectPayments([])
        setTitle("Lista de projetos")
    }

    const handleListItemClick = async (project) => {
        setIsLoading(true)
        let projectPaymentsLocal = []
        const queryProjectPayment = query(projectPaymentCollection, where("project", "==", doc(projectCollection, project.id)));
        const querySnapshotProjectPayment = await getDocs(queryProjectPayment)
        querySnapshotProjectPayment.forEach((doc) => {
            projectPaymentsLocal = [...projectPaymentsLocal, doc.data()]
        })

        projectPaymentsLocal = projectPaymentsLocal.sort((elementOne: ProjectPayment, elementTwo: ProjectPayment) => {
            return elementOne.index - elementTwo.index
        })

        setProject(project)
        setProjectPayments(projectPaymentsLocal)
        setTitle("Editar pagamento")
        setIsLoading(false)
        setIsRegister(true)
        {/*
    */}
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
                    isLoading={isLoading}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <ProjectPaymentForm
                    isBack={true}
                    project={project}
                    onBack={handleBackClick}
                    title="Informações do etapa"
                    onAfterSave={handleAfterSave}
                    projectPayments={projectPayments}
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
