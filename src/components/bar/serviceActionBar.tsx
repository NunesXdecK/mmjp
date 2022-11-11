import ActionBar from "./actionBar";
import Button from "../button/button";
import MenuButton from "../button/menuButton";
import DropDownButton from "../button/dropDownButton";
import { handleMountNumberCurrency, handleRemoveCurrencyMask } from "../../util/maskUtil";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleServiceValidationForDBNew } from "../../util/validationUtil";
import { Service, defaultService } from "../../interfaces/objectInterfaces";
import { handleGetDateFormatedToUTC, handleNewDateToUTC } from "../../util/dateUtils";

interface ServiceActionBarFormProps {
    projectId?: string,
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

export const handleServiceForDB = (service: Service) => {
    if (service?.dateString?.length > 0) {
        service = { ...service, dateDue: handleGetDateFormatedToUTC(service.dateString) }
    }
    if (service.dateDue === 0) {
        service = { ...service, dateDue: handleNewDateToUTC() }
    }
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

    const handleSaveServiceInner = async (service, history) => {
        let res = { status: "ERROR", id: "", service: service }
        try {
            const saveRes = await fetch("api/serviceNew", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: service, history: history }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, service: { ...service, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async (status: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO" | "PENDENTE", isForCloseModal) => {
        const isServiceValid = handleServiceValidationForDBNew(props.service)
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
        service = handleServiceForDB(service)
        if (props.projectId?.length > 0) {
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
            if (service.dateString?.length > 0) {
                service = { ...service, dateDue: handleGetDateFormatedToUTC(service.dateString) }
            }
            props.onAfterSave(feedbackMessage, service, isForCloseModal)
        }
    }

    return (
        <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
            <div className="w-full flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                    <Button
                        onClick={() => handleSave(props.service.status, true)}
                        isLoading={props.isLoading}
                    >
                        Salvar
                    </Button>
                    <Button
                        onClick={() => handleSave(props.service.status, false)}
                        isLoading={props.isLoading}
                    >
                        Salvar e sair
                    </Button>
                </div>
                <DropDownButton
                    isLeft
                    title="...">
                    <div className="w-full flex flex-col">
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.service.status !== "NORMAL"}
                            isDisabled={props.service.status !== "NORMAL"}
                            onClick={() => {
                                handleSave("FINALIZADO", true)
                            }}
                        >
                            Finalizar serviço
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.service.status !== "NORMAL"}
                            isDisabled={props.service.status !== "NORMAL"}
                            onClick={() => {
                                handleSave("ARQUIVADO", true)
                            }}
                        >
                            Arquivar serviço
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.service.status === "NORMAL"}
                            isDisabled={props.service.status === "NORMAL"}
                            onClick={() => {
                                handleSave("NORMAL", true)
                            }}
                        >
                            Reativar serviço
                        </MenuButton>
                    </div>
                </DropDownButton>
            </div>
        </ActionBar>
    )
}
