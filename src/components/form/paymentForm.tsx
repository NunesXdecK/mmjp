import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { Payment } from "../../interfaces/objectInterfaces";
import InputTextCurrency from "../inputText/inputTextCurrency";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import InputTextArea from "../inputText/inputTextArea";

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

    const handleSetValue = (value) => {
        if (props.onUpdateServiceValue) {
            props.onUpdateServiceValue(value, props.index)
        } else {
            handleSet({ ...props.payment, value: value })
        }
    }
    const handleSetTitle = (value) => { handleSet({ ...props.payment, title: value }) }
    const handleSetDate = (value) => { handleSet({ ...props.payment, dateString: value }) }
    const handleSetDescription = (value) => { handleSet({ ...props.payment, description: value }) }

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
                        title="Titulo"
                        onBlur={props.onBlur}
                        validation={NOT_NULL_MARK}
                        onSetText={handleSetTitle}
                        value={props.payment.title}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onValidate={handleChangeFormValidation}
                        sugestions={["Entrada", "Parcela", "Saida"]}
                        validationMessage="A descrição não pode ficar em branco."
                        id={"payment-title" + (props.index ?? 0) + "-" + props.id}
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
                        onSet={handleSetValue}
                        onValidate={handleChangeFormValidation}
                        id={"payment-value" + (props.index ?? 0) + "-" + props.id}
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
                        onSetText={handleSetDate}
                        onValidate={handleChangeFormValidation}
                        id={"payment-date-due" + (props.index ?? 0) + "-" + props.id}
                        value={props.payment.dateString}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputTextArea
                        title="Descrição"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.payment.description}
                        onSetText={handleSetDescription}
                        id={"payment-description" + (props.index ? "-" + props.index : "") + (props.id ? "-" + props.id : "")}
                    />
                </FormRowColumn>
            </FormRow>
        </Form>
    )
}