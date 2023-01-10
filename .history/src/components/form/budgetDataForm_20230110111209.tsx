import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import BudgetView from "../view/budgetView";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import BudgetServicesForm from "./budgetServicesForm";
import BudgetPaymentsForm from "./budgetPaymentsForm";
import { Budget } from "../../interfaces/objectInterfaces";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import InputSelectPersonCompany from "../inputText/inputSelectPersonCompany";
import { NavBarPath } from "../bar/navBar";

interface BudgetDataFormProps {
    title?: string,
    subtitle?: string,
    index?: number,
    isPrint?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    budget?: Budget,
    prevPath?: NavBarPath[] | any,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
}

export default function BudgetDataForm(props: BudgetDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(true)

    const handleSetTitle = (value) => { handleSet({ ...props.budget, title: value }) }
    const handleSetDate = (value) => { handleSet({ ...props.budget, dateString: value }) }
    const handleSetClient = (value) => { handleSet({ ...props.budget, clients: [value] }) }
    const handleSetPayments = (value) => { handleSet({ ...props.budget, payments: value }) }
    const handleSetServices = (value) => { handleSet({ ...props.budget, services: value }) }

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
        <>
            {props.isPrint && (
                <BudgetView budget={props.budget} />
            )}
            {!props.isPrint && (
                <>
                    <Form
                        title={props.title ?? "Dados básicos"}
                        subtitle={props.subtitle ?? "Informe os dados básicos"}
                    >
                        <FormRow>
                            <FormRowColumn unit="1" unitM="6">
                                <InputText
                                    title="Status"
                                    isDisabled={true}
                                    id="budget-status"
                                    value={props.budget.status}
                                />
                            </FormRowColumn>
                        </FormRow>
                        <FormRow>
                            <FormRowColumn unit="4" unitM="6">
                                <InputTextAutoComplete
                                    onBlur={props.onBlur}
                                    value={props.budget.title}
                                    onSetText={handleSetTitle}
                                    validation={NOT_NULL_MARK}
                                    title="Titulo do orçamento"
                                    isLoading={props.isLoading}
                                    onValidate={handleChangeFormValidation}
                                    id={"budget-title" + (props.index ? "-" + props.index : "")}
                                    validationMessage="O titulo do orçamento não pode ficar em branco."
                                    sugestions={[
                                        "Ambiental",
                                        "Desmembramento",
                                        "Georeferenciamento",
                                        "União",
                                        "Licenciamento"
                                    ]}
                                    isDisabled={props.isDisabled}
                                />
                            </FormRowColumn>
                            <FormRowColumn unit="2" unitM="6">
                                <InputText
                                    mask="date"
                                    title="Prazo"
                                    maxLength={10}
                                    onBlur={props.onBlur}
                                    onSetText={handleSetDate}
                                    isLoading={props.isLoading}
                                    value={props.budget.dateString}
                                    onValidate={handleChangeFormValidation}
                                    id={"budget-date" + (props.index ? "-" + props.index : "")}
                                    isDisabled={props.isDisabled}
                                />
                            </FormRowColumn>
                        </FormRow>
                        <FormRow>
                            <FormRowColumn unit="6">
                                <InputSelectPersonCompany
                                    title="Cliente"
                                    onBlur={props.onBlur}
                                    onSet={handleSetClient}
                                    prevPath={props.prevPath}
                                    isLoading={props.isLoading}
                                    isDisabled={props.isDisabled}
                                    value={props.budget.clients[0]?.name}
                                    id={"budget-client" + (props.index ? "-" + props.index : "")}
                                />
                            </FormRowColumn>
                        </FormRow>
                    </Form>
                    <BudgetServicesForm
                        title="Serviços"
                        formClassName="px-0 py-2"
                        onSet={handleSetServices}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        subtitle="Adicione os serviços"
                        onShowMessage={props.onShowMessage}
                        budgetServices={props.budget.services}
                        id={"budget-service-form" + (props.index ? "-" + props.index : "")}
                    />
                    <BudgetPaymentsForm
                        title="Pagamentos"
                        formClassName="px-0 py-2"
                        onSet={handleSetPayments}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        subtitle="Adicione os pagamentos"
                        onShowMessage={props.onShowMessage}
                        budgetPayments={props.budget.payments}
                        id={"budget-payment-form" + (props.index ? "-" + props.index : "")}
                    />
                </>
            )}
        </>
    )
}
