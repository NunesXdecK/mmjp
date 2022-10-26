import Form from "./form";
import FormRow from "./formRow";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import BudgetPaymentForm from "./budgetPaymentForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import { BudgetPayment, defaultBudgetPayment } from "../../interfaces/objectInterfaces";

interface BudgetPaymentsFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    formClassName?: string,
    status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO" | "PENDENTE",
    isBack?: boolean,
    isSingle?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    budgetPayments?: BudgetPayment[],
    onSet?: (any) => void,
    onBlur?: (any) => void,
    onFinishAdd?: (any?) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onUpdateBudgetValue?: (any, number) => void,
}

export default function BudgetPaymentsForm(props: BudgetPaymentsFormProps) {
    const handleSetText = (object, index) => {
        if (props.onSet) {
            props.onSet([
                ...props.budgetPayments.slice(0, index),
                object,
                ...props.budgetPayments.slice(index + 1, props.budgetPayments.length),
            ])
        }
    }

    const handeOnDelete = async (index: number) => {
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        let localPayments = [...props.budgetPayments]
        let canDelete = true

        if (canDelete) {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
            localPayments.splice(index, 1)
            if (props.onSet) {
                props.onSet(localPayments)
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
            titleRight={(
                <Button
                    isLoading={props.isLoading}
                    isDisabled={props.isLoading}
                    onClick={() => {
                        if (props.onSet) {
                            props.onSet([...props.budgetPayments,
                            {
                                ...defaultBudgetPayment,
                                status: props.status ?? "ORÇAMENTO",
                                index: props.budgetPayments?.length,
                                dateString: handleUTCToDateShow((handleNewDateToUTC() + 2592000000) + ""),
                            }])
                        }
                    }}>
                    Adicionar pagamento
                </Button>
            )}>

            {props?.budgetPayments?.map((element, index) => (
                <BudgetPaymentForm
                    index={index}
                    onBlur={props.onBlur}
                    onSet={handleSetText}
                    budgetPayment={element}
                    onDelete={handeOnDelete}
                    isLoading={props.isLoading}
                    isDisabled={props.isDisabled}
                    onFinishAdd={props.onFinishAdd}
                    key={"payments-" + index + props.id}
                    onUpdateServiceValue={props.onUpdateBudgetValue}
                />
            ))}
        </Form>

    )
}