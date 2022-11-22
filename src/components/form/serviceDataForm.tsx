import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import InputTextArea from "../inputText/inputTextArea";
import ServiceStagePage from "../page/ServiceStagePage";
import { Service } from "../../interfaces/objectInterfaces";
import InputTextCurrency from "../inputText/inputTextCurrency";
import SelectImmobileTOForm from "../select/selectImmobileTOForm";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import InputSelectProfessional from "../inputText/inputSelectProfessional";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { handleMountNumberCurrency, handleValueStringToFloat } from "../../util/maskUtil";

interface ServiceDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    prevPath?: any,
    service?: Service,
    onBlur?: (any) => void,
    onDelete?: (number) => void,
    onFinishAdd?: (any?) => void,
    onSet?: (any, number?) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceDataForm(props: ServiceDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(false)

    const handleSetTitle = (value) => { handleSet({ ...props.service, title: value }) }
    const handleSetDate = (value) => { handleSet({ ...props.service, dateString: value }) }
    const handleSetDescription = (value) => { handleSet({ ...props.service, description: value }) }
    const handleSetProfessional = (value) => { handleSet({ ...props.service, professional: value }) }
    const handleSetServiceStage = (value) => { handleSet({ ...props.service, serviceStages: value }) }
    const handleSetImmobileTarget = (value) => { handleSet({ ...props.service, immobilesTarget: value }) }
    const handleSetImmobileOrigin = (value) => { handleSet({ ...props.service, immobilesOrigin: value }) }

    const handleSetValue = (value) => {
        const total = handleCalculateTotal(value, props.service.quantity)
        const totalFormated = handleMountNumberCurrency(total.toString(), ".", ",", 3, 2)
        handleSet({ ...props.service, value: value, total: totalFormated })
    }

    const handleSetQuantity = (value) => {
        const total = handleCalculateTotal(props.service.value, value)
        const totalFormated = handleMountNumberCurrency(total.toString(), ".", ",", 3, 2)
        handleSet({ ...props.service, quantity: value, total: totalFormated })
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

    const handleSet = (element: Service) => {
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

            <Form
                title="Dados básicos"
                subtitle="informe os dados básicos"
            >
                <FormRow>
                    <FormRowColumn unit="1">
                        <InputText
                            title="Status"
                            isDisabled={true}
                            id="service-status"
                            value={props.service.status}
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="4">
                        <InputTextAutoComplete
                            title="Titulo"
                            onBlur={props.onBlur}
                            onSetText={handleSetTitle}
                            validation={NOT_NULL_MARK}
                            value={props.service.title}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            validationMessage="Titulo em branco."
                            onValidate={handleChangeFormValidation}
                            id={"service-title" + (props.index ?? 0) + "-" + props.id}
                            sugestions={["Ambiental", "Desmembramento", "Georeferenciamento", "União", "Licenciamento"]}
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="2">
                        <InputText
                            mask="date"
                            title="Prazo"
                            maxLength={10}
                            onBlur={props.onBlur}
                            onSetText={handleSetDate}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            value={props.service.dateString}
                            onValidate={handleChangeFormValidation}
                            id={"service-date-due" + props.index + "-" + props.id}
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="2">
                        <InputTextCurrency
                            title="Valor"
                            onBlur={props.onBlur}
                            onSet={handleSetValue}
                            isLoading={props.isLoading}
                            value={props.service.value}
                            isDisabled={props.isDisabled}
                            onValidate={handleChangeFormValidation}
                            id={"service-value" + (props.index ?? 0) + "-" + props.id}
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="2">
                        <InputText
                            title="Quantidade"
                            onBlur={props.onBlur}
                            validation={NUMBER_MARK}
                            isLoading={props.isLoading}
                            onSetText={handleSetQuantity}
                            isDisabled={props.isDisabled}
                            value={props.service.quantity}
                            onValidate={handleChangeFormValidation}
                            id={"service-quantity" + (props.index ?? 0) + "-" + props.id}
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="2" className="flex flex-col sm:flex-row">
                        <InputTextCurrency
                            isDisabled
                            title="Total"
                            isLoading={props.isLoading}
                            value={props.service.total}
                            id={"service-total" + (props.index ?? 0) + "-" + props.id}
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="6" className="">
                        <InputSelectProfessional
                            title="Profissional"
                            onBlur={props.onBlur}
                            isLoading={props.isLoading}
                            onSet={handleSetProfessional}
                            isDisabled={props.isDisabled}
                            value={props.service?.professional?.title}
                            id={"service-professional" + (props.index ? "-" + props.index : "")}
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="6">
                        <InputTextArea
                            title="Descrição"
                            onBlur={props.onBlur}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onSetText={handleSetDescription}
                            value={props.service.description}
                            id={"service-description" + props.index + "-" + props.id}
                        />
                    </FormRowColumn>
                </FormRow>
            </Form>
            {props.service?.id?.length > 0 && (
                <>
                    <SelectImmobileTOForm
                        title="Imóveis"
                        isDisabled={props.isDisabled}
                        subtitle="Selecione os imóveis"
                        onSetTarget={handleSetImmobileTarget}
                        onSetOrigin={handleSetImmobileOrigin}
                        valueTarget={props.service.immobilesTarget}
                        valueOrigin={props.service.immobilesOrigin}
                        id={"service-immobiles" + props.index + "-" + props.id}
                    />
                    <Form
                        title="Etapas"
                        subtitle="Selecione as etapas"
                    >
                        <ServiceStagePage
                            canSave
                            isStatusDisabled
                            prevPath={props.prevPath}
                            isLoading={props.isLoading}
                            serviceId={props.service.id}
                            isDisabled={props.isDisabled}
                            onSetPage={handleSetServiceStage}
                            onShowMessage={props.onShowMessage}
                            onSetIsLoading={props.onSetIsLoading}
                            getInfo={props.service?.id?.length > 0}
                        />
                    </Form>
                </>
            )}
        </>
    )
}