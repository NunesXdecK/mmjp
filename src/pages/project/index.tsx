import Head from "next/head"
import { useEffect, useState } from "react"
import Layout from "../../components/layout/layout"
import ProjectForm from "../../components/form/projectForm"
import ProjectList from "../../components/list/projectList"
import { defaultProject, Project } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import List from "../../components/list/list"
import { handleUTCToDateShow } from "../../util/dateUtils"

export default function Properties() {
    const [title, setTitle] = useState("Lista de projetos")
    const [project, setProject] = useState<Project>(defaultProject)
    const [projects, setProjects] = useState<Project[]>([])
    const [projectsForShow, setProjectsForShow] = useState<Project[]>([])

    const [isLoading, setIsLoading] = useState(true)
    const [isRegister, setIsRegister] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setProjects([])
        setProjectsForShow([])
        setProject(defaultProject)
        setIsLoading(true)
        setIsRegister(false)
        setTitle("Lista de projetos")
    }

    const handleDeleteClick = async (project) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/project", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: project.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        handleShowMessage(feedbackMessage)
        setProjects([])
    }

    const handleNewClick = async () => {
        setIsLoading(true)
        let newProject = { ...defaultProject }
        const lastProfessional = await fetch("api/lastProfessional").then((res) => res.json()).then((res) => res.professional)
        if (lastProfessional.id && lastProfessional.id !== "") {
            newProject = { ...newProject, professional: lastProfessional }
        }
        setProject(newProject)
        setIsRegister(true)
        setIsLoading(false)
        setTitle("Novo projeto")
    }

    const handleFilterList = (string) => {
        let listItems = [...projects]
        let listItemsFiltered: Project[] = []
        listItemsFiltered = listItems.filter((element: Project, index) => {
            return element.title.toLowerCase().includes(string.toLowerCase())
        })
        setProjectsForShow((old) => listItemsFiltered)
    }

    const handleEditClick = async (project) => {
        setIsLoading(true)
        let localProject: Project = await fetch("api/project/" + project.id).then((res) => res.json()).then((res) => res.data)
        localProject = { ...localProject, dateString: handleUTCToDateShow(localProject.date.toString()) }
        setIsRegister(true)
        setProject({ ...defaultProject, ...localProject })
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

    const handlePutLastProfessional = async () => {
    }

    useEffect(() => {
        if (projects.length === 0) {
            fetch("api/projects").then((res) => res.json()).then((res) => {
                setProjects(res.list)
                setProjectsForShow(res.list)
                setIsLoading(false)
            })
        }
    })

    return (
        <Layout
            title={title}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={title} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {!isRegister ? (
                <List
                    haveNew
                    canEdit
                    canDelete
                    canSeeInfo
                    autoSearch
                    title={title}
                    isLoading={isLoading}
                    list={projectsForShow}
                    onNewClick={handleNewClick}
                    onEditClick={handleEditClick}
                    onFilterList={handleFilterList}
                    onDeleteClick={handleDeleteClick}
                    onTitle={(element: Project) => {
                        return (<p>{element.title}</p>)
                    }}
                    onInfo={(element: Project) => {
                        return (<p>{element.title}</p>)
                    }}
                />
            ) : (
                <ProjectForm
                    canMultiple
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
