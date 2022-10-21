import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import BudgetServicesForm from "./budgetServicesForm";
import BudgetPaymentsForm from "./budgetPaymentsForm";
import { Budget } from "../../interfaces/objectInterfaces";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import InputSelectPersonCompany from "../inputText/inputSelectPersonCompany";

interface BudgetDataFormProps {
    budget?: Budget,
    index?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
}

export default function BudgetDataForm(props: BudgetDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(true)

    const handleSetPayments = (value) => { handleSet({ ...props.budget, payments: value }) }
    const handleSetServices = (value) => { handleSet({ ...props.budget, services: value }) }
    const handleSetTitle = (value) => { handleSet({ ...props.budget, title: value }) }
    const handleSetDate = (value) => { handleSet({ ...props.budget, dateString: value }) }
    const handleSetClient = (value) => { handleSet({ ...props.budget, clients: [value] }) }

    const handleSet = (value: Budget) => {
        if (props.onSet) {
            if (props.index) {
                props.onSet(value, props.index)
            } else {
                props.onSet(value)
            }
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    return (
        <div>
            <FormRow>
                <FormRowColumn unit="4">
                    <InputTextAutoComplete
                        id="budget-title"
                        onBlur={props.onBlur}
                        value={props.budget.title}
                        onSetText={handleSetTitle}
                        validation={NOT_NULL_MARK}
                        title="Titulo do orçamento"
                        isLoading={props.isLoading}
                        onValidate={handleChangeFormValidation}
                        validationMessage="O titulo do orçamento não pode ficar em branco."
                        sugestions={[
                            "Ambiental",
                            "Desmembramento",
                            "Georeferenciamento",
                            "União",
                            "Licenciamento"
                        ]}
                        isDisabled={
                            props.isDisabled ||
                            (props.budget.status === "FINALIZADO" || props.budget.status === "ARQUIVADO")
                        }
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        mask="date"
                        title="Data"
                        maxLength={10}
                        id="budget-date"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        onSetText={handleSetDate}
                        value={props.budget.dateString}
                        onValidate={handleChangeFormValidation}
                        isDisabled={
                            props.isDisabled ||
                            (props.budget.status === "FINALIZADO" || props.budget.status === "ARQUIVADO")
                        }
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6">
                    <InputSelectPersonCompany
                        title="Cliente"
                        id="budget-client"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.budget.clients[0]?.name}
                        onSetPersonsAndCompanies={handleSetClient}
                    />
                </FormRowColumn>
            </FormRow>

            <BudgetServicesForm
                title="Serviços"
                formClassName="px-0 py-2"
                onSet={handleSetServices}
                isLoading={props.isLoading}
                subtitle="Adicione os serviços"
                onShowMessage={props.onShowMessage}
                budgetServices={props.budget.services}
                isDisabled={props.isDisabled ||
                    (props.budget.status === "FINALIZADO" ||
                        props.budget.status === "ARQUIVADO")}
            />

            <BudgetPaymentsForm
                title="Pagamentos"
                formClassName="px-0 py-2"
                onSet={handleSetPayments}
                isLoading={props.isLoading}
                subtitle="Adicione os pagamentos"
                onShowMessage={props.onShowMessage}
                budgetPayments={props.budget.payments}
            />
        </div>
    )
}
