import Form from "../form/form";
import Button from "../button/button";
import FormRow from "../form/formRow";
import ServiceDataForm from "./serviceDataForm";
import FormRowColumn from "../form/formRowColumn";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import { defaultProfessional, defaultService, Professional, Service } from "../../interfaces/objectInterfaces";

interface ServiceFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO" | "PENDENTE",
    isBack?: boolean,
    isLocked?: boolean,
    isLoading?: boolean,
    isForShowAll?: boolean,
    isSingle?: boolean,
    professional?: Professional,
    services?: Service[],
    onBlur?: (any) => void,
    onFinishAdd?: (any?) => void,
    onSetServices?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceForm(props: ServiceFormProps) {
    const handleSetText = (object, index) => {
        if (props.onSetServices) {
            props.onSetServices([
                ...props.services.slice(0, index),
                object,
                ...props.services.slice(index + 1, props.services.length),
            ])
        }
    }

    const handeOnDelete = async (index: number) => {
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        let localServices = [...props.services]
        let localService = localServices[index]
        let canDelete = true

        if (localService.id && localService.id?.length) {
            const res = await fetch("api/service", {
                method: "DELETE",
                body: JSON.stringify({ token: "tokenbemseguro", id: localService.id }),
            }).then((res) => res.json())

            if (res.status !== "SUCCESS") {
                canDelete = false
                feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
            }
        }

        if (canDelete) {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
            localServices.splice(index, 1)
            if (props.onSetServices) {
                props.onSetServices(localServices)
            }
        }

        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    return (
        <Form
            title={props.title}
            subtitle={props.subtitle}
        >
            {(!props.isLocked && !props.isSingle) && (
                <FormRow className="mb-2">
                    <FormRowColumn unit="6" className="flex justify-end">
                        <Button
                            isLoading={props.isLoading}
                            isDisabled={props.isLoading}
                            onClick={async () => {
                                if (props.onSetServices) {
                                    let professional = defaultProfessional
                                    if (props.professional) {
                                        professional = props.professional
                                    }
                                    console.log(props.services)
                                    props.onSetServices([
                                        ...props.services,
                                        {
                                            ...defaultService,
                                            professional: professional,
                                            index: props.services?.length,
                                            status: props.status ?? "ORÇAMENTO",
                                            dateString: handleUTCToDateShow((handleNewDateToUTC() + 2592000000) + ""),
                                        }])
                                }
                            }}>
                            Adicionar serviço
                        </Button>
                    </FormRowColumn>
                </FormRow>
            )}

            {props?.services?.map((element, index) => (
                <ServiceDataForm
                    index={index}
                    service={element}
                    status={props.status}
                    onBlur={props.onBlur}
                    onSet={handleSetText}
                    onDelete={handeOnDelete}
                    isSingle={props.isSingle}
                    isLoading={props.isLoading}
                    isDisabled={props.isLocked}
                    onFinishAdd={props.onFinishAdd}
                    isForShowAll={props.isForShowAll}
                    onShowMessage={props.onShowMessage}
                    key={"services-" + index + props.id}
                />
            ))}
        </Form>
    )
}