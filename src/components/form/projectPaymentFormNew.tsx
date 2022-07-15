import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { TrashIcon } from "@heroicons/react/outline";
import InputCheckbox from "../inputText/inputCheckbox";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { handleProjectPaymentValidationForDB } from "../../util/validationUtil";
import { ProjectPayment } from "../../interfaces/objectInterfaces";

interface ProjectPaymentFormProps {
    title?: string,
    subtitle?: string,
    index?: number,
    isBack?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    projectPayments?: ProjectPayment[],
    onSet?: (any) => void,
    onDelete?: (number) => void,
}

export default function ProjectPaymentFormTest(props: ProjectPaymentFormProps) {
    const [index, setIndex] = useState(props.index ?? 0)
    const [isFormValid, setIsFormValid] = useState(handleProjectPaymentValidationForDB(props.projectPayments[index]).validation)

    const [isLoading, setIsLoading] = useState(false)

    const handleSetProjectPaymentValue = (value) => { handleSetText({ ...props.projectPayments[index], value: value }) }
    const handleSetProjectPaymentPayed = (value) => { handleSetText({ ...props.projectPayments[index], payed: value }) }
    const handleSetProjectPaymentDescription = (value) => { handleSetText({ ...props.projectPayments[index], description: value }) }
    const handleSetProjectPaymentDate = (value) => { handleSetText({ ...props.projectPayments[index], dateString: value }) }

    const handleSetText = (object) => {
        props.onSet([
            ...props.projectPayments.slice(0, index),
            object,
            ...props.projectPayments.slice(index + 1, props.projectPayments.length),
        ])

    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    return (
        <>
            <FormRow>
                <FormRowColumn unit="4">
                    <InputText
                        id={"value-" + index}
                        title="Valor"
                        mask="currency"
                        isLoading={isLoading}
                        validation={NUMBER_MARK}
                        value={props.projectPayments[index].value}
                        isDisabled={props.isForDisable}
                        onValidate={handleChangeFormValidation}
                        onSetText={handleSetProjectPaymentValue}
                        validationMessage="O titulo da etapa não pode ficar em branco."
                    />
                </FormRowColumn>

                <FormRowColumn unit="2">
                    <InputText
                        mask="date"
                        maxLength={10}
                        id={"date-due-" + index}
                        isLoading={isLoading}
                        title="Vencimento"
                        isDisabled={props.isForDisable}
                        value={props.projectPayments[index].dateString}
                        onSetText={handleSetProjectPaymentDate}
                        onValidate={handleChangeFormValidation}
                    />
                </FormRowColumn>
            </FormRow>

            <FormRow>
                <FormRowColumn unit="6">
                    <InputTextAutoComplete
                        id={"description-" + index}
                        title="Descrição"
                        isLoading={isLoading}
                        validation={NOT_NULL_MARK}
                        isDisabled={props.isForDisable}
                        value={props.projectPayments[index].description}
                        onValidate={handleChangeFormValidation}
                        onSetText={handleSetProjectPaymentDescription}
                        sugestions={["Entrada", "Parcela"]}
                        validationMessage="A descrição não pode ficar em branco."
                    />
                </FormRowColumn>
            </FormRow>

            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputCheckbox
                        id={"payed-" + index}
                        title="Pago?"
                        isLoading={isLoading}
                        value={props.projectPayments[index].payed}
                        isDisabled={props.isForDisable}
                        onSetText={handleSetProjectPaymentPayed}
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