import { useState } from "react";
import Button from "../button/button";
import InputText from "../inputText/inputText";
import { TrashIcon } from "@heroicons/react/outline";
import InputCheckbox from "../inputText/inputCheckbox";
import { ServicePayment } from "../../interfaces/objectInterfaces";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { handleServicePaymentValidationForDB } from "../../util/validationUtil";
import WindowModal from "../modal/windowModal";
import FormRow from "../form/formRow";
import FormRowColumn from "../form/formRowColumn";

interface ServicePaymentDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isBack?: boolean,
    isLoading?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    servicePayments?: ServicePayment[],
    onDelete?: (number) => void,
    onSetText?: (any, number) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServicePaymentDataForm(props: ServicePaymentDataFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [index, setIndex] = useState(props.index ?? 0)

    const [isFormValid, setIsFormValid] = useState(handleServicePaymentValidationForDB(props.servicePayments[index]).validation)

    const handleSetServicePaymentValue = (value) => { handleSetText({ ...props.servicePayments[index], value: value }) }
    const handleSetServicePaymentPayed = (value) => { handleSetText({ ...props.servicePayments[index], payed: value }) }
    const handleSetServicePaymentDate = (value) => { handleSetText({ ...props.servicePayments[index], dateString: value }) }
    const handleSetServicePaymentDescription = (value) => { handleSetText({ ...props.servicePayments[index], description: value }) }

    const handleSetText = (element) => {
        if (props.onSetText) {
            props.onSetText(element, index)
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
                        isLoading={props.isLoading}
                        validation={NOT_NULL_MARK}
                        isDisabled={props.isForDisable}
                        sugestions={["Entrada", "Parcela"]}
                        onValidate={handleChangeFormValidation}
                        id={"description-" + index + "-" + props.id}
                        onSetText={handleSetServicePaymentDescription}
                        value={props.servicePayments[index].description}
                        validationMessage="A descrição não pode ficar em branco."
                    />
                </FormRowColumn>

                <FormRowColumn unit="2">
                    <InputText
                        title="Valor"
                        mask="currency"
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        id={"value-" + index + "-" + props.id}
                        onValidate={handleChangeFormValidation}
                        onSetText={handleSetServicePaymentValue}
                        value={props.servicePayments[index].value}
                        validationMessage="O titulo da etapa não pode ficar em branco."
                    />
                </FormRowColumn>

                <FormRowColumn unit="1">
                    <InputText
                        mask="date"
                        maxLength={10}
                        title="Vencimento"
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        onSetText={handleSetServicePaymentDate}
                        onValidate={handleChangeFormValidation}
                        id={"date-due-" + index + "-" + props.id}
                        value={props.servicePayments[index].dateString}
                    />
                </FormRowColumn>

                {props.onDelete && (
                    <FormRowColumn unit="1" className="place-self-end">
                        <Button
                            color="red"
                            className="mr-2 group"
                            isLoading={props.isLoading}
                            isDisabled={props.isForDisable}
                            onClick={() => {
                                setIsOpen(true)
                            }}
                        >
                            <div className="flex flex-row">
                                <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                            </div>
                        </Button>
                    </FormRowColumn>
                )}
            </FormRow>

            <WindowModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <p className="text-center">Deseja realmente deletar {props.servicePayments[index].description}?</p>
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
                                props.onDelete(index)
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