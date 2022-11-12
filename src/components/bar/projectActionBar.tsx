import ActionBar from "./actionBar";
import Button from "../button/button";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleProjectValidationForDB } from "../../util/validationUtil";
import { Project, defaultProject, ProjectStatus } from "../../interfaces/objectInterfaces";
import { handleGetDateFormatedToUTC, handleNewDateToUTC } from "../../util/dateUtils";

interface ProjectActionBarFormProps {
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    project?: Project,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any?, boolean?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export const handleProjectForDB = (project: Project) => {
    if (project?.dateString?.length > 0) {
        project = { ...project, dateDue: handleGetDateFormatedToUTC(project.dateString) }
    } else {
        project = { ...project, dateDue: 0 }
    }
    let clients = []
    if (project.clients && project.clients.length) {
        project.clients?.map((element, index) => {
            if (element && "id" in element && element.id.length) {
                if ("cpf" in element) {
                    clients = [...clients, { id: element.id, cpf: "" }]
                } else if ("cnpj" in element) {
                    clients = [...clients, { id: element.id, cnpj: "" }]
                }
            }
        })
    }
    project = {
        ...project,
        clients: clients,
        title: project.title.trim(),
    }
    return project
}

export const handleSaveProjectInner = async (project, history) => {
    let res = { status: "ERROR", id: "", project: project }
    project = handleProjectForDB(project)
    try {
        const saveRes = await fetch("api/projectNew", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: project, history: history }),
        }).then((res) => res.json())
        res = { ...res, status: "SUCCESS", id: saveRes.id, project: { ...project, id: saveRes.id } }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export default function ProjectActionBarForm(props: ProjectActionBarFormProps) {
    const handleSetIsLoading = (value: boolean) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }


    const handleSave = async (status: ProjectStatus, isForCloseModal) => {
        const isProjectValid = handleProjectValidationForDB(props.project)
        if (!isProjectValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: [...isProjectValid.messages], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        handleSetIsLoading(true)
        let project = props.project
        if (status?.length > 0) {
            project = { ...project, status: status }
        }
        project = handleProjectForDB(project)
        let res = await handleSaveProjectInner(project, true)
        project = { ...project, id: res.id }
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            handleSetIsLoading(false)
            return
        }
        handleSetIsLoading(false)
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (props.isMultiple && props.onSet) {
            props.onSet(defaultProject)
        } else if (isForCloseModal) {
            props.onSet(project)
        }
        if (props.onAfterSave) {
            if (project.dateString?.length > 0) {
                project = { ...project, dateDue: handleGetDateFormatedToUTC(project.dateString) }
            }
            props.onAfterSave(feedbackMessage, project, isForCloseModal)
        }
    }

    return (
        <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
            <div className="w-full flex flex-row justify-between">
                <Button
                    isLoading={props.isLoading}
                    onClick={() => handleSave(props.project.status, false)}
                >
                    Salvar
                </Button>
            </div>
        </ActionBar>
    )
}
