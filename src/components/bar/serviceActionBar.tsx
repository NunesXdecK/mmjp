import ActionBar from "./actionBar";
import Button from "../button/button";
import MenuButton from "../button/menuButton";
import DropDownButton from "../button/dropDownButton";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleGetDateFormatedToUTC } from "../../util/dateUtils";
import { handleValidationNotNull, ValidationReturn } from "../../util/validationUtil";
import { handleMountNumberCurrency, handleRemoveCurrencyMask } from "../../util/maskUtil";
import { Service, defaultService, ServiceStatus } from "../../interfaces/objectInterfaces";

interface ServiceActionBarFormProps {
    projectId?: number,
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    service?: Service,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any, boolean) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export const handleServiceValidationForDB = (service: Service, isForValidateImmobile?, isForValidPaymentStage?) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let titleCheck = handleValidationNotNull(service.title)
    let immobilesTargetCheck = true
    let immobilesOriginOnBaseCheck = true
    let immobilesTargetOnBaseCheck = true

    if (!titleCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo titulo está em branco."] }
    }

    if (isForValidateImmobile) {
        immobilesTargetCheck = service?.immobilesTarget?.length > 0 ?? false
        if (!immobilesTargetCheck) {
            validation = { ...validation, messages: [...validation.messages, "O serviço precisa de ao menos um imóvel alvo."] }
        }

        service?.immobilesTarget?.map((element, index) => {
            if (!handleValidationNotNull(element.id)) {
                immobilesTargetOnBaseCheck = false
                validation = { ...validation, messages: [...validation.messages, "O imóvel alvo " + element.name + " não está cadastrado na base."] }
            }
        })

        service?.immobilesOrigin?.map((element, index) => {
            if (!handleValidationNotNull(element.id)) {
                immobilesOriginOnBaseCheck = false
                validation = { ...validation, messages: [...validation.messages, "O imóvel de origem " + element.name + " não está cadastrado na base."] }
            }
        })
    }

    validation = {
        ...validation,
        validation: titleCheck && immobilesTargetCheck && immobilesOriginOnBaseCheck && immobilesTargetOnBaseCheck,
        messages: [...validation.messages]
    }
    return validation
}

export const handleServiceForDB = (service: Service) => {
    if (service.title?.length > 0) {
        service = { ...service, title: service.title?.trim() }
    }
    if (service.value?.length > 0) {
        service = { ...service, value: handleRemoveCurrencyMask(service.value) }
    }
    if (service.total?.length > 0) {
        service = { ...service, total: handleRemoveCurrencyMask(service.total) }
    }
    if (service.description?.length > 0) {
        service = { ...service, description: service.description?.trim() }
    }
    if (service.professional?.id?.length > 0) {
        service = { ...service, professional: { id: service.professional.id } }
    } else {
        service = { ...service, professional: { id: "" } }
    }
    if (service.project?.id?.length > 0) {
        service = { ...service, project: { id: service.project.id } }
    } else {
        service = { ...service, project: { id: "" } }
    }
    let immobilesTargetDocRefsForDB = []
    let immobilesOriginDocRefsForDB = []
    if (service.immobilesTarget?.length > 0) {
        service.immobilesTarget?.map((element, index) => {
            if (element.id?.length) {
                immobilesTargetDocRefsForDB = [...immobilesTargetDocRefsForDB, { id: element.id }]
            }
        })
        service = { ...service, immobilesTarget: immobilesTargetDocRefsForDB }
    }
    if (service.immobilesOrigin?.length > 0) {
        service.immobilesOrigin?.map((element, index) => {
            if (element.id?.length) {
                immobilesOriginDocRefsForDB = [...immobilesOriginDocRefsForDB, { id: element.id }]
            }
        })
        service = { ...service, immobilesOrigin: immobilesOriginDocRefsForDB }
    }
    return service
}

