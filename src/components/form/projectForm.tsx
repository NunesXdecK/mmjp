import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import ServiceForm from "../listForm/serviceForm";
import ActionButtonsForm from "./actionButtonsForm";
import InputCheckbox from "../inputText/inputCheckbox";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import SelectProfessionalForm from "../select/selectProfessionalForm";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import SelectPersonCompanyForm from "../select/selectPersonCompanyForm";
import { handleProjectValidationForDB } from "../../util/validationUtil";
import { defaultProject, Project, Service } from "../../interfaces/objectInterfaces";
import { defaultElementFromBase, ElementFromBase, handlePrepareProjectForDB, handlePrepareServicePaymentStageForDB, } from "../../util/converterUtil";

interface ProjectFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canMultiple?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    project?: Project,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectForm(props: ProjectFormProps) {
    const [projectOriginal, setProjectOriginal] = useState<Project>(props?.project ?? defaultProject)
    const [project, setProject] = useState<Project>(props?.project ?? defaultProject)
    const [isFormValid, setIsFormValid] = useState(handleProjectValidationForDB(project).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.project?.oldData ?? defaultElementFromBase)

    const [services, setServices] = useState<Service[]>(props?.project?.services ? props.project.services : [])
    const [professionals, setProfessionals] = useState(props?.project?.professional?.id ? [props.project.professional] : [])

    const handleSetProjectTitle = (value) => { setProject({ ...project, title: value }) }
    const handleSetProjectNumber = (value) => { setProject({ ...project, number: value }) }
    const handleSetProjectDate = (value) => { setProject({ ...project, dateString: value }) }
    const handleSetProjectClients = async (value) => {
        const year = new Date().getFullYear()
        let number = ""
        number = number + year + "-"
        value.map((element, index) => {
            if ("clientCode" in element && element.clientCode !== "") {
                number = number + element.clientCode + "-"
            }
        })

        let numberOfProjectsInYear = await fetch("api/projectnumber/" + number).then((res) => res.json()).then((res) => res.data)
        number = number + numberOfProjectsInYear
        setProject({ ...project, clients: value, number: number })
    }

    const handleDiference = (): boolean => {
        let hasDiference = false
        Object.keys(projectOriginal)?.map((element, index) => {
            if (project[element] !== projectOriginal[element]) {
                hasDiference = true
            }
        })
        return hasDiference
    }

    const handleOnBack = () => {
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }


