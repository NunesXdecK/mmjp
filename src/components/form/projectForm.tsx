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
import { handleProjectValidationForDB, handleServicesValidationForDB } from "../../util/validationUtil";
import { defaultProject, Project, Service, ServicePayment, ServiceStage } from "../../interfaces/objectInterfaces";
import { defaultElementFromBase, ElementFromBase, handlePrepareProjectForDB, handlePrepareServiceForDB } from "../../util/converterUtil";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import Button from "../button/button";
import WindowModal from "../modal/windowModal";
import BudgetPrintView from "../view/budgetPrintView";
import ContractPrintView from "../view/contractPrintView";

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

    const [windowText, setWindowText] = useState("")
    const [projectStatus, setProjectStatus] = useState<"ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO">("ORÇAMENTO")
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)

    const [isPrint, setIsPrint] = useState(false)
    const [isContract, setIsContract] = useState(false)

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

    const handleCenterActionsButtons = () => {
        return (
            <div className="px-2 w-full flex flex-col sm:flex-row gap-2 items-end justify-end">
                <Button
                    type="button"
                    onClick={(event) => {
                        event.preventDefault()
                        if (project.id.length) {
                            setWindowText("Deseja realmente arquivar o projeto " + project.title + "?")
                            setProjectStatus("ARQUIVADO")
                            setIsOpen(true)
                        } else {
                            handleSave("ARQUIVADO")
                        }
                    }}
                    isLoading={isLoading}
                    isDisabled={!isFormValid}
                >
                    Arquivar
                </Button>

                <div className="flex flex-col gap-1">
                    {project.status === "ORÇAMENTO" && (
                        <Button
                            type="button"
                            isLoading={isLoading}
                            isDisabled={!isFormValid}
                            onClick={(event) => {
                                if (event) {
                                    event.preventDefault()
                                }
                                setIsPrint(true)
                            }}
                        >
                            Imprimir orçamento
                        </Button>
                    )}
                    <Button
                        type="button"
                        isLoading={isLoading}
                        isDisabled={!isFormValid}
                        onClick={(event) => {
                            if (event) {
                                event.preventDefault()
                            }
                            setIsContract(true)
                        }}
                    >
                        Imprimir contrato
                    </Button>
                </div>
                {project.status === "ORÇAMENTO" && (
                    <Button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault()
                            if (project.id.length) {
                                setWindowText("Deseja realmente iniciar o projeto " + project.title + "?")
                                setProjectStatus("NORMAL")
                                setIsOpen(true)
                            } else {
                                handleSave("NORMAL")
                            }
                        }}
                        isLoading={isLoading}
                        isDisabled={!isFormValid}
                    >
                        Iniciar projeto
                    </Button>
                )}
                {project.status === "NORMAL" && (
                    <Button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault()
                            if (project.id.length) {
                                setWindowText("Deseja realmente finalizar o projeto " + project.title + "?")
                                setProjectStatus("FINALIZADO")
                                setIsOpen(true)
                            } else {
                                handleSave("FINALIZADO")
                            }
                        }}
                        isLoading={isLoading}
                        isDisabled={!isFormValid}
                    >
                        Finalizar projeto
                    </Button>
                )}
            </div>
        )
    }

    const handleSave = async (status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO") => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }
        let projectForDB: Project = { ...project }
        let localServicesForDB = []
        if (professionals?.length > 0) {
            projectForDB = { ...projectForDB, professional: professionals[0] }
        } else {
            projectForDB = { ...projectForDB, professional: {} }
        }
        if (status && status.length) {
            projectForDB = { ...projectForDB, status: status }
            let localServiceStages: ServiceStage[] = []
            let localServicePayments: ServicePayment[] = []
            services?.map((element, index) => {
                element.serviceStages?.map((elementStages, index) => {
                    localServiceStages = [...localServiceStages, { ...elementStages, status: status }]
                })
                element.servicePayments?.map((elementPayments, index) => {
                    localServicePayments = [...localServicePayments, { ...elementPayments, status: status }]
                })
                localServicesForDB = [...localServicesForDB, {
                    ...element,
                    status: status,
                    serviceStages: localServiceStages,
                    servicePayments: localServicePayments,
                }]
            })
        } else {
            localServicesForDB = [...services]
        }
        const isValid = handleProjectValidationForDB(projectForDB)
        const servicesValidation = handleServicesValidationForDB(localServicesForDB, false, false)
        if (isValid.validation && servicesValidation.validation) {
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
                nowID = res.id
            } catch (e) {
                if (isSave) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                } else {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em Atualizadar!"], messageType: "ERROR" }
                }
                console.error("Error adding document: ", e)
            }
            if (res.status === "SUCCESS") {
                let serviceValidation = true
                let localServices = []
                if (localServicesForDB.length && localServicesForDB.length > 0) {
                    localServicesForDB.map((element: Service, index) => {
                        localServices = [...localServices, {
                            ...element,
                            project: { ...defaultProject, id: nowID }
                        }]
                    })

                    let localServiceWithId = []
                    try {
                        await Promise.all(localServices.map(async (element: Service, index) => {
                            let serviceForDB = handlePrepareServiceForDB(element)
                            res = await fetch("api/service", {
                                method: "POST",
                                body: JSON.stringify({ token: "tokenbemseguro", data: serviceForDB }),
                            }).then((res) => res.json())
                            if (res.status === "ERROR") {
                                serviceValidation = false
                                feedbackMessage = { ...feedbackMessage, messageType: "ERROR", messages: ["Erro ao adicionar um serviço"] }
                            }
                            localServiceWithId = [...localServiceWithId, { ...element, id: res.id }]
                        }))
                    } catch (e) {
                        serviceValidation = false
                        feedbackMessage = { ...feedbackMessage, messageType: "ERROR", messages: ["Erro ao adicionar um serviço"] }
                        console.error("Error adding document: ", e)
                    }
                }

                if (serviceValidation) {
                    setProject({ ...project, id: res.id })
                    projectForDB = { ...projectForDB, id: res.id }

                    if (isMultiple) {
                        setServices([])
                        setProject({ ...defaultProject, dateString: handleUTCToDateShow(handleNewDateToUTC().toString()) })
                    }

                    if (!isMultiple && props.onAfterSave) {
                        props.onAfterSave(feedbackMessage, projectForDB)
                    }
                }
            } else {
                feedbackMessage = { ...feedbackMessage, messages: ["Erro ao adicionar o projeto!"], messageType: "ERROR" }
            }

            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        } else {
            feedbackMessage = { ...feedbackMessage, messages: [...isValid.messages, ...servicesValidation.messages], messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
        setIsLoading(false)
    }

    return (
        <>
            {isPrint && (
                <>
                    <ActionButtonsForm
                        isLeftOn
                        leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                        onLeftClick={(event) => {
                            if (event) {
                                event.preventDefault()
                            }
                            setIsPrint(false)
                            setIsContract(false)
                        }}
                    />
                    <BudgetPrintView
                        project={project}
                        services={services}
                        client={project.clients[0]}
                    />
                </>
            )}
            {isContract && (
                <>
                    <ActionButtonsForm
                        isLeftOn
                        leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                        onLeftClick={(event) => {
                            if (event) {
                                event.preventDefault()
                            }
                            setIsPrint(false)
                            setIsContract(false)
                        }}
                    />
                    <ContractPrintView
                        project={project}
                        services={services}
                        client={project.clients[0]}
                    />
                </>
            )}

            {!isPrint && !isContract && (
                <>
                    <ActionButtonsForm
                        isLeftOn
                        isForBackControl
                        isLoading={isLoading}
                        isDisabled={!isFormValid}
                        centerChild={handleCenterActionsButtons}
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

                                <FormRowColumn unit="2">
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
                            </FormRow>
                            <FormRow>
                                <FormRowColumn unit="2">
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
                        onShowMessage={props.onShowMessage}
                    />

                    <form
                        onSubmit={(event) => {
                            if (event) {
                                event.preventDefault()
                            }
                        }}>
                        <ActionButtonsForm
                            isLeftOn
                            isLoading={isLoading}
                            isDisabled={!isFormValid}
                            centerChild={handleCenterActionsButtons}
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

                    <WindowModal
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}>
                        <p className="text-center">{windowText}</p>
                        <div className="flex mt-10 justify-between content-between">
                            <Button
                                onClick={() => setIsOpen(false)}
                            >
                                Voltar
                            </Button>
                            <Button
                                color="red"
                                onClick={(event) => {
                                    handleSave(projectStatus)
                                    setIsOpen(false)
                                }}
                            >
                                Confirmar
                            </Button>
                        </div>
                    </WindowModal>
                </>)}
        </>
    )
}