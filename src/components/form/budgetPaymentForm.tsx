import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import { TrashIcon } from "@heroicons/react/outline";
import InputTextCurrency from "../inputText/inputTextCurrency";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import { BudgetPayment } from "../../interfaces/objectInterfaces";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";

interface BudgetPaymentFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    budgetPayment: BudgetPayment,
    onBlur?: (any) => void,
    onDelete?: (number) => void,
    onFinishAdd?: (any?) => void,
    onSet?: (any, number?) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onUpdateServiceValue?: (any, number) => void,
}

export default function BudgetPaymentForm(props: BudgetPaymentFormProps) {
    const [isOpen, setIsOpen] = useState(false)

    const [isFormValid, setIsFormValid] = useState(false)

    const handleSetValue = (value) => {
        if (props.onUpdateServiceValue) {
            props.onUpdateServiceValue(value, props.index)
        } else {
            handleSet({ ...props.budgetPayment, value: value })
        }
    }
    const handleSetDate = (value) => { handleSet({ ...props.budgetPayment, dateString: value }) }
    const handleSetDescription = (value) => { handleSet({ ...props.budgetPayment, title: value }) }

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
        <>
            <FormRow>
                <FormRowColumn unit="2">
                    <InputTextAutoComplete
                        title="Titulo"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        validation={NOT_NULL_MARK}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetDescription}
                        value={props.budgetPayment.title}
                        onValidate={handleChangeFormValidation}
                        sugestions={["Entrada", "Parcela", "Saida"]}
                        validationMessage="A descrição não pode ficar em branco."
                        id={"budget-payment-description" + (props.index ?? 0) + "-" + props.id}
                    />
                </FormRowColumn>

                <FormRowColumn unit="2">
                    <InputTextCurrency
                        title="Valor"
                        onBlur={props.onBlur}
                        onSet={handleSetValue}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.budgetPayment.value}
                        onValidate={handleChangeFormValidation}
                        validationMessage="O titulo da etapa não pode ficar em branco."
                        id={"budget-payment-value" + (props.index ?? 0) + "-" + props.id}
                    />
                </FormRowColumn>

                <FormRowColumn unit="2" className="flex flex-col sm:flex-row">
                    <InputText
                        mask="date"
                        maxLength={10}
                        title="Vencimento"
                        onBlur={props.onBlur}
                        onSetText={handleSetDate}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.budgetPayment.dateString}
                        onValidate={handleChangeFormValidation}
                        id={"budget-payment-date-due" + (props.index ?? 0) + "-" + props.id}
                    />

                    {props.onDelete && !props.isDisabled && (
                        <Button
                            color="red"
                            className="ml-2 mt-2 sm:mt-0 h-fit self-end"
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onClick={() => {
                                setIsOpen(true)
                            }}
                        >
                            <div className="flex flex-row">
                                <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                            </div>
                        </Button>
                    )}
                </FormRowColumn>
            </FormRow>

            <WindowModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <p className="text-center">Deseja realmente deletar {props.budgetPayment.title}?</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={(event) => {
                            event.preventDefault()
                            setIsOpen(false)
                        }}
                    >
                        Voltar
                    </Button>
                    <Button
                        color="red"
                        type="submit"
                        onClick={(event) => {
                            event.preventDefault()
                            if (props.onDelete) {
                                props.onDelete(props.index)
                            }
                            setIsOpen(false)
                        }}
                    >
                        Excluir
                    </Button>
                </div>
            </WindowModal>
        </>
    )
}