    const handleSave = async () => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }
        let projectForDB: Project = { ...project }
        if (professionals?.length > 0) {
            projectForDB = { ...projectForDB, professional: professionals[0] }
        } else {
            projectForDB = { ...projectForDB, professional: {} }
        }
        const isValid = handleProjectValidationForDB(projectForDB)
        if (isValid.validation) {
            projectForDB = handlePrepareProjectForDB(projectForDB)
            let nowID = projectForDB?.id ?? ""
            const isSave = nowID === ""
            let res = { status: "ERROR", id: nowID, message: "" }
            if (isSave) {
                feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
            } else {
                feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
            }
            try {
                res = await fetch("api/project", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", data: projectForDB }),
                }).then((res) => res.json())
            } catch (e) {
                if (isSave) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                } else {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em Atualizadar!"], messageType: "ERROR" }
                }
                console.error("Error adding document: ", e)
            }
            if (res.status === "SUCCESS") {
                setProject({ ...project, id: res.id })
                projectForDB = { ...projectForDB, id: res.id }

                {/*
                projectForDB = {
                    ...projectForDB,
                    projectStages: handlePrepareProjectPaymentStageForDB(projectForDB, project.projectStages),
                    projectPayments: handlePrepareProjectPaymentStageForDB(projectForDB, project.projectPayments),
                }
                try {
                    await Promise.all(
                        projectForDB.projectPayments.map(async (element, index) => {
                            await fetch("api/projectPayment", {
                                method: "POST",
                                body: JSON.stringify({ token: "tokenbemseguro", data: element }),
                            }).then((res) => res.json())
                        }))

                    await Promise.all(
                        projectForDB.projectStages.map(async (element, index) => {
                            await fetch("api/projectStage", {
                                method: "POST",
                                body: JSON.stringify({ token: "tokenbemseguro", data: element }),
                            }).then((res) => res.json())
                        }))
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar os pagaments!"], messageType: "ERROR" }
                    console.error("Error adding document: ", e)
                }
*/}

                if (isMultiple) {
                    setProject(defaultProject)
                }

                if (!isMultiple && props.onAfterSave) {
                    props.onAfterSave(feedbackMessage, projectForDB)
                }
            } else {
                feedbackMessage = { ...feedbackMessage, messages: ["Erro!"], messageType: "ERROR" }
            }

            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        } else {
            feedbackMessage = { ...feedbackMessage, messages: isValid.messages, messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
        setIsLoading(false)
    }

    return (
        <>
            <ActionButtonsForm
                isLeftOn
                isForBackControl
                isDisabled={!isFormValid}
                rightWindowText="Deseja confirmar as alterações?"
                isForOpenLeft={project.id !== "" && handleDiference()}
                isForOpenRight={project.id !== "" && handleDiference()}
                rightButtonText={project.id === "" ? "Salvar" : "Editar"}
                leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                onLeftClick={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                    handleOnBack()
                }}
                onRightClick={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                    handleSave()
                }}
            />

            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>

                <FormRow className="p-2 hidden">
                    <FormRowColumn unit="6">
                        <ActionButtonsForm
                            isLeftOn
                            isDisabled={!isFormValid}
                            rightWindowText="Deseja confirmar as alterações?"
                            isForOpenLeft={project.id !== "" && handleDiference()}
                            isForOpenRight={project.id !== "" && handleDiference()}
                            rightButtonText={project.id === "" ? "Salvar" : "Editar"}
                            leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                            onLeftClick={(event) => {
                                if (event) {
                                    event.preventDefault()
                                }
                                handleOnBack()
                            }}
                            onRightClick={(event) => {
                                if (event) {
                                    event.preventDefault()
                                }
                                handleSave()
                            }}
                        />
                    </FormRowColumn>
                </FormRow>

                <Form
                    title={props.title}
                    subtitle={props.subtitle}>

                    {props.canMultiple && (
                        <FormRow>
                            <FormRowColumn unit="6">
                                <InputCheckbox
                                    id="multiple"
                                    value={isMultiple}
                                    isLoading={isLoading}
                                    onSetText={setIsMultiple}
                                    title="Cadastro multiplo?"
                                    isDisabled={props.isForDisable}
                                />
                            </FormRowColumn>
                        </FormRow>
                    )}

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputTextAutoComplete
                                id="title"
                                isLoading={isLoading}
                                value={project.title}
                                title="Titulo do projeto"
                                validation={NOT_NULL_MARK}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectTitle}
                                onValidate={handleChangeFormValidation}
                                sugestions={["Ambiental", "Desmembramento", "Georeferenciamento", "União", "Licenciamento"]}
                                validationMessage="O titulo do projeto não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="1">
                            <InputText
                                id="number"
                                isLoading={isLoading}
                                value={project.number}
                                title="Numero"
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectNumber}
                                onValidate={handleChangeFormValidation}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="1">
                            <InputText
                                mask="date"
                                title="Data"
                                maxLength={10}
                                id="project-date"
                                isLoading={isLoading}
                                value={project.dateString}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectDate}
                                onValidate={handleChangeFormValidation}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="1">
                            <InputText
                                id="status"
                                title="Status"
                                isDisabled={true}
                                value={project.status}
                            />
                        </FormRowColumn>
                    </FormRow>
                </Form>
            </form>

            <SelectPersonCompanyForm
                title="Clientes"
                isLoading={isLoading}
                formClassName="p-1 m-3"
                subtitle="Selecione o cliente"
                buttonTitle="Adicionar cliente"
                onShowMessage={props.onShowMessage}
                personsAndCompanies={project.clients}
                validationButton={project.clients.length === 1}
                onSetPersonsAndCompanies={handleSetProjectClients}
                validationMessage="Esta pessoa, ou empresa já é um cliente"
                validationMessageButton="Você não pode mais adicionar clientes"
            />

            <SelectProfessionalForm
                title="Profissional"
                isLoading={isLoading}
                formClassName="p-1 m-3"
                professionals={professionals}
                subtitle="Selecione o profissional"
                onShowMessage={props.onShowMessage}
                buttonTitle="Adicionar profissional"
                onSetProfessionals={setProfessionals}
                validationButton={professionals.length === 1}
                validationMessage="Esta pessoa já é um profissional"
                validationMessageButton="Você não pode mais adicionar profissionais"
            />

            <ServiceForm
                title="Serviços"
                services={services}
                isLoading={isLoading}
                onSetServices={setServices}
                subtitle="Adicione os serviços"
            />

            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>
                <ActionButtonsForm
                    isLeftOn
                    isDisabled={!isFormValid}
                    rightWindowText="Deseja confirmar as alterações?"
                    isForOpenLeft={project.id !== "" && handleDiference()}
                    isForOpenRight={project.id !== "" && handleDiference()}
                    rightButtonText={project.id === "" ? "Salvar" : "Editar"}
                    leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                    onLeftClick={(event) => {
                        if (event) {
                            event.preventDefault()
                        }
                        handleOnBack()
                    }}
                    onRightClick={(event) => {
                        if (event) {
                            event.preventDefault()
                        }
                        handleSave()
                    }}
                />
            </form>
        </>
    )
}