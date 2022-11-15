import ActionBar from "./actionBar";
import Button from "../button/button";
import MenuButton from "../button/menuButton";
import DropDownButton from "../button/dropDownButton";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleGetDateFormatedToUTC } from "../../util/dateUtils";
import { handleValidationNotNull, ValidationReturn } from "../../util/validationUtil";
import { ServiceStage, defaultServiceStage, ServiceStageStatus } from "../../interfaces/objectInterfaces";

interface ServiceStageActionBarFormProps {
    serviceId?: string,
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    serviceStage?: ServiceStage,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any, boolean) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export const handleServiceStageValidationForDB = (serviceStage: ServiceStage, isForValidService?) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let titleCheck = handleValidationNotNull(serviceStage.title)
    let serviceCheck = true

    if (!titleCheck) {
        validation = { ...validation, messages: [...validation.messages, "A etapa " + (serviceStage.index + 1) + " está com o titulo em branco."] }
    }

    if (isForValidService) {
        serviceCheck = serviceStage?.service?.id?.length > 0 ?? false
        if (!serviceCheck) {
            validation = { ...validation, messages: [...validation.messages, "A etapa " + (serviceStage.index + 1) + " precisa de um serviço referente."] }
        }
    }
    validation = { ...validation, validation: titleCheck && serviceCheck }
    return validation
}

export const handleServiceStageForDB = (serviceStage: ServiceStage) => {
    if (serviceStage?.dateString?.length > 0) {
        serviceStage = { ...serviceStage, dateDue: handleGetDateFormatedToUTC(serviceStage.dateString) }
    } else {
        serviceStage = { ...serviceStage, dateDue: 0 }
    }
    if (serviceStage.service?.id?.length > 0) {
        serviceStage = { ...serviceStage, service: { id: serviceStage.service.id } }
    } else {
        serviceStage = { ...serviceStage, service: { id: "" } }
    }
    if (serviceStage.responsible?.id?.length > 0) {
        serviceStage = { ...serviceStage, responsible: { id: serviceStage.responsible.id } }
    } else {
        serviceStage = { ...serviceStage, responsible: { id: "" } }
    }
    serviceStage = {
        ...serviceStage,
        title: serviceStage.title?.trim(),
        description: serviceStage.description?.trim(),
    }
    return serviceStage
}

export const handleSaveServiceStageInner = async (serviceStage, history) => {
    let res = { status: "ERROR", id: "", serviceStage: serviceStage }
    serviceStage = handleServiceStageForDB(serviceStage)
    try {
        const saveRes = await fetch("api/serviceStageNew", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: serviceStage, history: history }),
        }).then((res) => res.json())
        res = { ...res, status: "SUCCESS", id: saveRes.id, serviceStage: { ...serviceStage, id: saveRes.id } }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export default function ServiceStageActionBarForm(props: ServiceStageActionBarFormProps) {
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


    const handleSave = async (status: ServiceStageStatus, isForCloseModal) => {
        const isServiceStageValid = handleServiceStageValidationForDB(props.serviceStage)
        if (!isServiceStageValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: [...isServiceStageValid.messages], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        handleSetIsLoading(true)
        let serviceStage: ServiceStage = props.serviceStage
        if (status?.length > 0) {
            serviceStage = { ...serviceStage, status: status }
        }
        serviceStage = handleServiceStageForDB(serviceStage)
        if (props.serviceId?.length > 0) {
            serviceStage = { ...serviceStage, service: { id: props.serviceId } }
        }
        let res = await handleSaveServiceStageInner(serviceStage, true)
        serviceStage = { ...serviceStage, id: res.id }
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
            props.onSet(defaultServiceStage)
        } else if (isForCloseModal) {
            props.onSet(serviceStage)
        }
        if (props.onAfterSave) {
            if (serviceStage.dateString?.length > 0) {
                serviceStage = { ...serviceStage, dateDue: handleGetDateFormatedToUTC(serviceStage.dateString) }
            }
            props.onAfterSave(feedbackMessage, serviceStage, isForCloseModal)
        }
    }

    return (
        <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
            <div className="w-full flex flex-row justify-between">
                <Button
                    isLoading={props.isLoading}
                    onClick={() => handleSave(props.serviceStage.status, false)}
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
                            isHidden={props.serviceStage.status !== "PARADO" && props.serviceStage.status !== "EM ANDAMENTO"}
                            isDisabled={props.serviceStage.status !== "PARADO" && props.serviceStage.status !== "EM ANDAMENTO"}
                            onClick={() => {
                                handleSave("FINALIZADO", true)
                            }}
                        >
                            Finalizar etapa
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.serviceStage.status !== "PARADO" && props.serviceStage.status !== "EM ANDAMENTO"}
                            isDisabled={props.serviceStage.status !== "PARADO" && props.serviceStage.status !== "EM ANDAMENTO"}
                            onClick={() => {
                                handleSave("PENDENTE", true)
                            }}
                        >
                            Colocar em pendencia
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.serviceStage.status === "PARADO"}
                            isDisabled={props.serviceStage.status === "PARADO"}
                            onClick={() => {
                                handleSave("EM ANDAMENTO", true)
                            }}
                        >
                            Colocar em andamento
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.serviceStage.status === "PARADO"}
                            isDisabled={props.serviceStage.status === "PARADO"}
                            onClick={() => {
                                handleSave("PARADO", true)
                            }}
                        >
                            Parar etapa
                        </MenuButton>
                    </div>
                </DropDownButton>
            </div>
        </ActionBar>
    )
}
