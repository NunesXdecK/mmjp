import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import ProjectDataForm from "../form/projectDataForm"
import ProjectActionBarForm, { handleSaveProjectInner } from "../bar/projectActionBar"
import { handleUTCToDateShow } from "../../util/dateUtils"
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import ProjectStatusButton from "../button/projectStatusButton"
import { Project, Company, defaultProject, Person } from "../../interfaces/objectInterfaces"
import ProjectView from "../view/projectView"
import NavBar, { NavBarPath } from "../bar/navBar"

interface ProjectPageProps {
    id?: string,
    getInfo?: boolean,
    canSave?: boolean,
    canUpdate?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    prevPath?: NavBarPath[],
    onSetPage?: (any) => void,
    onSetCheck?: (any) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectPage(props: ProjectPageProps) {
    const [project, setProject] = useState<Project>(defaultProject)
    const [projects, setProjects] = useState<Project[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setProject(defaultProject)
        setIndex(-1)
        setIsForShow(false)
        setIsRegister(false)
    }

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleSetCheck = (value) => {
        if (props.onSetCheck) {
            props.onSetCheck(value)
        }
    }

    const handleDeleteClick = async (project, index) => {
        handleSetIsLoading(true)
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
            ...projects.slice(0, (index - 1)),
            ...projects.slice(index, projects.length),
        ]
        setProjects(list)
        handleSetIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleStatusClick = async (element, value) => {
        const project: Project = {
            ...element,
            status: value,
            dateString: handleUTCToDateShow(element.dateDue)
        }
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
        handleSetIsLoading(true)
        const res = await handleSaveProjectInner(project, true)
        handleSetIsLoading(false)
        if (res.status === "ERROR") {
            handleShowMessage(feedbackMessage)
            return
        }
        feedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleAfterSave(feedbackMessage, project, true)
    }

    const handleNewClick = async () => {
        setProject({
            ...defaultProject,
            dateString: ""
        })
        setIsRegister(true)
        setIndex(-1)
    }

    const handleCloseModal = (value) => {
        setIsRegister(value)
        setIsForShow(value)
    }

    const handleShowClick = (project) => {
        handleSetIsLoading(true)
        setProject({ ...defaultProject, ...project })
        setIsForShow(true)
        handleSetIsLoading(false)
    }

    const handleEditClick = async (project, index?) => {
        handleSetIsLoading(true)
        setIsForShow(false)
        let localProject: Project = await fetch("api/project/" + project?.id).then((res) => res.json()).then((res) => res.data)
        let localClients = []
        if (localProject?.clients?.length > 0) {
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
            dateString: handleUTCToDateShow(localProject?.dateDue?.toString()),
        }
        handleSetIsLoading(false)
        setIsRegister(true)
        setProject(localProject)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, project: Project, isForCloseModal) => {
        let localIndex = -1
        projects.map((element, index) => {
            if (element.id === project.id) {
                localIndex = index
            }
        })
        let list: Project[] = [
            project,
            ...projects,
        ]
        if (localIndex > -1) {
            list = [
                project,
                ...projects.slice(0, localIndex),
                ...projects.slice(localIndex + 1, projects.length),
            ]
        }
        setProjects((old) => list)
        handleShowMessage(feedbackMessage)
        if (!isForCloseModal) {
            handleBackClick()
            setIndex((old) => -1)
        } else {
            setIndex((old) => 1)
        }
        handleSetCheck(true)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handlePutModalTitle = (short: boolean) => {
        let paths = []
        let path: NavBarPath = { path: "Novo projeto", onClick: null }
        if (short) {
            //path = { ...path, path: "S" }
        }
        if (project.id?.length > 0) {
            path = { ...path, path: "Projeto-" + project.title, onClick: null }
        }
        try {
            if (props.prevPath?.length > 0) {
                let prevPath: NavBarPath = {
                    ...props.prevPath[props.prevPath?.length - 1],
                    onClick: handleBackClick,
                    path: props.prevPath[props.prevPath?.length - 1]?.path + "/",
                }
                paths = [...props.prevPath.slice(0, props.prevPath?.length - 1), prevPath,]
            }
            paths = [...paths, path]
        } catch (err) {
            console.error(err)
        }
        if (short) {
            return paths
        } else {
            return (
                <>
                    {paths?.length > 0 ? (<NavBar pathList={paths} />) : path.path}
                </>
            )
        }
    }

    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="3">Nome</FormRowColumn>
                <FormRowColumn unit="1">Número</FormRowColumn>
                <FormRowColumn unit="1">Status</FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">Prazo</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: Project) => {
        return (
            <FormRow>
                <FormRowColumn unit="3">{element.title}</FormRowColumn>
                <FormRowColumn unit="1">{element.number}</FormRowColumn>
                <FormRowColumn unit="1">
                    <ProjectStatusButton
                        id={element.id}
                        project={element}
                        value={element.status}
                        onAfter={handleAfterSave}
                        isDisabled={props.isDisabled}
                        onClick={async (value) => {
                            handleStatusClick(element, value)
                        }}
                    />
                </FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">{handleUTCToDateShow(element.dateDue?.toString())}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/projects").then((res) => res.json()).then((res) => {
                setProjects(res.list ?? [])
                setIsFirst(old => false)
                handleSetIsLoading(false)
            })
        }
    })

    return (
        <>
            <ActionBar
                isHidden={!props.canSave}
                className="flex flex-row justify-end"
            >
                <Button
                    isLoading={props.isLoading}
                    onClick={handleNewClick}
                    isHidden={!props.canSave}
                    isDisabled={props.isDisabled}
                >
                    <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                </Button>
            </ActionBar>
            <ListTable
                list={projects}
                isActive={index}
                title="Projetos"
                isLoading={props.isLoading}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                onShowClick={handleShowClick}
                onEditClick={handleEditClick}
                isDisabled={props.isDisabled}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />
            <WindowModal
                max
                id="project-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                title={(handlePutModalTitle(false))}
                headerBottom={(
                    <div className="p-4 pb-0">
                        {isRegister && (
                            <ProjectActionBarForm
                                project={project}
                                onSet={setProject}
                                isLoading={props.isLoading}
                                onAfterSave={handleAfterSave}
                                onShowMessage={handleShowMessage}
                                onSetIsLoading={props.onSetIsLoading}
                            />
                        )}
                        {isForShow && (
                            <ActionBar
                                className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"
                            >
                                <Button
                                    isLoading={props.isLoading}
                                    onClick={() => {
                                        handleEditClick(project)
                                    }}
                                >
                                    Editar
                                </Button>
                            </ActionBar>
                        )}
                    </div>
                )}
            >
                {isRegister && (
                    <ProjectDataForm
                        project={project}
                        onSet={setProject}
                        isLoading={props.isLoading}
                        onShowMessage={handleShowMessage}
                        onSetIsLoading={props.onSetIsLoading}
                        prevPath={(handlePutModalTitle(true))}
                        isDisabled={project.status === "FINALIZADO"}
                    />
                )}
                {isForShow && (
                    <ProjectView elementId={project.id} />
                )}
            </WindowModal>
        </>
    )
}
