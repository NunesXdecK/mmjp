import ActionBar from "./actionBar";
import Button from "../button/button";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleGetDateFormatedToUTC } from "../../util/dateUtils";
import { handleValidationNotNull, ValidationReturn } from "../../util/validationUtil";
import { Project, defaultProject, ProjectStatus } from "../../interfaces/objectInterfaces";
import DropDownButton from "../button/dropDownButton";
import MenuButton from "../button/menuButton";

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

export const handleProjectValidationForDB = (project: Project) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let nameCheck = handleValidationNotNull(project.title)
    let clientsCheck = true
    let clientsOnBaseCheck = true

    if (!nameCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo titulo está em branco."] }
    }

    clientsCheck = project?.clients?.length > 0 ?? false
    if (!clientsCheck) {
        validation = { ...validation, messages: [...validation.messages, "O projeto precisa de ao menos um cliente."] }
    }

    project.clients.map((element, index) => {
        if (!handleValidationNotNull(element.id)) {
            clientsOnBaseCheck = false
            validation = { ...validation, messages: [...validation.messages, "O cliente não está cadastrado na base."] }
        }
    })

    validation = { ...validation, validation: nameCheck && clientsCheck && clientsOnBaseCheck }
    return validation
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
        const saveRes = await fetch("api/project", {
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
                <DropDownButton
                    isLeft
                    title="..."
                    isLoading={props.isLoading}
                >
                    <div className="w-full flex flex-col">
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.project.status === "ARQUIVADO"}
                            isDisabled={props.project.status === "ARQUIVADO"}
                            onClick={() => {
                                handleSave("ARQUIVADO", true)
                            }}
                        >
                            Arquivar projeto
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.project.status === "FINALIZADO"}
                            isDisabled={props.project.status === "FINALIZADO"}
                            onClick={() => {
                                handleSave("FINALIZADO", true)
                            }}
                        >
                            Finalizar projeto
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.project.status === "PENDENTE"}
                            isDisabled={props.project.status === "PENDENTE"}
                            onClick={() => {
                                handleSave("PENDENTE", true)
                            }}
                        >
                            Colocar em pendencia
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.project.status === "EM ANDAMENTO"}
                            isDisabled={props.project.status === "EM ANDAMENTO"}
                            onClick={() => {
                                handleSave("EM ANDAMENTO", true)
                            }}
                        >
                            Colocar em andamento
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.project.status === "PARADO"}
                            isDisabled={props.project.status === "PARADO"}
                            onClick={() => {
                                handleSave("PARADO", true)
                            }}
                        >
                            Parar projeto
                        </MenuButton>
                    </div>
                </DropDownButton>
            </div>
        </ActionBar>
    )
}
