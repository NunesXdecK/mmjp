import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import { TrashIcon } from "@heroicons/react/outline";
import InputTextCurrency from "../inputText/inputTextCurrency";
import { BudgetService } from "../../interfaces/objectInterfaces";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { handleMountNumberCurrency, handleValueStringToFloat } from "../../util/maskUtil";

interface BudgetServiceFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    budgetService?: BudgetService,
    onBlur?: (any) => void,
    onDelete?: (number) => void,
    onFinishAdd?: (any?) => void,
    onSet?: (any, number?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function BudgetServiceForm(props: BudgetServiceFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)

    const handleSetTitle = (value) => { handleSet({ ...props.budgetService, title: value }) }

    const handleSetValue = (value) => {
        const total = handleCalculateTotal(value, props.budgetService.quantity)
        const totalFormated = handleMountNumberCurrency(total.toString(), ".", ",", 3, 2)
        handleSet({ ...props.budgetService, value: value, total: totalFormated })
    }

    const handleSetQuantity = (value) => {
        const total = handleCalculateTotal(props.budgetService.value, value)
        const totalFormated = handleMountNumberCurrency(total.toString(), ".", ",", 3, 2)
        handleSet({ ...props.budgetService, quantity: value, total: totalFormated })
    }

    const handleCalculateTotal = (value: string, quantity: string) => {
        let valueFinal = 0
        let quantityFinal = 0
        try {
            if (value.length) {
                valueFinal = handleValueStringToFloat(value)
            }
            if (quantity.length) {
                quantityFinal = parseInt(quantity)
            }
        } catch (err) {
            console.error(err)
        }
        const v = (valueFinal * quantityFinal).toFixed(2)
        return v
    }

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
                <FormRowColumn unit="2" unitM="6">
                    <InputTextAutoComplete
                        title="Titulo"
                        onBlur={props.onBlur}
                        validation={NOT_NULL_MARK}
                        onSetText={handleSetTitle}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.budgetService.title}
                        validationMessage="Titulo em branco."
                        onValidate={handleChangeFormValidation}
                        id={"budget-service-title" + (props.index ?? 0) + "-" + props.id}
                        sugestions={["Ambiental", "Desmembramento", "Georeferenciamento", "União", "Licenciamento"]}
                    />
                </FormRowColumn>
                <FormRowColumn unit="2" unitM="3">
                    <InputTextCurrency
                        title="Valor unitário"
                        onBlur={props.onBlur}
                        onSet={handleSetValue}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.budgetService.value}
                        onValidate={handleChangeFormValidation}
                        id={"budget-service-value" + (props.index ?? 0) + "-" + props.id}
                    />
                </FormRowColumn>
                <FormRowColumn unit="2" unitM="3">
                    <InputText
                        title="Quantidade"
                        onBlur={props.onBlur}
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetQuantity}
                        value={props.budgetService.quantity}
                        onValidate={handleChangeFormValidation}
                        id={"budget-service-quantity" + (props.index ?? 0) + "-" + props.id}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6" unitM="6">
                    <InputTextCurrency
                        isDisabled
                        title="Total"
                        isLoading={props.isLoading}
                        value={props.budgetService.total}
                        id={"budget-service-total" + (props.index ?? 0) + "-" + props.id}
                    />
                    {!props.isDisabled && props.onDelete && (
                        <Button
                            color="red"
                            isLoading={props.isLoading}
                            className="mt-2 sm:mt-0 ml-2 h-fit self-end"
                            isDisabled={props.isDisabled}
                            onClick={() => {
                                setIsOpen(true)
                            }}
                        >
                            <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                        </Button>
                    )}
                </FormRowColumn>
            </FormRow>

            <WindowModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <p className="text-center">Deseja realmente deletar {props.budgetService.title}?</p>
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