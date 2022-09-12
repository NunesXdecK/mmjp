import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import Button from "../../components/button/button"
import ProjectForm from "../../components/form/projectForm"
import ProjectView from "../../components/view/projectView"
import { ChevronDoubleUpIcon } from "@heroicons/react/outline"
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils"
import { ChevronDoubleDownIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid"
import { handlePrepareProjectForDB, handlePrepareServiceForShow } from "../../util/converterUtil"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import { Company, defaultProfessional, defaultProject, defaultService, Person, Professional, Project, Service } from "../../interfaces/objectInterfaces"
import { COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import FeedbackPendency from "../../components/modal/feedbackPendencyModal"

export default function Projects() {
    const [title, setTitle] = useState("Lista de projetos")
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
        setTitle("Novo projeto")
    }

    const sortByDate = (elementOne, elementTwo) => {
        let dateOne = 0
        let dateTwo = 0
        if (elementOne && elementTwo) {
            if ("dateLastUpdateUTC" in elementOne) {
                dateOne = elementOne.dateLastUpdateUTC
            } else if ("dateInsertUTC" in elementOne) {
                dateOne = elementOne.dateInsertUTC
            }
            if ("dateLastUpdateUTC" in elementTwo) {
                dateTwo = elementTwo.dateLastUpdateUTC
            } else if ("dateInsertUTC" in elementTwo) {
                dateTwo = elementTwo.dateInsertUTC
            }
        }
        return dateTwo - dateOne
    }

    const sortByPriority = (elementOne, elementTwo) => {
        let priorityOne = 0
        let priorityTwo = 0
        if (elementOne && elementTwo) {
            if ("priority" in elementOne) {
                priorityOne = elementOne.priority
            }
            if ("priority" in elementTwo) {
                priorityTwo = elementTwo.priority
            }
        }
        return priorityTwo - priorityOne
    }

    const handleFilterList = (string) => {
        let listItems = [...projects]
        let listItemsFiltered: Project[] = []
        let listItemsNormal: Project[] = []
        let listItemsNormalFinal: Project[] = []
        let listItemsArchive: Project[] = []
        let listItemsFinished: Project[] = []

        listItems.map((element, index) => {
            let status = element.status
            switch (status) {
                case "NORMAL":
                    listItemsNormal = [...listItemsNormal, element]
                    break
                case "ARQUIVADO":
                    listItemsArchive = [...listItemsArchive, element]
                    break
                case "FINALIZADO":
                    listItemsFinished = [...listItemsFinished, element]
                    break
            }
        })

        listItemsNormal = listItemsNormal.sort(sortByDate).sort(sortByPriority)
        listItemsNormal.map((element, index) => {
            listItemsNormalFinal = [...listItemsNormalFinal, { ...element, priorityView: index + 1 }]
        })

        listItemsFiltered = [
            ...listItemsNormalFinal,
            ...listItemsFinished.sort(sortByDate).sort(sortByPriority),
            ...listItemsArchive.sort(sortByDate).sort(sortByPriority),
        ]

        return listItemsFiltered.filter((element: Project, index) => {
            return element.title.toLowerCase().includes(string.toLowerCase())
        })
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
        setTitle("Editar projeto")
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
                    if (element && element.id?.length) {
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

    const handleSaveProject = async (project, history) => {
        let res = { status: "ERROR", id: "", project: project }
        let projectForDB = handlePrepareProjectForDB(project)
        try {
            const saveRes = await fetch("api/project", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: projectForDB, history: history }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, project: { ...project, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleCustomButtonsClick = async (element: Project, option: "top" | "up" | "down" | "bottom") => {
        setIsLoading(true)
        let listItems: Project[] = []
        projects.map((project: Project, index) => {
            let status = project.status
            if (status === "NORMAL") {
                listItems = [...listItems, project]
            }
        })
        let priority = -1
        let priorityUp = -1
        let priorityDown = -1
        listItems = listItems.sort(sortByPriority)
        listItems.map((project: Project, index) => {
            if (project.id === element.id) {
                if (listItems[index - 1]) {
                    priorityUp = listItems[index - 1].priority
                }
                if (listItems[index + 1]) {
                    priorityDown = listItems[index + 1].priority
                }
            }
        })
        switch (option) {
            case "top":
                priority = listItems[0].priority + 1
                break
            case "up":
                /*
                listItems.map((project, index) => {
                    if (priority === -1) {
                        if (element.priority === project.priority) {
                            priority = listItems[index - 1].priority
                        }
                    }
                })
                priority = priority + 1
                */
                priority = priorityUp + 1
                break
            case "down":
                /*
                listItems.map((project, index) => {
                    if (priority === -1) {
                        if (element.priority === project.priority) {
                            priority = listItems[index + 1].priority
                        }
                    }
                })
                if (priority > 0) {
                    priority = priority - 1
                }
                */
                priority = priorityDown - 1
                break
            case "bottom":
                priority = listItems[listItems.length - 1].priority - 1
                break
        }
        await handleSaveProject({ ...element, priority: priority }, true)
        setIsFirst(true)
    }

    const handlePutCustomButtons = (element: Project) => {
        let listItems: Project[] = []
        projects.map((project: Project, index) => {
            let status = project.status
            if (status === "NORMAL") {
                if (element.id === project.id) {
                    localIndex = index
                }
                listItems = [...listItems, project]
            }
        })
        let localIndex = -1
        listItems = listItems.sort(sortByPriority)
        listItems.map((project: Project, index) => {
            if (element.id === project.id) {
                localIndex = index
            }
        })
        let priorityMax = listItems[0]?.priority
        let priorityMin = listItems[listItems.length - 1]?.priority
        return (
            <>
                {element.status === "NORMAL" && (
                    <>
                        {localIndex > 0 && (
                            <>
                                <Button
                                    className="mr-2 mb-2 sm:mb-0"
                                    onClick={() => handleCustomButtonsClick(element, "top")}
                                >
                                    <ChevronDoubleUpIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                </Button>
                                <Button
                                    className="mr-2 mb-2 sm:mb-0"
                                    onClick={() => handleCustomButtonsClick(element, "up")}
                                >
                                    <ChevronUpIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                </Button>
                            </>
                        )}
                        {localIndex < (listItems.length - 1) && (
                            <>
                                <Button
                                    className="mr-2 mb-2 sm:mb-0"
                                    onClick={() => handleCustomButtonsClick(element, "down")}
                                >
                                    <ChevronDownIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                </Button>
                                <Button
                                    className="mr-2 mb-2 sm:mb-0"
                                    onClick={() => handleCustomButtonsClick(element, "bottom")}
                                >
                                    <ChevronDoubleDownIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                </Button>
                            </>
                        )}
                    </>
                )}
            </>
        )
    }

    const handlePutLastProfessional = async () => {
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/projects").then((res) => res.json()).then((res) => {
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
                    onCustomButtons={handlePutCustomButtons}
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
                    canMultiple
                    isBack={true}
                    project={project}
                    onBack={handleBackClick}
                    professional={professional}
                    onAfterSave={handleAfterSave}
                    title="Informações do projeto"
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre o projeto"
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
