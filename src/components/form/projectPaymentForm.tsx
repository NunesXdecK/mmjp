import Form from "./form";
import FormRow from "./formRow";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import ProjectPaymentDataForm from "./projectPaymentDataForm";
import { defaultProjectPayment, ProjectPayment } from "../../interfaces/objectInterfaces";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import { FeedbackMessage } from "../modal/feedbackMessageModal";

interface ProjectPaymentFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    isLoading?: boolean,
    projectPayments?: ProjectPayment[],
    onSetProjectPayments?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectPaymentForm(props: ProjectPaymentFormProps) {
    const handleSetText = (object, index) => {
        if (props.onSetProjectPayments) {
            props.onSetProjectPayments([
                ...props.projectPayments.slice(0, index),
                object,
                ...props.projectPayments.slice(index + 1, props.projectPayments.length),
            ])
        }
    }

    const handeOnDelete = async (index: number) => {
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        let localProjectPayments = [...props.projectPayments]
        let localProjectPayment = localProjectPayments[index]
        let canDelete = true

        if (localProjectPayment.id && localProjectPayment.id !== "") {
            const res = await fetch("api/projectPayment", {
                method: "DELETE",
                body: JSON.stringify({ token: "tokenbemseguro", id: localProjectPayment.id }),
            }).then((res) => res.json())

            if (res.status !== "SUCCESS") {
                canDelete = false
                feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
            }
        }

        if (canDelete) {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
            localProjectPayments.splice(index, 1)
            if (props.onSetProjectPayments) {
                props.onSetProjectPayments(localProjectPayments)
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
            <FormRow>
                <FormRowColumn unit="6" className="flex justify-end">
                    <Button
                        isLoading={props.isLoading}
                        isDisabled={props.isLoading}
                        onClick={() => {
                            if (props.onSetProjectPayments) {
                                props.onSetProjectPayments([...props.projectPayments, { ...defaultProjectPayment, dateString: handleUTCToDateShow(handleNewDateToUTC() + ""), index: props.projectPayments?.length }])
                            }
                        }}>
                        Adicionar pagamento
                    </Button>
                </FormRowColumn>
            </FormRow>

            {props?.projectPayments?.map((element, index) => (
                <ProjectPaymentDataForm
                    key={index}
                    index={index}
                    onDelete={handeOnDelete}
                    onSetText={handleSetText}
                    isLoading={props.isLoading}
                    projectPayments={props.projectPayments}
                />
            ))}

        </Form>
    )
}