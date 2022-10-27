import Form from "./form";
import FormRow from "./formRow";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import BudgetServiceDataForm from "./budgetServiceForm";
import CurrencyTextView from "../text/currencyTextView";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import { BudgetService, defaultBudgetService } from "../../interfaces/objectInterfaces";
import { handleValueStringToInt } from "../../util/maskUtil";

interface BudgetServicesFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    formClassName?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    budgetServices?: BudgetService[],
    onSet?: (any) => void,
    onBlur?: (any) => void,
    onFinishAdd?: (any?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function BudgetServicesForm(props: BudgetServicesFormProps) {
    const handleGetTotal = () => {
        let total = 0
        props.budgetServices?.map((element, index) => {
            total = total + handleValueStringToInt(element.total)
        })
        return total.toString()
    }

    const handleSetText = (object, index) => {
        if (props.onSet) {
            props.onSet([
                ...props.budgetServices.slice(0, index),
                object,
                ...props.budgetServices.slice(index + 1, props.budgetServices.length),
            ])
        }
    }

    const handeOnDelete = async (index: number) => {
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        let localServices = [...props.budgetServices]
        let canDelete = true

        if (canDelete) {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
            localServices.splice(index, 1)
            if (props.onSet) {
                props.onSet(localServices)
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
                    isDisabled={props.isDisabled || props.isLoading}
                    onClick={async () => {
                        if (props.onSet) {
                            props.onSet([
                                ...props.budgetServices,
                                {
                                    ...defaultBudgetService,
                                    index: props.budgetServices.length,
                                    dateString: handleUTCToDateShow((handleNewDateToUTC() + 2592000000) + ""),
                                }])
                        }
                    }}>
                    <span className="block sm:hidden">+</span>
                    <span className="sm:block hidden">Adicionar serviço</span>
                </Button>
            )}>

            {props?.budgetServices?.map((element, index) => (
                <BudgetServiceDataForm
                    index={index}
                    onBlur={props.onBlur}
                    onSet={handleSetText}
                    budgetService={element}
                    onDelete={handeOnDelete}
                    isLoading={props.isLoading}
                    isDisabled={props.isDisabled}
                    onFinishAdd={props.onFinishAdd}
                    onShowMessage={props.onShowMessage}
                    key={"budget-services-" + index + props.id}
                />
            ))}

            <div className="p-2">
                <span className="text-gray-800 text-lg font-bold">VALOR TOTAL: </span>
                <CurrencyTextView className="text-lg">{handleGetTotal()}</CurrencyTextView>
            </div>
        </Form>
    )
}