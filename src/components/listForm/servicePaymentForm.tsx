import Form from "../form/form";
import FormRow from "../form/formRow";
import Button from "../button/button";
import FormRowColumn from "../form/formRowColumn";
import ServicePaymentDataForm from "./servicePaymentDataForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import { defaultServicePayment, ServicePayment } from "../../interfaces/objectInterfaces";

interface ServicePaymentFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    formClassName?: string,
    status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO" | "PENDENTE",
    isBack?: boolean,
    isLoading?: boolean,
    isForDisable?: boolean,
    servicePayments?: ServicePayment[],
    onBlur?: (any) => void,
    onSetServicePayments?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServicePaymentForm(props: ServicePaymentFormProps) {
    const handleSetText = (object, index) => {
        if (props.onSetServicePayments) {
            props.onSetServicePayments([
                ...props.servicePayments.slice(0, index),
                object,
                ...props.servicePayments.slice(index + 1, props.servicePayments.length),
            ])
        }
    }

    const handeOnDelete = async (index: number) => {
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        let localServicePayments = [...props.servicePayments]
        let localServicePayment = localServicePayments[index]
        let canDelete = true

        if (localServicePayment && "id" in localServicePayment && localServicePayment.id.length) {
            const res = await fetch("api/servicePayment", {
                method: "DELETE",
                body: JSON.stringify({ token: "tokenbemseguro", id: localServicePayment.id }),
            }).then((res) => res.json())

            if (res.status !== "SUCCESS") {
                canDelete = false
                feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
            }
        }

        if (canDelete) {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
            localServicePayments.splice(index, 1)
            if (props.onSetServicePayments) {
                props.onSetServicePayments(localServicePayments)
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
                                if (props.onSetServicePayments) {
                                    props.onSetServicePayments([...props.servicePayments,
                                    {
                                        ...defaultServicePayment,
                                        status: props.status ?? "ORÇAMENTO",
                                        index: props.servicePayments?.length,
                                        dateString: handleUTCToDateShow((handleNewDateToUTC() + 2592000000) + ""),
                                    }])
                                }
                            }}>
                            Adicionar pagamento
                        </Button>
                    </FormRowColumn>
                </FormRow>
            )}

            {props?.servicePayments?.map((element, index) => (
                <ServicePaymentDataForm
                    key={index}
                    index={index}
                    onBlur={props.onBlur}
                    onDelete={handeOnDelete}
                    onSetText={handleSetText}
                    isLoading={props.isLoading}
                    isForDisable={props.isForDisable}
                    servicePayments={props.servicePayments}
                />
            ))}

        </Form>
    )
}