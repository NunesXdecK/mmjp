import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import ProjectForm from "../../components/form/projectForm"
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils"
import { Company, defaultProfessional, defaultProject, defaultService, Person, Professional, Project, Service } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import { COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import { handlePrepareServiceForShow } from "../../util/converterUtil"

export default function Budget() {
    const [title, setTitle] = useState("Lista de orçamentos")
    const [project, setProject] = useState<Project>(defaultProject)
    const [projects, setProjects] = useState<Project[]>([])
    const [projectsForShow, setProjectsForShow] = useState<Project[]>([])

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
        setProjectsForShow([])
        setProject(defaultProject)
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
        handleShowMessage(feedbackMessage)
        handleBackClick()
    }

    const handleNewClick = async () => {
        setIsLoading(true)
        let newProject = { ...defaultProject, dateString: handleUTCToDateShow(handleNewDateToUTC().toString()) }
        const lastProfessional = await fetch("api/lastProfessional").then((res) => res.json()).then((res) => res.professional)
        if (lastProfessional && "id" in lastProfessional && lastProfessional.id.length) {
            newProject = { ...newProject, professional: lastProfessional }
        }
        setProject(newProject)
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
        setProjectsForShow((old) => listItemsFiltered)
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
        if (localProject.professional&& localProject.professional.length) {
            localProfessional = await fetch("api/professional/" + localProject.professional).then((res) => res.json()).then((res) => res.data)
        } else {
            localProfessional = await fetch("api/lastProfessional").then((res) => res.json()).then((res) => res.professional)
        }
        let localServices: Service[] = []
        try {
            let localServicesByProject = await fetch("api/services/" + localProject.id).then((res) => res.json()).then((res) => res.list)
            if (localServicesByProject && localServicesByProject?.length > 0) {
                await Promise.all(
                    localServicesByProject.map(async (element, index) => {
                        if ("id" in element && element.id.length) {
                            let service: Service = await fetch("api/service/" + element.id).then((res) => res.json()).then((res) => res.data)
                            if ("id" in service && service.id.length) {
                                localServices = [...localServices, { ...defaultService, ...handlePrepareServiceForShow(service) }]
                            }
                        }
                    })
                )
            }
            localServices = localServices.sort((elementOne: Service, elementTwo: Service) => {
                let indexOne = elementOne.index
                let indexTwo = elementTwo.index
                return indexOne - indexTwo
            })
        } catch (err) {
            console.error(err)
        }
        let localClients = []
        if (localProject.clients && localProject.clients?.length > 0) {
            await Promise.all(
                localProject.clients.map(async (element, index) => {
                    let array = element.split("/")
                    if (array && array.length > 0) {
                        let localClient: (Person | Company) = {}
                        if (array[0].includes(PERSON_COLLECTION_NAME)) {
                            localClient = await fetch("api/person/" + array[1]).then((res) => res.json()).then((res) => res.data)
                        } else if (array[0].includes(COMPANY_COLLECTION_NAME)) {
                            localClient = await fetch("api/company/" + array[1]).then((res) => res.json()).then((res) => res.data)
                        }
                        if ("id" in localClient && localClient.id.length) {
                            localClients = [...localClients, localClient]
                        }
                    }
                })
            )
        }
        localProject = {
            ...localProject,
            clients: localClients,
            services: localServices,
            professional: localProfessional,
            dateString: handleUTCToDateShow(localProject.date.toString()),
        }
        setIsLoading(false)
        setIsRegister(true)
        setProject({ ...defaultProject, ...localProject })
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
                if (res.list.length) {
                    setProjects(res.list)
                    setProjectsForShow(res.list)
                }
                setIsFirst(false)
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
                    onSetElement={setProject}
                    onNewClick={handleNewClick}
                    onEditClick={handleEditClick}
                    onFilterList={handleFilterList}
                    onDeleteClick={handleDeleteClick}
                    deleteWindowTitle={"Deseja realmente deletar " + project.title + "?"}
                    onTitle={(element: Project) => {
                        return (<>
                            <p>{element.title}</p>
                            <p>Data do orçamento: {handleUTCToDateShow(element.date.toString())}</p>
                        </>
                        )
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
                    onAfterSave={handleAfterSave}
                    title="Informações do orçamento"
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre o orçamento" />
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}