import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { Payment } from "../../interfaces/objectInterfaces";
import InputTextCurrency from "../inputText/inputTextCurrency";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";

interface PaymentFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    payment: Payment,
    onBlur?: (any) => void,
    onSet?: (any, number?) => void,
    onUpdateServiceValue?: (any, number) => void,
}

export default function PaymentForm(props: PaymentFormProps) {
    const [isOpen, setIsOpen] = useState(false)

    const [isFormValid, setIsFormValid] = useState(false)

    const handleSetServicePaymentValue = (value) => {
        if (props.onUpdateServiceValue) {
            props.onUpdateServiceValue(value, props.index)
        } else {
            handleSet({ ...props.payment, value: value })
        }
    }
    const handleSetServicePaymentDate = (value) => { handleSet({ ...props.payment, dateString: value }) }
    const handleSetServicePaymentDescription = (value) => { handleSet({ ...props.payment, description: value }) }

    const handleSet = (element) => {
        if (props.onSet) {
            if (props.index > -1) {
                props.onSet(element, props.index)
            } else {
                props.onSet(element)
            }
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    return (
        <Form
            title={props.title ?? "Dados básicos"}
            subtitle={props.subtitle ?? "Informe os dados básicos"}
        >
            <FormRow>
                <FormRowColumn unit="1">
                    <InputText
                        title="Status"
                        isDisabled={true}
                        id="status-payment"
                        value={props.payment.status}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6">
                    <InputTextAutoComplete
                        title="Descrição"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        validation={NOT_NULL_MARK}
                        isDisabled={props.isDisabled}
                        value={props.payment.description}
                        onValidate={handleChangeFormValidation}
                        sugestions={["Entrada", "Parcela", "Saida"]}
                        onSetText={handleSetServicePaymentDescription}
                        validationMessage="A descrição não pode ficar em branco."
                        id={"description-payment-" + (props.index ?? 0) + "-" + props.id}
                    />
                </FormRowColumn>
            </FormRow>

            <FormRow>
                <FormRowColumn unit="3">
                    <InputTextCurrency
                        title="Valor"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.payment.value}
                        onSet={handleSetServicePaymentValue}
                        onValidate={handleChangeFormValidation}
                        id={"value-payment-" + (props.index ?? 0) + "-" + props.id}
                        validationMessage="O titulo da etapa não pode ficar em branco."
                    />
                </FormRowColumn>

                <FormRowColumn unit="3" className="flex flex-col sm:flex-row">
                    <InputText
                        mask="date"
                        maxLength={10}
                        title="Vencimento"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetServicePaymentDate}
                        onValidate={handleChangeFormValidation}
                        id={"date-due-payment-" + (props.index ?? 0) + "-" + props.id}
                        value={props.payment.dateString}
                    />
                </FormRowColumn>
            </FormRow>
        </Form>
    )
}