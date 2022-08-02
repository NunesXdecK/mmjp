import Button from "../button/button";
import ServiceStageDataForm from "./serviceStageDataForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import { defaultServiceStage, ServiceStage } from "../../interfaces/objectInterfaces";
import Form from "../form/form";
import FormRow from "../form/formRow";
import FormRowColumn from "../form/formRowColumn";

interface ServiceStageFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    formClassName?: string,
    isBack?: boolean,
    isLoading?: boolean,
    serviceStages?: ServiceStage[],
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

        if (localServiceStage.id && localServiceStage.id !== "") {
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
            <FormRow>
                <FormRowColumn unit="6" className="flex justify-end">
                    <Button
                        isLoading={props.isLoading}
                        isDisabled={props.isLoading}
                        onClick={() => {
                            if (props.onSetServiceStages) {
                                props.onSetServiceStages([...props.serviceStages, { ...defaultServiceStage, dateString: handleUTCToDateShow(handleNewDateToUTC() + ""), index: props.serviceStages?.length }])
                            }
                        }}>
                        Adicionar etapa
                    </Button>
                </FormRowColumn>
            </FormRow>

            {props?.serviceStages?.map((element, index) => (
                <ServiceStageDataForm
                    key={index}
                    index={index}
                    onDelete={handeOnDelete}
                    onSetText={handleSetText}
                    isLoading={props.isLoading}
                    serviceStages={props.serviceStages}
                />
            ))}

        </Form>
    )
}