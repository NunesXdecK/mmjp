import Form from "./form"
import FormRow from "./formRow"
import { useState } from "react"
import { NavBarPath } from "../bar/navBar"
import FormRowColumn from "./formRowColumn"
import InputText from "../inputText/inputText"
import { handleOnlyDate } from "../../util/dateUtils"
import InputTextArea from "../inputText/inputTextArea"
import { Payment } from "../../interfaces/objectInterfaces"
import InputTextCurrency from "../inputText/inputTextCurrency"
import { NOT_NULL_MARK } from "../../util/patternValidationUtil"
import InputTextAutoComplete from "../inputText/inputTextAutocomplete"

interface PaymentDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    payment: Payment,
    prevPath?: NavBarPath[] | any,
    onBlur?: (any) => void,
    onSet?: (any, number?) => void,
    onUpdateServiceValue?: (any, number) => void,
}

export default function PaymentDataForm(props: PaymentDataFormProps) {
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
    const handleSetDate = (value) => { handleSet({ ...props.payment, dateDue: value }) }
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
                <FormRowColumn unit="2" unitM="6">
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
                        onSet={handleSetValue}
                        isLoading={props.isLoading}
                        value={props.payment?.value}
                        isDisabled={props.isDisabled}
                        onValidate={handleChangeFormValidation}
                        id={"payment-value" + (props.index ?? 0) + "-" + props.id}
                        validationMessage="O titulo da etapa não pode ficar em branco."
                    />
                </FormRowColumn>
                <FormRowColumn unit="3" className="flex flex-col sm:flex-row">
                    <InputText
                        type="date"
                        title="Vencimento"
                        maxLength={10}
                        onBlur={props.onBlur}
                        onSetText={handleSetDate}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onValidate={handleChangeFormValidation}
                        value={handleOnlyDate(props.payment?.dateDue) ?? ""}
                        id={"payment-date" + (props.index ? "-" + props.index : "")}
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
                        onSetText={handleSetDescription}
                        value={props.payment?.description}
                        id={"payment-description" + (props.index ? "-" + props.index : "") + (props.id ? "-" + props.id : "")}
                    />
                </FormRowColumn>
            </FormRow>
        </Form>
    )
}