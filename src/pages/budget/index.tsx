import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import ProjectForm from "../../components/form/projectForm"
import { handlePrepareServiceForShow } from "../../util/converterUtil"
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils"
import { COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import { Company, defaultProfessional, defaultProject, defaultService, Person, Professional, Project, Service } from "../../interfaces/objectInterfaces"
import ProjectView from "../../components/view/projectView"
import FeedbackPendency from "../../components/modal/feedbackPendencyModal"

export default function Budget() {
    const [title, setTitle] = useState("Lista de orçamentos")
    const [professional, setProfessional] = useState<Professional>(defaultProfessional)
    const [project, setProject] = useState<Project>(defaultProject)
    const [projects, setProjects] = useState<Project[]>([])
    const [messages, setMessages] = useState<string[]>([])

    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isRegister, setIsRegister] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setProjects([])
        setProject(defaultProject)
        setProfessional(defaultProfessional)
        setIsFirst(true)
        setIsLoading(true)
        setIsRegister(false)
        setTitle("Lista de orçamentos")
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
        const index = projects.indexOf(project)
        const list = [
            ...projects.slice(0, index),
            ...projects.slice(index + 1, projects.length),
        ]
        setProjects(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setIsLoading(true)
        let localProfessional: Professional = defaultProfessional
        try {
            localProfessional = await fetch("api/lastProfessional").then((res) => res.json()).then((res) => res.professional)
        } catch (err) {
            console.error(err)
        }
        let newProject = {
            ...defaultProject,
            dateString: handleUTCToDateShow(handleNewDateToUTC().toString()),
        }
        setProject(newProject)
        setProfessional(localProfessional)
        setIsRegister(true)
        setIsLoading(false)
        setTitle("Novo orçamento")
    }

    const handleFilterList = (string) => {
        let listItems = [...projects]
        let listItemsFiltered: Project[] = []
        listItemsFiltered = listItems.filter((element: Project, index) => {
            return element.title.toLowerCase().includes(string.toLowerCase())
        })
        return listItemsFiltered
    }

    const handleEditClickOld = async (project) => {
        setIsLoading(true)
        let localProject: Project = await fetch("api/project/" + project.id).then((res) => res.json()).then((res) => res.data)
        {/*
let localProjectPayments: ProjectPayment[] = await fetch("api/projectPayments/" + project.id).then((res) => res.json()).then((res) => res.list)
localProjectPayments = handlePrepareProjectPaymentStageForShow(localProjectPayments)

let localProjectStages: ProjectStage[] = await fetch("api/projectStages/" + project.id).then((res) => res.json()).then((res) => res.list)
localProjectStages = handlePrepareProjectPaymentStageForShow(localProjectStages)

localProject = {
    ...localProject,
    projectStages: localProjectStages,
    projectPayments: localProjectPayments,
    dateString: handleUTCToDateShow(localProject.date.toString()),
}
*/}

        localProject = {
            ...localProject,
            dateString: handleUTCToDateShow(localProject.date.toString()),
        }
        setIsLoading(false)
        setIsRegister(true)
        setProject({ ...defaultProject, ...localProject })
        setTitle("Editar orçamento")
    }

    const handleEditClick = async (project) => {
        setIsLoading(true)
        let localProject: Project = await fetch("api/projectview/" + project.id).then((res) => res.json()).then((res) => res.data)
        let localProfessional: Professional = defaultProfessional
        try {
            localProfessional = await fetch("api/lastProfessional").then((res) => res.json()).then((res) => res.professional)
        } catch (err) {
            console.error(err)
        }
        let localServices: Service[] = []
        try {
            let localServicesByProject = await fetch("api/services/" + localProject.id).then((res) => res.json()).then((res) => res.list)
            if (localServicesByProject && localServicesByProject?.length > 0) {
                await Promise.all(
                    localServicesByProject.map(async (element, index) => {
                        if (element && "id" in element && element?.id?.length) {
                            let service: Service = await fetch("api/service/" + element.id).then((res) => res.json()).then((res) => res.data)
                            if (service && "id" in service && service?.id?.length) {
                                localServices = [...localServices, { ...defaultService, ...handlePrepareServiceForShow(service) }]
                            }
                        }
                    })
                )
            }
            localServices = localServices.sort((elementOne: Service, elementTwo: Service) => {
                let indexOne = elementOne.index
                let indexTwo = elementTwo.index
                return indexTwo - indexOne
            })
        } catch (err) {
            console.error(err)
        }
        let localClients = []
        if (localProject.clients && localProject.clients?.length > 0) {
            await Promise.all(
                localProject.clients.map(async (element, index) => {
                    if (element && element?.id?.length) {
                        let localClient: (Person | Company) = {}
                        if ("cpf" in element) {
                            localClient = await fetch("api/person/" + element.id).then((res) => res.json()).then((res) => res.data)
                        } else if ("cnpj" in element) {
                            localClient = await fetch("api/company/" + element.id).then((res) => res.json()).then((res) => res.data)
                        }
                        if (localClient && "id" in localClient && localClient?.id?.length) {
                            localClients = [...localClients, localClient]
                        }
                    }
                    /*
                    let array = element.split("/")
                    if (array && array.length > 0) {
                        let localClient: (Person | Company) = {}
                        if (array[0].includes(PERSON_COLLECTION_NAME)) {
                            localClient = await fetch("api/person/" + array[1]).then((res) => res.json()).then((res) => res.data)
                        } else if (array[0].includes(COMPANY_COLLECTION_NAME)) {
                            localClient = await fetch("api/company/" + array[1]).then((res) => res.json()).then((res) => res.data)
                        }
                        if (localClient && "id" in localClient && localClient.id.length) {
                            localClients = [...localClients, localClient]
                        }
                    }
                    */
                })
            )
        }
        localProject = {
            ...localProject,
            clients: localClients,
            services: localServices,
            dateString: handleUTCToDateShow(localProject.date.toString()),
        }
        setIsLoading(false)
        setIsRegister(true)
        setProject({ ...defaultProject, ...localProject })
        setProfessional(localProfessional)
        setTitle("Editar orçamento")
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
        if (isFirst) {
            fetch("api/budgets").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setProjects(res.list)
                }
                setIsLoading(false)
            })

            fetch("api/checkPendencies").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.messages.length) {
                    setMessages(res.messages)
                }
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
                    onSetElement={setProject}
                    onNewClick={handleNewClick}
                    onEditClick={handleEditClick}
                    onFilterList={handleFilterList}
                    onDeleteClick={handleDeleteClick}
                    deleteWindowTitle={"Deseja realmente deletar " + project.title + "?"}
                    onTitle={(element: Project) => {
                        return (
                            <ProjectView
                                title=""
                                hideData
                                hideBorder
                                hidePaddingMargin
                                project={element}
                            />
                        )
                    }}
                    onInfo={(element: Project) => {
                        return (<ProjectView elementId={element.id} />)
                    }}
                />
            ) : (
                <ProjectForm
                    canAutoSave
                    canMultiple
                    isBack={true}
                    project={project}
                    onBack={handleBackClick}
                    professional={professional}
                    onAfterSave={handleAfterSave}
                    title="Informações do orçamento"
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre o orçamento"
                />
            )}

            <FeedbackPendency messages={messages} />

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
