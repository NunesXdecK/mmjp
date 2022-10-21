import { useState } from "react";
import Button from "../button/button";
import FormRow from "../form/formRow";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import FormRowColumn from "../form/formRowColumn";
import { TrashIcon } from "@heroicons/react/outline";
import { ServicePayment } from "../../interfaces/objectInterfaces";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { handleServicePaymentValidationForDB } from "../../util/validationUtil";

interface ServicePaymentDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isBack?: boolean,
    isSingle?: boolean,
    isLoading?: boolean,
    isForSelect?: boolean,
    isDisabled?: boolean,
    servicePayment: ServicePayment,
    onBlur?: (any) => void,
    onDelete?: (number) => void,
    onFinishAdd?: (any?) => void,
    onSet?: (any, number?) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onUpdateServiceValue?: (any, number) => void,
}

export default function ServicePaymentDataForm(props: ServicePaymentDataFormProps) {
    const [isOpen, setIsOpen] = useState(false)

    const [isFormValid, setIsFormValid] = useState(handleServicePaymentValidationForDB(props.servicePayment).validation)

    const handleSetServicePaymentValue = (value) => {
        if (props.onUpdateServiceValue) {
            props.onUpdateServiceValue(value, props.index)
        } else {
            handleSet({ ...props.servicePayment, value: value })
        }
    }
    const handleSetServicePaymentDate = (value) => { handleSet({ ...props.servicePayment, dateString: value }) }
    const handleSetServicePaymentDescription = (value) => { handleSet({ ...props.servicePayment, description: value }) }

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
            {/*
            <FormRow>
                <FormRowColumn unit="6">
                    <span>{index + 1}</span>
                </FormRowColumn>
            </FormRow>
                */}
            <FormRow>
                <FormRowColumn unit="2">
                    <InputTextAutoComplete
                        title="Descrição"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        validation={NOT_NULL_MARK}
                        isDisabled={props.isDisabled}
                        sugestions={["Entrada", "Parcela"]}
                        onValidate={handleChangeFormValidation}
                        id={"description-payment" + props.index + "-" + props.id}
                        onSetText={handleSetServicePaymentDescription}
                        value={props.servicePayment.description}
                        validationMessage="A descrição não pode ficar em branco."
                    />
                </FormRowColumn>

                <FormRowColumn unit="2">
                    <InputText
                        title="Valor"
                        mask="currency"
                        onBlur={props.onBlur}
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        id={"value-payment-" + props.index + "-" + props.id}
                        onValidate={handleChangeFormValidation}
                        onSetText={handleSetServicePaymentValue}
                        value={props.servicePayment.value}
                        validationMessage="O titulo da etapa não pode ficar em branco."
                    />
                </FormRowColumn>

                <FormRowColumn unit="2" className="flex flex-col sm:flex-row">
                    <InputText
                        mask="date"
                        maxLength={10}
                        title="Vencimento"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetServicePaymentDate}
                        onValidate={handleChangeFormValidation}
                        id={"date-due-payment-" + props.index + "-" + props.id}
                        value={props.servicePayment.dateString}
                    />

                    {!props.isSingle && props.onDelete && !props.isDisabled && (
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
                <p className="text-center">Deseja realmente deletar {props.servicePayment.description}?</p>
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