export const handleSaveServiceInner = async (service, history) => {
    let res = { status: "ERROR", id: 0, service: service }
    service = handleServiceForDB(service)
    try {
        const saveRes = await fetch("api/service", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: service, history: history }),
        }).then((res) => res.json())
        res = { ...res, status: "SUCCESS", id: saveRes.id, service: { ...service, id: saveRes.id } }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export default function ServiceActionBarForm(props: ServiceActionBarFormProps) {
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

    const handleSave = async (status: ServiceStatus, isForCloseModal) => {
        const isServiceValid = handleServiceValidationForDB(props.service)
        if (!isServiceValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: [...isServiceValid.messages], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        handleSetIsLoading(true)
        let service: Service = props.service
        if (status?.length > 0) {
            service = { ...service, status: status }
        }
        let serviceOld = { ...service }
        if (props.projectId > 0) {
            service = { ...service, project: { id: props.projectId } }
        }
        let res = await handleSaveServiceInner(service, true)
        service = { ...service, id: res.id }
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
            props.onSet(defaultService)
        } else if (isForCloseModal) {
            props.onSet({
                ...service,
                immobilesTarget: serviceOld.immobilesTarget,
                immobilesOrigin: serviceOld.immobilesOrigin,
                value: handleMountNumberCurrency(service?.value?.toString(), ".", ",", 3, 2),
                total: handleMountNumberCurrency(service?.total?.toString(), ".", ",", 3, 2),
            })
        }
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, service, isForCloseModal)
        }
    }

    return (
        <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
            <div className="w-full flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(props.service.status, true)}
                    >
                        Salvar
                    </Button>
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(props.service.status, false)}
                    >
                        Salvar e sair
                    </Button>
                    <div className="hidden sm:flex sm:flex-row gap-2 flex-wrap">
                        <Button
                            isLoading={props.isLoading}
                            isHidden={props.service.status !== "PARADO" && props.service.status !== "EM ANDAMENTO"}
                            isDisabled={props.service.status !== "PARADO" && props.service.status !== "EM ANDAMENTO"}
                            onClick={() => {
                                handleSave("FINALIZADO", true)
                            }}
                        >
                            Finalizar serviço
                        </Button>
                        <Button
                            isLoading={props.isLoading}
                            isHidden={props.service.status !== "PARADO" && props.service.status !== "EM ANDAMENTO"}
                            isDisabled={props.service.status !== "PARADO" && props.service.status !== "EM ANDAMENTO"}
                            onClick={() => {
                                handleSave("PENDENTE", true)
                            }}
                        >
                            Colocar em pendencia
                        </Button>
                        <Button
                            isLoading={props.isLoading}
                            isHidden={props.service.status === "PARADO"}
                            isDisabled={props.service.status === "PARADO"}
                            onClick={() => {
                                handleSave("EM ANDAMENTO", true)
                            }}
                        >
                            Colocar em andamento
                        </Button>
                        <Button
                            isLoading={props.isLoading}
                            isHidden={props.service.status === "PARADO"}
                            isDisabled={props.service.status === "PARADO"}
                            onClick={() => {
                                handleSave("PARADO", true)
                            }}
                        >
                            Parar serviço
                        </Button>
                    </div>
                </div>
                <div className="block sm:hidden">
                    <DropDownButton
                        isLeft
                        title="..."
                        isLoading={props.isLoading}
                    >
                        <div className="w-full flex flex-col">
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.service.status !== "PARADO" && props.service.status !== "EM ANDAMENTO"}
                                isDisabled={props.service.status !== "PARADO" && props.service.status !== "EM ANDAMENTO"}
                                onClick={() => {
                                    handleSave("FINALIZADO", true)
                                }}
                            >
                                Finalizar serviço
                            </MenuButton>
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.service.status !== "PARADO" && props.service.status !== "EM ANDAMENTO"}
                                isDisabled={props.service.status !== "PARADO" && props.service.status !== "EM ANDAMENTO"}
                                onClick={() => {
                                    handleSave("PENDENTE", true)
                                }}
                            >
                                Colocar em pendencia
                            </MenuButton>
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.service.status === "PARADO"}
                                isDisabled={props.service.status === "PARADO"}
                                onClick={() => {
                                    handleSave("EM ANDAMENTO", true)
                                }}
                            >
                                Colocar em andamento
                            </MenuButton>
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.service.status === "PARADO"}
                                isDisabled={props.service.status === "PARADO"}
                                onClick={() => {
                                    handleSave("PARADO", true)
                                }}
                            >
                                Parar serviço
                            </MenuButton>
                        </div>
                    </DropDownButton>
                </div>
            </div>
        </ActionBar>
    )
}
