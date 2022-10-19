import Head from "next/head"
import { useEffect, useState } from "react"
import Layout from "../../components/layout/layout"
import { handlePrepareServiceForShow } from "../../util/converterUtil"
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import { Company, defaultProfessional, defaultProject, defaultService, Person, Professional, Project, Service } from "../../interfaces/objectInterfaces"
import FeedbackPendency from "../../components/modal/feedbackPendencyModal"
import ListTable from "../../components/list/listTable"
import FormRow from "../../components/form/formRow"
import FormRowColumn from "../../components/form/formRowColumn"
import Button from "../../components/button/button"
import WindowModal from "../../components/modal/windowModal"
import ProjectForm from "../../components/form/projectForm"
import ProjectView from "../../components/view/projectView"

export default function Budget() {
    const [title, setTitle] = useState("Lista de orçamentos")
    const [professional, setProfessional] = useState<Professional>(defaultProfessional)
    const [project, setProject] = useState<Project>(defaultProject)
    const [projects, setProjects] = useState<Project[]>([])
    const [messages, setMessages] = useState<string[]>([])

    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isForShow, setIsForShow] = useState(false)
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
        setIsRegister(false)
        setTitle("Lista de orçamentos")
    }

    const handleDeleteClick = async (project, index) => {
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

        localProject = {
            ...localProject,
            dateString: handleUTCToDateShow(localProject.date.toString()),
        }
        setIsLoading(false)
        setIsRegister(true)
        setProject({ ...defaultProject, ...localProject })
        setTitle("Editar orçamento")
    }

    const handleShowClick = async (project) => {
        setIsLoading(true)
        setProject({ ...defaultProject, ...project })
        setIsForShow(true)
        setIsLoading(false)
    }
    const handleEditClick = async (project, index?) => {
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

    const handleAfterSave = (feedbackMessage: FeedbackMessage, budget: Project) => {
        handleBackClick()
        let list = [
            budget,
            ...projects,
        ]
        if (index > -1) {
            list = [
                ...projects.slice(0, index),
                budget,
                ...projects.slice(index + 1, projects.length),
            ]
            setIndex(-1)
        }
        setProjects(list)
        handleShowMessage(feedbackMessage)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    const handlePutHeaders = () => {
        return (
            <FormRow className="flex flex-row">
                <FormRowColumn unit="4">Nome</FormRowColumn>
                <FormRowColumn unit="1">Status</FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">Data</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: Project) => {
        return (
            <>
                <FormRowColumn unit="4">{element.title}</FormRowColumn>
                <FormRowColumn unit="1">
                    <span className="rounded text-slate-600 bg-slate-300 py-1 px-2 text-xs font-bold">
                        {element.status}
                    </span>
                </FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">{handleUTCToDateShow(element.date.toString())}</FormRowColumn>
            </>
        )
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
            /*
            fetch("api/checkPendencies").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.messages.length) {
                    setMessages(res.messages)
                }
            })
            */
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

            <div className="p-4 pb-0">
                <div className="rounded border shadow p-4 flex gap-2">
                    <Button
                        isLoading={isLoading}
                        onClick={handleNewClick}
                    >
                        Novo
                    </Button>
                    <Button
                        isLoading={isLoading}
                        onClick={() => {
                            setIsFirst(true)
                            setIsLoading(true)
                            handleBackClick()
                        }}
                    >
                        Atualizar
                    </Button>
                </div>
            </div>

            <ListTable
                list={projects}
                title="Orçamento"
                isLoading={isLoading}
                onSetIndex={setIndex}
                onTableRow={handlePutRows}
                onShowClick={handleShowClick}
                onEditClick={handleEditClick}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />

            {/*
            <FeedbackPendency messages={messages} />
*/}

            <WindowModal
                max
                isOpen={isRegister}
                setIsOpen={setIsRegister}>
                {isRegister && (
                    <>
                        <ProjectForm
                            isBack={false}
                            project={project}
                            professional={professional}
                            onAfterSave={handleAfterSave}
                            title="Informações do orçamento"
                            onShowMessage={handleShowMessage}
                            subtitle="Dados importantes sobre o orçamento"
                        />
                    </>
                )}
            </WindowModal>

            <WindowModal
                max
                isOpen={isForShow}
                setIsOpen={setIsForShow}>
                {isForShow && (
                    <>
                        <ProjectView elementId={project.id} />
                    </>
                )}
            </WindowModal>

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
