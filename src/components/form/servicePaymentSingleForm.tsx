import { useState } from "react"
import Button from "../button/button"
import WindowModal from "../modal/windowModal"
import ActionButtonsForm from "./actionButtonsForm"
import ServiceFormForView from "./serviceFormForView"
import ServicePaymentForm from "../listForm/servicePaymentForm"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { handlePrepareServicePaymentForDB } from "../../util/converterUtil"
import { handleIsEqual, handleServicePaymentsValidationForDB, } from "../../util/validationUtil"
import { defaultServicePayment, Professional, ServicePayment } from "../../interfaces/objectInterfaces"

interface ServicePaymentSingleFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canAutoSave?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    servicePayment?: ServicePayment,
    professional?: Professional,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectServicePayment?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServicePaymentSingleForm(props: ServicePaymentSingleFormProps) {
    const [servicePaymentsID, setServicePaymentsID] = useState<any[]>([])
    const [servicePayments, setServicePayments] = useState<ServicePayment[]>(props?.servicePayment ? [props?.servicePayment] : [defaultServicePayment])
    const [servicePaymentsOriginal, setServicePaymentsOriginal] = useState<ServicePayment[]>(props?.servicePayment ? [props?.servicePayment] : [defaultServicePayment])
    const [isFormValid, setIsFormValid] = useState(handleServicePaymentsValidationForDB(servicePayments, false).validation)
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
        return !handleIsEqual(servicePayments, servicePaymentsOriginal)
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
        const isValid = handleServicePaymentsValidationForDB(servicePayments, true)
        if (!isValid.validation) {
            return
        }
        setIsAutoSaving(old => true)
        const res = await handleSaveInner(servicePayments, servicePayments[0].service, false)
        if (res.status === "ERROR") {
            return
        }
        setIsAutoSaving(old => false)
        setServicePaymentsOriginal(old => res.servicePayments)
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

    const handlePutServicePaymentsIDs = (servicesIDs, services: ServicePayment[]) => {
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

    const handleProjectServicePaymentsToDB = (services: ServicePayment[], status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO") => {
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

    const handleSaveInner = async (servicePayments, project, history) => {
        let res = { status: "ERROR", servicePayments: [] }
        let localServicePaymentsForDB = []
        let servicePaymentsFinal = []
        servicePayments.map((element: ServicePayment, index) => {
            localServicePaymentsForDB = [...localServicePaymentsForDB, {
                ...element,
                project: { ...project }
            }]
        })
        if (servicePaymentsID.length) {
            localServicePaymentsForDB = handlePutServicePaymentsIDs(servicePaymentsID, localServicePaymentsForDB)
        }
        try {
            await Promise.all(
                localServicePaymentsForDB.map(async (element: ServicePayment, index) => {
                    let servicePaymentForDB = handlePrepareServicePaymentForDB(element)
                    const saveRes = await fetch("api/servicePayment", {
                        method: "POST",
                        body: JSON.stringify({ token: "tokenbemseguro", data: servicePaymentForDB, history: history, changeProject: true }),
                    }).then((res) => res.json())
                    servicePaymentsFinal = [...servicePaymentsFinal, saveRes.servicePayment]
                }))
            res = { ...res, status: "SUCCESS", servicePayments: servicePaymentsFinal }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async (status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO") => {
        if (isAutoSaving) {
            return
        }
        let projectServicePaymentFinal = handleProjectServicePaymentsToDB(servicePayments, status)
        let servicePaymentsForValid: ServicePayment[] = projectServicePaymentFinal.services
        const isServicePaymentsValid = handleServicePaymentsValidationForDB(servicePaymentsForValid, false)
        if (!isServicePaymentsValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: [...isServicePaymentsValid.messages], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        setIsLoading(true)
        let resServicePayments = await handleSaveInner(servicePaymentsForValid, servicePayments[0].service, true)
        if (resServicePayments.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            setIsLoading(false)
            return
        }
        let servicePaymentsLastWithId = handlePutServicePaymentsIDs(resServicePayments.servicePayments, servicePaymentsForValid)
        setServicePaymentsID(resServicePayments.servicePayments)
        setServicePayments([...servicePaymentsLastWithId])
        setServicePaymentsOriginal([...servicePaymentsLastWithId])
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (!status) {
            if (props.onAfterSave) {
                props.onAfterSave(feedbackMessage, servicePaymentsLastWithId)
            }
        }
        setIsLoading(false)
    }

    const handleCenterActionsButtons = () => {
        return (
            <div className="px-2 w-full flex flex-col sm:flex-row gap-2 items-end justify-end">
                {(servicePayments[0].status === "ARQUIVADO" || servicePayments[0].status === "FINALIZADO") && (
                    <Button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault()
                            if (servicePayments[0].id?.length) {
                                setWindowText("Deseja realmente reativar o projeto " + servicePayments[0].description + "?")
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
                    (servicePayments[0].status === "ORÇAMENTO"
                        || servicePayments[0].status === "NORMAL") && (
                        <Button
                            type="button"
                            onClick={(event) => {
                                event.preventDefault()
                                if (servicePayments[0].id?.length) {
                                    setWindowText("Deseja realmente arquivar o projeto " + servicePayments[0].description + "?")
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
                {servicePayments[0].status === "NORMAL" && (
                    <Button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault()
                            if (servicePayments[0].id?.length) {
                                setWindowText("Deseja realmente finalizar o projeto " + servicePayments[0].description + "?")
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
                isForOpenLeft={servicePayments[0].id !== "" && handleDiference()}
                isForOpenRight={servicePayments[0].id !== "" && handleDiference()}
                leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                isRightOn={servicePayments[0].status !== "FINALIZADO" && servicePayments[0].status !== "ARQUIVADO"}
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

            <ServicePaymentForm
                isSingle
                title="Serviços"
                isLoading={isLoading}
                onBlur={handleAutoSave}
                onFinishAdd={handleAutoSave}
                servicePayments={servicePayments}
                status={servicePayments[0].status}
                onShowMessage={props.onShowMessage}
                onSetServicePayments={setServicePayments}
                subtitle="Dados básicos dos serviços"
                isForDisable={props.isForDisable ||
                    (servicePayments[0].status === "PENDENTE" ||
                        servicePayments[0].status === "FINALIZADO" ||
                        servicePayments[0].status === "ARQUIVADO")}
            />

            <ServiceFormForView
                title="Serviço"
                subtitle="informações do serviço"
                service={servicePayments[0].service}
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