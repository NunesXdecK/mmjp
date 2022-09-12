import { useState } from "react"
import Button from "../button/button"
import WindowModal from "../modal/windowModal"
import ActionButtonsForm from "./actionButtonsForm"
import ServiceFormForView from "./serviceFormForView"
import ServiceStageForm from "../listForm/serviceStageForm"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { handlePrepareServiceStageForDB } from "../../util/converterUtil"
import { handleIsEqual, handleServiceStagesValidationForDB, } from "../../util/validationUtil"
import { defaultServiceStage, Professional, ServiceStage } from "../../interfaces/objectInterfaces"

interface ServiceStageSingleFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canAutoSave?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    serviceStage?: ServiceStage,
    professional?: Professional,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectServiceStage?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceStageSingleForm(props: ServiceStageSingleFormProps) {
    const [serviceStagesID, setServiceStagesID] = useState<any[]>([])
    const [serviceStages, setServiceStages] = useState<ServiceStage[]>(props?.serviceStage ? [props?.serviceStage] : [defaultServiceStage])
    const [serviceStagesOriginal, setServiceStagesOriginal] = useState<ServiceStage[]>(props?.serviceStage ? [props?.serviceStage] : [defaultServiceStage])
    const [isFormValid, setIsFormValid] = useState(handleServiceStagesValidationForDB(serviceStages, false).validation)
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
        return !handleIsEqual(serviceStages, serviceStagesOriginal)
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
        const isValid = handleServiceStagesValidationForDB(serviceStages, true)
        if (!isValid.validation) {
            return
        }
        setIsAutoSaving(old => true)
        const res = await handleSaveInner(serviceStages, serviceStages[0].service, false)
        if (res.status === "ERROR") {
            return
        }
        setIsAutoSaving(old => false)
        setServiceStagesOriginal(old => res.serviceStages)
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

    const handlePutServiceStagesIDs = (servicesIDs, services: ServiceStage[]) => {
        let servicesRES = []
        let serviceIDsorted = servicesIDs?.sort(handleSortByIndex)
        let servicesSorted = services?.sort(handleSortByIndex)
        servicesSorted.map((element, index) => {
            let id = element.id ?? ""
            let service = serviceIDsorted[element.index]
            if (id.length === 0) {
                if (service && "id" in service && service.id.length) {
                    id = service.id
                }
            }
            servicesRES = [...servicesRES,
            {
                ...element,
                id: id,
            }
            ]
        })
        return servicesRES
    }

    const handleProjectServiceStagesToDB = (services: ServiceStage[], status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO") => {
        let servicesFinal = []
        services?.map((element, index) => {
            let serviceStatus = element.status
            if (status && status.length) {
                serviceStatus = status
            }
            servicesFinal = [...servicesFinal, {
                ...element,
                status: serviceStatus,
            }]
        })
        return { services: servicesFinal }
    }

    const handleSaveInner = async (serviceStages, project, history) => {
        let res = { status: "ERROR", serviceStages: [] }
        let localServiceStagesForDB = []
        let serviceStagesFinal = []
        serviceStages.map((element: ServiceStage, index) => {
            localServiceStagesForDB = [...localServiceStagesForDB, {
                ...element,
                project: { ...project }
            }]
        })
        if (serviceStagesID.length) {
            localServiceStagesForDB = handlePutServiceStagesIDs(serviceStagesID, localServiceStagesForDB)
        }
        try {
            await Promise.all(
                localServiceStagesForDB.map(async (element: ServiceStage, index) => {
                    let serviceStageForDB = handlePrepareServiceStageForDB(element)
                    const saveRes = await fetch("api/serviceStage", {
                        method: "POST",
                        body: JSON.stringify({ token: "tokenbemseguro", data: serviceStageForDB, history: history, changeProject: true }),
                    }).then((res) => res.json())
                    serviceStagesFinal = [...serviceStagesFinal, saveRes.serviceStage]
                }))
            res = { ...res, status: "SUCCESS", serviceStages: serviceStagesFinal }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async (status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO") => {
        if (isAutoSaving) {
            return
        }
        let projectServiceStageFinal = handleProjectServiceStagesToDB(serviceStages, status)
        let serviceStagesForValid: ServiceStage[] = projectServiceStageFinal.services
        const isServiceStagesValid = handleServiceStagesValidationForDB(serviceStagesForValid, false)
        if (!isServiceStagesValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: [...isServiceStagesValid.messages], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        setIsLoading(true)
        let resServiceStages = await handleSaveInner(serviceStagesForValid, serviceStages[0].service, true)
        if (resServiceStages.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            setIsLoading(false)
            return
        }
        let serviceStagesLastWithId = handlePutServiceStagesIDs(resServiceStages.serviceStages, serviceStagesForValid)
        setServiceStagesID(resServiceStages.serviceStages)
        setServiceStages([...serviceStagesLastWithId])
        setServiceStagesOriginal([...serviceStagesLastWithId])
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (!status) {
            if (props.onAfterSave) {
                props.onAfterSave(feedbackMessage, serviceStagesLastWithId)
            }
        }
        setIsLoading(false)
    }

    const handleCenterActionsButtons = () => {
        return (
            <div className="px-2 w-full flex flex-col sm:flex-row gap-2 items-end justify-end">
                {(serviceStages[0].status === "ARQUIVADO" || serviceStages[0].status === "FINALIZADO") && (
                    <Button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault()
                            if (serviceStages[0].id?.length) {
                                setWindowText("Deseja realmente reativar o projeto " + serviceStages[0].title + "?")
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
                    (serviceStages[0].status === "ORÇAMENTO"
                        || serviceStages[0].status === "NORMAL") && (
                        <Button
                            type="button"
                            onClick={(event) => {
                                event.preventDefault()
                                if (serviceStages[0].id?.length) {
                                    setWindowText("Deseja realmente arquivar o projeto " + serviceStages[0].title + "?")
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
                {serviceStages[0].status === "NORMAL" && (
                    <Button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault()
                            if (serviceStages[0].id?.length) {
                                setWindowText("Deseja realmente finalizar o projeto " + serviceStages[0].title + "?")
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
                rightButtonText={"Salvar"}
                centerChild={handleCenterActionsButtons}
                rightWindowText="Deseja confirmar as alterações?"
                isForOpenLeft={serviceStages[0].id !== "" && handleDiference()}
                isForOpenRight={serviceStages[0].id !== "" && handleDiference()}
                leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                isRightOn={serviceStages[0].status !== "FINALIZADO" && serviceStages[0].status !== "ARQUIVADO"}
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

            <ServiceStageForm
                isSingle
                title="Serviços"
                isLoading={isLoading}
                onBlur={handleAutoSave}
                onFinishAdd={handleAutoSave}
                serviceStages={serviceStages}
                status={serviceStages[0].status}
                onShowMessage={props.onShowMessage}
                onSetServiceStages={setServiceStages}
                subtitle="Dados básicos dos serviços"
                isForDisable={props.isForDisable ||
                    (serviceStages[0].status === "PENDENTE" ||
                        serviceStages[0].status === "FINALIZADO" ||
                        serviceStages[0].status === "ARQUIVADO")}
            />

            <ServiceFormForView
                title="Serviço"
                subtitle="informações do serviço"
                service={serviceStages[0].service}
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