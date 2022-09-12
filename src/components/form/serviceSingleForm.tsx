import Form from "./form"
import FormRow from "./formRow"
import { useState } from "react"
import FormRowColumn from "./formRowColumn"
import ServiceForm from "../listForm/serviceForm"
import ActionButtonsForm from "./actionButtonsForm"
import ProjectFormForView from "./projectFormForView"
import InputCheckbox from "../inputText/inputCheckbox"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { handlePrepareImmobileForDB, handlePrepareServiceForDB } from "../../util/converterUtil"
import { handleIsEqual, handleServicesValidationForDB, handleServiceValidationForDB } from "../../util/validationUtil"
import { defaultService, Immobile, Professional, Project, Service, ServicePayment, ServiceStage } from "../../interfaces/objectInterfaces"
import Button from "../button/button"
import WindowModal from "../modal/windowModal"

interface ServiceSingleFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canAutoSave?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    service?: Service,
    professional?: Professional,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectService?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceSingleForm(props: ServiceSingleFormProps) {
    const [servicesID, setServicesID] = useState<any[]>([])
    const [services, setServices] = useState<Service[]>(props?.service ? [props?.service] : [defaultService])
    const [servicesOriginal, setServicesOriginal] = useState<Service[]>(props?.service ? [props?.service] : [defaultService])
    const [isFormValid, setIsFormValid] = useState(handleServicesValidationForDB(services, false, false).validation)
    const [isLoading, setIsLoading] = useState(false)
    const [isAutoSaving, setIsAutoSaving] = useState(false)

    const [windowText, setWindowText] = useState("")
    const [projectStatus, setProjectStatus] = useState<"ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO">("ORÇAMENTO")
    const [isOpen, setIsOpen] = useState(false)

    const handleOnBack = () => {
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleDiference = (): boolean => {
        return !handleIsEqual(services, servicesOriginal)
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(old => isValid)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
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
        const isValid = handleServicesValidationForDB(services, true, true)
        if (!isValid.validation) {
            return
        }
        setIsAutoSaving(old => true)
        const res = await handleSaveInner(services, services[0].project, false)
        if (res.status === "ERROR") {
            return
        }
        setIsAutoSaving(old => false)
        setServicesOriginal(old => res.services)
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

    const handleProjectServicesToDB = (services: Service[], status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO") => {
        let servicesFinal = []
        services?.map((element, index) => {
            let serviceStatus = element.status
            if (status && status.length) {
                serviceStatus = status
            }
            let localServiceStages: ServiceStage[] = []
            let localServicePayments: ServicePayment[] = []
            element.serviceStages?.map((elementStages, index) => {
                let serviceStagesStatus = elementStages.status
                if (serviceStagesStatus !== "FINALIZADO") {
                    if (serviceStatus === "PENDENTE"
                        || (serviceStatus === "FINALIZADO" && serviceStagesStatus !== "FINALIZADO")) {
                        serviceStagesStatus = "PENDENTE"
                    } else {
                        serviceStagesStatus = serviceStatus
                    }
                }
                localServiceStages = [...localServiceStages, { ...elementStages, status: serviceStagesStatus }]
            })
            element.servicePayments?.map((elementPayments, index) => {
                let servicePaymentsStatus = elementPayments.status
                if (servicePaymentsStatus !== "FINALIZADO") {
                    if (serviceStatus === "PENDENTE"
                        || (serviceStatus === "FINALIZADO" && servicePaymentsStatus !== "FINALIZADO")) {
                        servicePaymentsStatus = "PENDENTE"
                    } else {
                        servicePaymentsStatus = serviceStatus
                    }
                }
                localServicePayments = [...localServicePayments, { ...elementPayments, status: servicePaymentsStatus }]
            })
            servicesFinal = [...servicesFinal, {
                ...element,
                status: serviceStatus,
                serviceStages: localServiceStages,
                servicePayments: localServicePayments,
            }]
        })
        return { services: servicesFinal }
    }

    const handlePutServicesIDs = (servicesIDs, services: Service[]) => {
        let servicesRES = []
        let servicesIDsSPSorted = []
        let servicesSPSorted = []
        servicesIDs.map((element, index) => {
            servicesIDsSPSorted = [...servicesIDsSPSorted, {
                ...element,
                stages: element.stages?.sort(handleSortByIndex),
                payments: element.payments?.sort(handleSortByIndex),
            }]
        })
        services.map((element, index) => {
            servicesSPSorted = [...servicesSPSorted, {
                ...element,
                serviceStages: element.serviceStages?.sort(handleSortByIndex),
                servicePayments: element.servicePayments?.sort(handleSortByIndex),
            }]
        })
        let serviceIDsorted = servicesIDsSPSorted?.sort(handleSortByIndex)
        let servicesSorted = servicesSPSorted?.sort(handleSortByIndex)
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
                if (service?.stages && stageId.length === 0) {
                    let stage = service?.stages[serviceStage.index]
                    if (stage && "id" in stage && stage.id.length) {
                        stageId = stage.id
                    }
                }
                stagesWithIDs = [...stagesWithIDs, { ...serviceStage, id: stageId }]
            })
            element.servicePayments.map((servicePayment, index) => {
                let paymentId = servicePayment.id ?? ""
                if (service?.payments && paymentId.length === 0) {
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

    const handleSaveInner = async (services, project, history) => {
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
                        body: JSON.stringify({ token: "tokenbemseguro", data: serviceForDB, history: history, changeProject: true }),
                    }).then((res) => res.json())
                    servicesFinal = [...servicesFinal, saveRes.service]
                }))
            res = { ...res, status: "SUCCESS", services: servicesFinal }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSaveImmobilesInner = async (services, status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO") => {
        let res = { status: "ERROR", services: [] }
        let immobilesFinal = []
        services.map((element: Service, index) => {
            const isUnion = element.immobilesOrigin?.length > element.immobilesTarget?.length
            const isDismemberment = element.immobilesTarget?.length > element.immobilesOrigin?.length
            element.immobilesOrigin?.map((immobile: Immobile, index) => {
                let statusFinal = "NORMAL"
                if (status === "FINALIZADO") {
                    if (isUnion) {
                        statusFinal = "UNIFICADO"
                    }
                    if (isDismemberment) {
                        statusFinal = "DESMEMBRADO"
                    }
                }
                immobilesFinal = [...immobilesFinal, {
                    ...immobile,
                    status: statusFinal
                }]
            })
        })
        try {
            if (immobilesFinal.length > 0) {
                await Promise.all(
                    immobilesFinal.map(async (element: Immobile, index) => {
                        let immobileForDB = handlePrepareImmobileForDB(element)
                        const saveRes = await fetch("api/immobile", {
                            method: "POST",
                            body: JSON.stringify({
                                history: true,
                                data: immobileForDB,
                                token: "tokenbemseguro",
                            }),
                        }).then((res) => res.json())
                    }))
            }
            res = { ...res, status: "SUCCESS" }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async (status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO") => {
        if (isAutoSaving) {
            return
        }
        let projectServiceFinal = handleProjectServicesToDB(services, status)
        let servicesForValid: Service[] = projectServiceFinal.services
        const isServicesValid = handleServicesValidationForDB(servicesForValid, false, false)
        if (!isServicesValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: [...isServicesValid.messages], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        setIsLoading(true)
        let resServices = await handleSaveInner(servicesForValid, services[0].project, true)
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
        if (status) {
            await handleSaveImmobilesInner(servicesForValid, status)
        }
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (!status) {
            if (props.onAfterSave) {
                props.onAfterSave(feedbackMessage, servicesLastWithId)
            }
        }
        setIsLoading(false)
    }

    const handleCenterActionsButtons = () => {
        return (
            <div className="px-2 w-full flex flex-col sm:flex-row gap-2 items-end justify-end">
                {(services[0].status === "ARQUIVADO" || services[0].status === "FINALIZADO") && (
                    <Button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault()
                            if (services[0].id?.length) {
                                setWindowText("Deseja realmente reativar o projeto " + services[0].title + "?")
                                setProjectStatus("NORMAL")
                                setIsOpen(true)
                            } else {
                                handleSave("NORMAL")
                            }
                        }}
                        isLoading={isLoading}
                        isDisabled={!isFormValid}
                    >
                        Reativar
                    </Button>
                )}
                {false &&
                    (services[0].status === "ORÇAMENTO"
                        || services[0].status === "NORMAL") && (
                        <Button
                            type="button"
                            onClick={(event) => {
                                event.preventDefault()
                                if (services[0].id?.length) {
                                    setWindowText("Deseja realmente arquivar o projeto " + services[0].title + "?")
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
                    )}
                {services[0].status === "NORMAL" && (
                    <Button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault()
                            if (services[0].id?.length) {
                                setWindowText("Deseja realmente finalizar o projeto " + services[0].title + "?")
                                setProjectStatus("FINALIZADO")
                                setIsOpen(true)
                            } else {
                                handleSave("FINALIZADO")
                            }
                        }}
                        isLoading={isLoading}
                        isDisabled={!isFormValid}
                    >
                        Finalizar
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
                isRightOn={services[0].status !== "FINALIZADO" && services[0].status !== "ARQUIVADO"}
                rightWindowText="Deseja confirmar as alterações?"
                isForOpenLeft={services[0].id !== "" && handleDiference()}
                isForOpenRight={services[0].id !== "" && handleDiference()}
                rightButtonText={"Salvar"}
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

    return (
        <>
            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>

                {handleActionBar()}
            </form>

            <ServiceForm
                isSingle
                title="Serviços"
                services={services}
                isLoading={isLoading}
                onBlur={handleAutoSave}
                status={services[0].status}
                onSetServices={setServices}
                onFinishAdd={handleAutoSave}
                professional={props.professional}
                onShowMessage={props.onShowMessage}
                subtitle="Dados básicos dos serviços"
                isLocked={props.isForDisable ||
                    (services[0].status === "PENDENTE" ||
                        services[0].status === "FINALIZADO" ||
                        services[0].status === "ARQUIVADO")}
            />

            <ProjectFormForView
                title="Projeto"
                project={services[0].project}
                subtitle="informações do projeto"
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
    )
}