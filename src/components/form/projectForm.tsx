import Form from "./form";
import FormRow from "./formRow";
import Button from "../button/button";
import { useEffect, useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import InputCheckbox from "../inputText/inputCheckbox";
import SelectImmobileForm from "../select/selectImmobileForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { handleProjectValidationForDB } from "../../util/validationUtil";
import { defaultProject, Professional, Project } from "../../interfaces/objectInterfaces";
import { defaultElementFromBase, ElementFromBase, handlePrepareProjectForDB, handlePrepareProjectPaymentForDB } from "../../util/converterUtil";
import SelectPersonCompanyForm from "../select/selectPersonCompanyForm";
import SelectProfessionalForm from "../select/selectProfessionalForm";
import WindowModal from "../modal/windowModal";
import ProjectPaymentForm from "./projectPaymentForm";

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
    const [isOpenExit, setIsOpenExit] = useState(false)
    const [isOpenSave, setIsOpenSave] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.project?.oldData ?? defaultElementFromBase)

    const [professionals, setProfessionals] = useState(props?.project?.professional?.id ? [props.project.professional] : [])

    const handleSetProjectTitle = (value) => { setProject({ ...project, title: value }) }
    const handleSetProjectBudget = (value) => { setProject({ ...project, budget: value }) }
    const handleSetProjectNumber = (value) => { setProject({ ...project, number: value }) }
    const handleSetProjectDate = (value) => { setProject({ ...project, dateString: value }) }
    const handleSetProjectStages = (value) => { setProject({ ...project, projectStages: value }) }
    const handleSetProjectPayments = (value) => { setProject({ ...project, projectPayments: value }) }
    const handleSetProjectImmobilesOrigin = (value) => { setProject({ ...project, immobilesOrigin: value }) }
    const handleSetProjectImmobilesTarget = (value) => { setProject({ ...project, immobilesTarget: value }) }
    const handleSetProjectClients = (value) => {
        let number = ""
        value.map((element, index) => {
            if ("clientCode" in element && element.clientCode !== "") {
                number = number + element.clientCode + "-"
            }
        })
        number = number + new Date().getFullYear() + "-"
        setProject({ ...project, clients: value, number: number })
    }

    useEffect(() => {
        if (props.onBack) {
            if (project.id !== "" && handleDiference()) {
                window.onbeforeunload = () => {
                    return false
                }
                document.addEventListener("keydown", (event) => {
                    if (event.keyCode === 116) {
                        event.preventDefault()
                        setIsOpenExit(true)
                    }
                })
            } else {
                window.onbeforeunload = () => { }
                document.addEventListener("keydown", (event) => { })
            }

            window.onpopstate = (event) => {
                event.preventDefault()
                event.stopPropagation()
                handleOnBack()
            }
        }
    })

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
        if (project.id !== "" && handleDiference()) {
            setIsOpenExit(true)
        } else {
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

                projectForDB = handlePrepareProjectPaymentForDB(projectForDB)

                try {
                    await Promise.all(
                        projectForDB.projectPayments.map(async (element, index) => {
                            await fetch("api/projectPayment", {
                                method: "POST",
                                body: JSON.stringify({ token: "tokenbemseguro", data: element }),
                            }).then((res) => res.json())
                        })
                    )
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar os pagaments!"], messageType: "ERROR" }
                    console.error("Error adding document: ", e)
                }

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
            {props.canMultiple && (
                <Form>
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
                </Form>
            )}

            <SelectPersonCompanyForm
                title="Clientes"
                isLoading={isLoading}
                isMultipleSelect={false}
                subtitle="Selecione o cliente"
                buttonTitle="Adicionar cliente"
                onShowMessage={props.onShowMessage}
                personsAndCompanies={project.clients}
                onSetPersonsAndCompanies={handleSetProjectClients}
                validationMessage="Esta pessoa, ou empresa já é um cliente"
            />

            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    if (project.id === "") {
                        handleSave()
                    } else {
                        setIsOpenSave(true)
                    }
                }}>
                <Form
                    title={props.title}
                    subtitle={props.subtitle}>

                    <FormRow>
                        <FormRowColumn unit="4">
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

                        <FormRowColumn unit="2" className="sm:place-self-center">
                            <InputCheckbox
                                id="budget"
                                title="É orçamento?"
                                isLoading={isLoading}
                                value={project.budget}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectBudget}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="4">
                            <InputText
                                id="number"
                                isLoading={isLoading}
                                value={project.number}
                                title="Numero do projeto"
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectNumber}
                                onValidate={handleChangeFormValidation}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                mask="date"
                                maxLength={10}
                                id="project-date"
                                isLoading={isLoading}
                                title="Data do projeto"
                                value={project.dateString}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectDate}
                                onValidate={handleChangeFormValidation}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <div className="hidden">
                        <Button
                            type="submit">
                        </Button>
                    </div>
                </Form>
            </form>

            <SelectImmobileForm
                isLoading={isLoading}
                title="Imóveis alvo"
                buttonTitle="Adicionar imóveis"
                subtitle="Selecione os imovéis"
                onShowMessage={props.onShowMessage}
                immobiles={project.immobilesTarget}
                onSetImmobiles={handleSetProjectImmobilesTarget}
                isMultipleSelect={project.immobilesOrigin?.length < 2}
                validationMessage="Este imóvel alvo já está selecionado"
            />

            {project.immobilesTarget?.length > 0 && (
                <SelectImmobileForm
                    isLoading={isLoading}
                    title="Imóveis de origem"
                    buttonTitle="Adicionar imóveis"
                    subtitle="Selecione os imovéis"
                    onShowMessage={props.onShowMessage}
                    immobiles={project.immobilesOrigin}
                    onSetImmobiles={handleSetProjectImmobilesOrigin}
                    isMultipleSelect={project.immobilesTarget?.length < 2}
                    validationMessage="Este imóvel de origem já está selecionado"
                />
            )}

            <SelectProfessionalForm
                isLoading={isLoading}
                title="Profissional"
                isMultipleSelect={false}
                professionals={professionals}
                subtitle="Selecione o profissional"
                onShowMessage={props.onShowMessage}
                buttonTitle="Adicionar profissional"
                onSetProfessionals={setProfessionals}
                validationMessage="Esta pessoa já é um profissional"
            />

            <ProjectPaymentForm
                title="Pagamento"
                isLoading={isLoading}
                subtitle="Adicione os pagamentos"
                projectPayments={project.projectPayments}
                onSetProjectPayments={handleSetProjectPayments}
            />

            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    if (project.id === "") {
                        handleSave()
                    } else {
                        setIsOpenSave(true)
                    }
                }}>
                <FormRow className="p-2">
                    <FormRowColumn unit="6" className="flex justify-between">
                        {props.isBack && (
                            <Button
                                onClick={(event) => {
                                    event.preventDefault()
                                    handleOnBack()
                                }}
                                isLoading={isLoading}
                                isDisabled={isLoading}
                            >
                                Voltar
                            </Button>
                        )}

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            isDisabled={!isFormValid}
                        >
                            Salvar
                        </Button>
                    </FormRowColumn>
                </FormRow>
            </form>

            <WindowModal
                isOpen={isOpenExit}
                setIsOpen={setIsOpenExit}>
                <p className="text-center">Deseja realmente sair?</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={() => setIsOpenExit(false)}
                    >
                        Voltar
                    </Button>
                    <Button
                        color="red"
                        onClick={() => {
                            if (props.onBack) {
                                props.onBack()
                            }
                        }}
                    >
                        Sair
                    </Button>
                </div>
            </WindowModal>

            <WindowModal
                isOpen={isOpenSave}
                setIsOpen={setIsOpenSave}>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    handleSave()
                    setIsOpenSave(false)
                }}>
                    <p className="text-center">Deseja realmente editar as informações?</p>
                    <div className="flex mt-10 justify-between content-between">
                        <Button
                            onClick={(event) => {
                                event.preventDefault()
                                setIsOpenSave(false)
                            }}
                        >
                            Voltar
                        </Button>
                        <Button
                            color="red"
                            type="submit"
                        >
                            Editar
                        </Button>
                    </div>
                </form>
            </WindowModal>
        </>
    )
}