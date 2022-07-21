import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { TrashIcon } from "@heroicons/react/outline";
import InputCheckbox from "../inputText/inputCheckbox";
import { ProjectPayment } from "../../interfaces/objectInterfaces";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { handleProjectPaymentValidationForDB } from "../../util/validationUtil";

interface ProjectPaymentDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isBack?: boolean,
    isLoading?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    projectPayments?: ProjectPayment[],
    onSetText?: (any, number) => void,
    onDelete?: (number) => void,
}

export default function ProjectPaymentDataForm(props: ProjectPaymentDataFormProps) {
    const [index, setIndex] = useState(props.index ?? 0)

    const [isFormValid, setIsFormValid] = useState(handleProjectPaymentValidationForDB(props.projectPayments[index]).validation)

    const handleSetProjectPaymentValue = (value) => { handleSetText({ ...props.projectPayments[index], value: value }) }
    const handleSetProjectPaymentPayed = (value) => { handleSetText({ ...props.projectPayments[index], payed: value }) }
    const handleSetProjectPaymentDate = (value) => { handleSetText({ ...props.projectPayments[index], dateString: value }) }
    const handleSetProjectPaymentDescription = (value) => { handleSetText({ ...props.projectPayments[index], description: value }) }

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
            <FormRow>
                <FormRowColumn unit="4">
                    <InputText
                        title="Valor"
                        mask="currency"
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        id={"value-" + index + "-" + props.id}
                        onValidate={handleChangeFormValidation}
                        onSetText={handleSetProjectPaymentValue}
                        value={props.projectPayments[index].value}
                        validationMessage="O titulo da etapa não pode ficar em branco."
                    />
                </FormRowColumn>

                <FormRowColumn unit="2">
                    <InputText
                        mask="date"
                        maxLength={10}
                        title="Vencimento"
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        onSetText={handleSetProjectPaymentDate}
                        onValidate={handleChangeFormValidation}
                        id={"date-due-" + index + "-" + props.id}
                        value={props.projectPayments[index].dateString}
                    />
                </FormRowColumn>
            </FormRow>

            <FormRow>
                <FormRowColumn unit="6">
                    <InputTextAutoComplete
                        title="Descrição"
                        isLoading={props.isLoading}
                        validation={NOT_NULL_MARK}
                        isDisabled={props.isForDisable}
                        sugestions={["Entrada", "Parcela"]}
                        onValidate={handleChangeFormValidation}
                        id={"description-" + index + "-" + props.id}
                        onSetText={handleSetProjectPaymentDescription}
                        value={props.projectPayments[index].description}
                        validationMessage="A descrição não pode ficar em branco."
                    />
                </FormRowColumn>
            </FormRow>

            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputCheckbox
                        title="Pago?"
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        id={"payed-" + index + "-" + props.id}
                        onSetText={handleSetProjectPaymentPayed}
                        value={props.projectPayments[index].payed}
                    />
                </FormRowColumn>
            </FormRow>

            <FormRow>
                <FormRowColumn unit="6" className="flex content-end justify-end">
                    <Button
                        color="red"
                        className="mr-2 group"
                        onClick={() => {
                            if (props.onDelete) {
                                props.onDelete(index)
                            }
                        }}
                    >
                        <div className="flex flex-row">
                            <span className="mr-2">Excluir</span>
                            <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                        </div>
                    </Button>
                </FormRowColumn>
            </FormRow>
        </>
    )
}