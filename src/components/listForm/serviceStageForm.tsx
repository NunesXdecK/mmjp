import Form from "../form/form";
import Button from "../button/button";
import FormRow from "../form/formRow";
import FormRowColumn from "../form/formRowColumn";
import ServiceStageDataForm from "./serviceStageDataForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import { defaultServiceStage, ServiceStage } from "../../interfaces/objectInterfaces";

interface ServiceStageFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    formClassName?: string,
    status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO" | "PENDENTE",
    isBack?: boolean,
    isSingle?: boolean,
    isLoading?: boolean,
    isForDisable?: boolean,
    serviceStages?: ServiceStage[],
    onBlur?: (any) => void,
    onFinishAdd?: (any?) => void,
    onSetServiceStages?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceStageForm(props: ServiceStageFormProps) {
    const handleSetText = (object, index) => {
        if (props.onSetServiceStages) {
            props.onSetServiceStages([
                ...props.serviceStages.slice(0, index),
                object,
                ...props.serviceStages.slice(index + 1, props.serviceStages.length),
            ])
        }
    }

    const handeOnDelete = async (index: number) => {
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        let localServiceStages = [...props.serviceStages]
        let localServiceStage = localServiceStages[index]
        let canDelete = true

        if (localServiceStage && "id" in localServiceStage && localServiceStage.id.length) {
            const res = await fetch("api/serviceStage", {
                method: "DELETE",
                body: JSON.stringify({ token: "tokenbemseguro", id: localServiceStage.id }),
            }).then((res) => res.json())

            if (res.status !== "SUCCESS") {
                canDelete = false
                feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
            }
        }

        if (canDelete) {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
            localServiceStages.splice(index, 1)
            if (props.onSetServiceStages) {
                props.onSetServiceStages(localServiceStages)
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
            className={props.formClassName}
        >
            {!props.isForDisable && (
                <FormRow>
                    <FormRowColumn unit="6" className="flex justify-end">
                        <Button
                            isLoading={props.isLoading}
                            isDisabled={props.isLoading}
                            onClick={() => {
                                if (props.onSetServiceStages) {
                                    props.onSetServiceStages([...props.serviceStages ?? [],
                                    {
                                        ...defaultServiceStage,
                                        index: props.serviceStages?.length,
                                        status: props.status ?? "ORÇAMENTO",
                                        dateString: handleUTCToDateShow((handleNewDateToUTC() + 2592000000) + ""),
                                    }])
                                }
                            }}>
                            Adicionar etapa
                        </Button>
                    </FormRowColumn>
                </FormRow>
            )}

            {props?.serviceStages?.map((element, index) => (
                <ServiceStageDataForm
                    key={index}
                    index={index}
                    onBlur={props.onBlur}
                    onDelete={handeOnDelete}
                    isSingle={props.isSingle}
                    onSetText={handleSetText}
                    isLoading={props.isLoading}
                    onFinishAdd={props.onFinishAdd}
                    isForDisable={props.isForDisable}
                    serviceStages={props.serviceStages}
                />
            ))}

        </Form>
    )
}