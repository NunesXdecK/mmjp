import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import WindowModal from "../modal/windowModal";
import InputText from "../inputText/inputText";
import ServiceForm from "../listForm/serviceForm";
import ActionButtonsForm from "./actionButtonsForm";
import BudgetPrintView from "../view/budgetPrintView";
import InputCheckbox from "../inputText/inputCheckbox";
import ContractPrintView from "../view/contractPrintView";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import ScrollDownTransition from "../animation/scrollDownTransition";
import SelectProfessionalForm from "../select/selectProfessionalForm";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import SelectPersonCompanyForm from "../select/selectPersonCompanyForm";
import FeedbackMessageSaveText from "../modal/feedbackMessageSavingText";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import { defaultProject, Project, Service, ServicePayment, ServiceStage } from "../../interfaces/objectInterfaces";
import { handleIsEqual, handleProjectValidationForDB, handleServicesValidationForDB } from "../../util/validationUtil";
import { defaultElementFromBase, ElementFromBase, handlePrepareProjectForDB, handlePrepareServiceForDB } from "../../util/converterUtil";

interface ProjectFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canMultiple?: boolean,
    canAutoSave?: boolean,
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
    const [project, setProject] = useState<Project>(props?.project ?? defaultProject)
    const [projectOriginal, setProjectOriginal] = useState<Project>(props?.project ?? defaultProject)
    const [isFormValid, setIsFormValid] = useState(handleProjectValidationForDB(project).validation)

    const [windowText, setWindowText] = useState("")
    const [projectStatus, setProjectStatus] = useState<"ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO">("ORÇAMENTO")
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)
    const [isAutoSaving, setIsAutoSaving] = useState(false)

    const [isPrint, setIsPrint] = useState(false)
    const [isContract, setIsContract] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.project?.oldData ?? defaultElementFromBase)

    const [servicesID, setServicesID] = useState<any[]>([])
    const [services, setServices] = useState<Service[]>(props?.project?.services ? props.project.services : [])
    const [servicesOriginal, setServicesOriginal] = useState<Service[]>(props?.project?.services ? props.project.services : [])
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

    const handleOnBack = () => {
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleDiference = (): boolean => {
        return !handleIsEqual(project, projectOriginal) || !handleIsEqual(services, servicesOriginal)
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleSortByIndex = (elementOne, elementTwo) => {
        let indexOne = 0
        let indexTwo = 0
        if (elementOne && "index" in elementOne) {
            indexOne = elementOne.index
        }
        if (elementTwo && "index" in elementTwo) {
            indexTwo = elementTwo.index
        }
        return indexOne - indexTwo
    }

    const handleProjectServicesToDB = (project: Project, status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO") => {
        let projectFinal = { ...project }
        let servicesFinal = []
        let projectStatus = project.status
        if (professionals.length > 0) {
            projectFinal = { ...projectFinal, professional: professionals[0] }
        } else {
            projectFinal = { ...projectFinal, professional: {} }
        }
        if (status && status.length) {
            projectStatus = status
        }
        projectFinal = { ...projectFinal, status: projectStatus }
        services?.map((element, index) => {
            let localServiceStages: ServiceStage[] = []
            let localServicePayments: ServicePayment[] = []
            element.serviceStages?.map((elementStages, index) => {
                localServiceStages = [...localServiceStages, { ...elementStages, status: projectStatus }]
            })
            element.servicePayments?.map((elementPayments, index) => {
                localServicePayments = [...localServicePayments, { ...elementPayments, status: projectStatus }]
            })
            servicesFinal = [...servicesFinal, {
                ...element,
                status: projectStatus,
                serviceStages: localServiceStages,
                servicePayments: localServicePayments,
            }]
        })
        return { project: projectFinal, services: servicesFinal }
    }

    const handlePutServicesIDs = (servicesIDs, services: Service[]) => {
        let servicesRES = []
        let servicesIDsSPSorted = []
        let servicesSPSorted = []
        servicesIDs.map((element, index) => {
            servicesIDsSPSorted = [...servicesIDsSPSorted, {
                ...element,
                stages: element.stages.sort(handleSortByIndex),
                payments: element.payments.sort(handleSortByIndex),
            }]
        })
        services.map((element, index) => {
            servicesSPSorted = [...servicesSPSorted, {
                ...element,
                serviceStages: element.serviceStages.sort(handleSortByIndex),
                servicePayments: element.servicePayments.sort(handleSortByIndex),
            }]
        })
        let serviceIDsorted = servicesIDsSPSorted.sort(handleSortByIndex)
        let servicesSorted = servicesSPSorted.sort(handleSortByIndex)
        servicesSorted.map((element, index) => {
            let stagesWithIDs = []
            let paymentsWithIDs = []
            let id = element.id ?? ""
            let service = serviceIDsorted[element.index]
            if (id.length === 0) {
                if (service && "id" in service && service.id.length) {
                    id = service.id
                }
            }
            element.serviceStages.map((serviceStage, index) => {
                let stageId = serviceStage.id ?? ""
                if (stageId.length === 0) {
                    let stage = service?.stages[serviceStage.index]
                    if (stage && "id" in stage && stage.id.length) {
                        stageId = stage.id
                    }
                }
                stagesWithIDs = [...stagesWithIDs, { ...serviceStage, id: stageId }]
            })
            element.servicePayments.map((servicePayment, index) => {
                let paymentId = servicePayment.id ?? ""
                if (paymentId.length === 0) {
                    let payment = service?.payments[servicePayment.index]
                    if (payment && "id" in payment && payment.id.length) {
                        paymentId = payment.id
                    }
                }
                paymentsWithIDs = [...paymentsWithIDs, { ...servicePayment, id: paymentId }]
            })
            servicesRES = [...servicesRES,
            {
                ...element,
                id: id,
                serviceStages: stagesWithIDs,
                servicePayments: paymentsWithIDs,
            }
            ]
        })
        return servicesRES
    }

    const handleAutoSave = async (event?) => {
        if (!props.canAutoSave) {
            return
        }
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (isAutoSaving) {
            return
        }
        if (!handleDiference()) {
            return
        }
        let projectServiceFinal = handleProjectServicesToDB(project)
        let projectForValid: Project = projectServiceFinal.project
        const isProjectValid = handleProjectValidationForDB(projectForValid)
        if (!isProjectValid.validation) {
            return
        }
        setIsAutoSaving(old => true)
        let projectID = project.id
        if (!handleIsEqual(project, projectOriginal)) {
            const resProject = await handleSaveProjectInner(projectForValid, false)
            if (resProject.status === "ERROR") {
                setIsAutoSaving(old => false)
                return
            }
            projectID = resProject.id
            setProject({ ...project, id: resProject.id })
            setProjectOriginal(old => resProject.project)
        }
        let servicesForValid: Service[] = projectServiceFinal.services
        const isServicesValid = handleServicesValidationForDB(servicesForValid, false, false)
        if (!isServicesValid.validation) {
            setIsAutoSaving(old => false)
            return
        }
        if (projectID?.length > 0 && !handleIsEqual(services, servicesOriginal)) {
            const resServices = await handleSaveServicesInner(servicesForValid, { ...projectForValid, id: projectID }, false)
            if (resServices.status === "ERROR") {
                return
            }
            setServicesID(old => resServices.services)
            setServicesOriginal(old => servicesForValid)
        }
        setIsAutoSaving(old => false)
    }

    const handleSaveProjectInner = async (project, history) => {
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

    const handleSaveServicesInner = async (services, project, history) => {
        let res = { status: "ERROR", services: [] }
        let localServicesForDB = []
        let servicesFinal = []
        services.map((element: Service, index) => {
            localServicesForDB = [...localServicesForDB, {
                ...element,
                project: { ...project }
            }]
        })
        if (servicesID.length) {
            localServicesForDB = handlePutServicesIDs(servicesID, localServicesForDB)
        }
        try {
            await Promise.all(
                localServicesForDB.map(async (element: Service, index) => {
                    let serviceForDB = handlePrepareServiceForDB(element)
                    const saveRes = await fetch("api/service", {
                        method: "POST",
                        body: JSON.stringify({ token: "tokenbemseguro", data: serviceForDB, history: history }),
                    }).then((res) => res.json())
                    servicesFinal = [...servicesFinal, saveRes.service]
                }))
            res = { ...res, status: "SUCCESS", services: servicesFinal }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async (status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO") => {
        if (isAutoSaving) {
            return
        }
        let projectServiceFinal = handleProjectServicesToDB(project)
        let projectForValid: Project = projectServiceFinal.project
        let servicesForValid: Service[] = projectServiceFinal.services
        const isProjectValid = handleProjectValidationForDB(projectForValid)
        const isServicesValid = handleServicesValidationForDB(servicesForValid, false, false)
        if (!isProjectValid.validation || !isServicesValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: [...isProjectValid.messages, ...isServicesValid.messages], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        setIsLoading(true)
        let projectFromDB = { ...projectForValid }
        if (handleDiference()) {
            let resProject = await handleSaveProjectInner(projectForValid, true)
            if (resProject.status === "ERROR") {
                const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
                handleShowMessage(feedbackMessage)
                setIsLoading(false)
                return
            }
            setProject({ ...projectForValid, id: resProject.id })
            setProjectOriginal({ ...projectForValid, id: resProject.id })
            projectFromDB = { ...resProject.project }
            let resServices = await handleSaveServicesInner(services, { ...projectForValid, id: resProject.id }, true)
            if (resServices.status === "ERROR") {
                const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
                handleShowMessage(feedbackMessage)
                setIsLoading(false)
                return
            }
            let servicesLastWithId = handlePutServicesIDs(resServices.services, servicesForValid)
            setServicesID(resServices.services)
            setServices([...servicesLastWithId])
            setServicesOriginal([...servicesLastWithId])
        }
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (isMultiple) {
            setServices([])
            setProject({ ...defaultProject, dateString: handleUTCToDateShow(handleNewDateToUTC().toString()) })
        }
        if (!isMultiple && props.onAfterSave) {
            props.onAfterSave(feedbackMessage, projectFromDB)
        }
        setIsLoading(false)
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
                    Arquivar projeto
                </Button>
                {project.status === "ORÇAMENTO" && (
                    <>
                        <div className="flex flex-col gap-1">
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
                    </>
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

    const handleActionBar = () => {
        return (
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
        )
    }


    const handlePrintActionBar = () => {
        return (
            <ActionButtonsForm
                isLeftOn
                leftWindowText="Dejesa realmente voltar?"
                onLeftClick={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                    setIsPrint(false)
                    setIsContract(false)
                }}
            />
        )
    }
    return (
        <>
            {isPrint && (
                <>
                    {handlePrintActionBar()}
                    <BudgetPrintView
                        project={project}
                        services={services}
                        client={project.clients[0]}
                    />
                    {handlePrintActionBar()}
                </>
            )}
            {isContract && (
                <>
                    {handlePrintActionBar()}
                    <ContractPrintView
                        project={project}
                        services={services}
                        client={project.clients[0]}
                    />
                    {handlePrintActionBar()}
                </>
            )}
            {!isPrint && !isContract && (
                <>
                    {handleActionBar()}
                    <ScrollDownTransition
                        isOpen={isAutoSaving}>
                        <Form>
                            <FeedbackMessageSaveText
                                isOpen={true}
                            />
                        </Form>
                    </ScrollDownTransition>

                    <form
                        onSubmit={(event) => {
                            if (event) {
                                event.preventDefault()
                            }
                        }}>

                        <FormRow className="p-2 hidden">
                            <FormRowColumn unit="6">
                                {handleActionBar()}
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
                                        onBlur={handleAutoSave}
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
                                        title="Numero"
                                        isLoading={isLoading}
                                        value={project.number}
                                        onBlur={handleAutoSave}
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
                                        onBlur={handleAutoSave}
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
                        onBlur={handleAutoSave}
                        onSetServices={setServices}
                        onFinishAdd={handleAutoSave}
                        subtitle="Adicione os serviços"
                        onShowMessage={props.onShowMessage}
                    />

                    <form
                        onSubmit={(event) => {
                            if (event) {
                                event.preventDefault()
                            }
                        }}>
                        {handleActionBar()}
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
                </>
            )}
        </>
    )
}