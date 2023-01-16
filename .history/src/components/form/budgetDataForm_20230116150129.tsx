import Form from "./form"
import FormRow from "./formRow"
import { useState } from "react"
import { NavBarPath } from "../bar/navBar"
import BudgetView from "../view/budgetView"
import FormRowColumn from "./formRowColumn"
import InputText from "../inputText/inputText"
import BudgetPaymentPage from "../page/BudgetPaymentPage"
import BudgetServicePage from "../page/BudgetServicePage"
import { Budget, BudgetPayment, BudgetService } from "../../interfaces/objectInterfaces"
import { NOT_NULL_MARK } from "../../util/patternValidationUtil"
import InputTextAutoComplete from "../inputText/inputTextAutocomplete"
import InputSelectPersonCompany from "../inputText/inputSelectPersonCompany"
import CurrencyTextView from "../text/currencyTextView"
import { handleRemoveCurrencyMask, handleValueStringToInt, } from "../../util/maskUtil"
import { handleSaveBudgetPaymentInner } from "../bar/budgetPaymentActionBar"
import InputTextArea from "../inputText/inputTextArea"

interface BudgetDataFormProps {
  title?: string
  subtitle?: string
  index?: number
  isPrint?: boolean
  isLoading?: boolean
  isDisabled?: boolean
  budget?: Budget
  prevPath?: NavBarPath[] | any
  onBlur?: (any) => void
  onShowMessage?: (any) => void
  onSetIsLoading?: (any) => void
  onSet?: (any, number?) => void
}

export default function BudgetDataForm(props: BudgetDataFormProps) {
  const [isFormValid, setIsFormValid] = useState(true)

  const handleSetTitle = (value) => {
    handleSet({ ...props.budget, title: value })
  }
  const handleSetDate = (value) => {
    handleSet({ ...props.budget, dateDue: value })
  }
  const handleSetClient = (value) => {
    handleSet({ ...props.budget, clients: [value] })
  }
  const handleSetPayments = (value) => {
    handleSet({ ...props.budget, payments: value })
  }
  const handleSetServices = (value) => {
    handleSet({ ...props.budget, services: value })
  }
  const handleSetDescription = (value) => {
    handleSet({ ...props.budget, description: value })
  }
  const handleSetServicesPayments = (services, payments) => {
    handleSet({ ...props.budget, services: services, payments: payments })
  }

  const handleSetIsLoading = (value) => {
    if (props.onSetIsLoading) {
      props.onSetIsLoading(value)
    }
  }

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

  const handleAfterSave = async (services) => {
    let total = 0
    services?.map((element: BudgetService, index) => {
      total =
        total +
        handleValueStringToInt(
          (
            (parseInt(handleRemoveCurrencyMask(element.value)) ?? 0) *
            (parseInt(element.quantity) ?? 0)
          ).toString()
        )
    })
    if (props.budget?.payments?.length === 0) {
      handleSetIsLoading(true)
      const entryPayment: BudgetPayment = {
        id: 0,
        index: 0,
        dateDue: "",
        title: "Entrada",
        value: handleRemoveCurrencyMask((total / 2).toString()),
      }
      const endingPayment: BudgetPayment = {
        id: 0,
        index: 0,
        dateDue: "",
        title: "Final",
        value: handleRemoveCurrencyMask((total / 2).toString()),
      }
      const resEntry = await handleSaveBudgetPaymentInner(
        entryPayment,
        props.budget.id,
        false
      )
      const resEnd = await handleSaveBudgetPaymentInner(
        endingPayment,
        props.budget.id,
        false
      )
      const payments = [
        { ...entryPayment, id: resEntry.id },
        { ...endingPayment, id: resEnd.id },
      ]
      handleSetServicesPayments(services, payments)
      handleSetIsLoading(false)
    } else if (props.budget?.payments?.length === 0) {
    } else {
      handleSetServices(services)
    }
  }

  const handleGetTotal = (list: BudgetService[]) => {
    let total = 0
    list?.map((element: BudgetService, index) => {
      total =
        total +
        handleValueStringToInt(
          (
            (parseInt(handleRemoveCurrencyMask(element.value)) ?? 0) *
            (parseInt(element.quantity) ?? 0)
          ).toString()
        )
    })
    return total.toString()
  }

  return (
    <>
      {props.isPrint && <BudgetView budget={props.budget} />}
      {!props.isPrint && (
        <>
          <Form
            title={props.title ?? "Dados básicos"}
            subtitle={props.subtitle ?? "Informe os dados básicos"}
          >
            <FormRow>
              <FormRowColumn unit="2" unitM="6">
                <InputText
                  title="Status"
                  isDisabled={true}
                  id="budget-status"
                  value={props.budget.status}
                />
              </FormRowColumn>
            </FormRow>
            <FormRow>
              <FormRowColumn unit="3" unitM="6">
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
                    "Licenciamento",
                  ]}
                  isDisabled={props.isDisabled}
                />
              </FormRowColumn>
              <FormRowColumn unit="3" unitM="6">
                <InputText
                  type="date"
                  title="Prazo"
                  maxLength={10}
                  onBlur={props.onBlur}
                  onSetText={handleSetDate}
                  isLoading={props.isLoading}
                  value={props.budget.dateDue}
                  isDisabled={props.isDisabled}
                  onValidate={handleChangeFormValidation}
                  id={"budget-date" + (props.index ? "-" + props.index : "")}
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
            <FormRow>
              <FormRowColumn unit="6" className="">
                <InputTextArea
                  title="Descrição"
                  onBlur={props.onBlur}
                  id="budget-description"
                  isLoading={props.isLoading}
                  isDisabled={props.isDisabled}
                  onSetText={handleSetDescription}
                  value={props.budget.description}
                />
              </FormRowColumn>
            </FormRow>
          </Form>
          {props?.budget.id > 0 && (
            <>
              <Form title="Serviços" subtitle="Adicione os serviços">
                <BudgetServicePage
                  canSave
                  canDelete
                  prevPath={props.prevPath}
                  onSet={handleSetServices}
                  budgetId={props.budget.id}
                  isLoading={props.isLoading}
                  isDisabled={props.isDisabled}
                  onAfterSave={handleAfterSave}
                  onShowMessage={props.onShowMessage}
                  onSetIsLoading={props.onSetIsLoading}
                  budgetServices={props.budget.services}
                />
                <div className="p-2 text-gray-800 dark:text-gray-200">
                  <span className="text-lg font-bold">VALOR TOTAL: </span>
                  <CurrencyTextView className="text-lg">
                    {handleGetTotal(props?.budget?.services ?? [])}
                  </CurrencyTextView>
                </div>
              </Form>
              <Form title="Pagamentos" subtitle="Adicione os pagamentos">
                <BudgetPaymentPage
                  canSave
                  canDelete
                  prevPath={props.prevPath}
                  onSet={handleSetPayments}
                  budgetId={props.budget.id}
                  isLoading={props.isLoading}
                  isDisabled={props.isDisabled}
                  onShowMessage={props.onShowMessage}
                  onSetIsLoading={props.onSetIsLoading}
                  budgetPayments={props.budget.payments}
                />
              </Form>
            </>
          )}
        </>
      )}
    </>
  )
}
