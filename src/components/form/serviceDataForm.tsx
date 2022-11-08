import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import InputTextArea from "../inputText/inputTextArea";
import { Service } from "../../interfaces/objectInterfaces";
import InputTextCurrency from "../inputText/inputTextCurrency";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import InputSelectProfessional from "../inputText/inputSelectProfessional";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { handleMountNumberCurrency, handleValueStringToFloat } from "../../util/maskUtil";
import SelectImmobileFormNew from "../select/selectImmobileFormNew";

interface ServiceDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    service?: Service,
    onBlur?: (any) => void,
    onDelete?: (number) => void,
    onFinishAdd?: (any?) => void,
    onSet?: (any, number?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceDataForm(props: ServiceDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(false)

    const handleSetTitle = (value) => { handleSet({ ...props.service, title: value }) }
    const handleSetDate = (value) => { handleSet({ ...props.service, dateString: value }) }
    const handleSetDescription = (value) => { handleSet({ ...props.service, description: value }) }
    const handleSetProfessional = (value) => { handleSet({ ...props.service, professional: value }) }
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
            <FormRow>
                <FormRowColumn unit="1">
                    <InputText
                        title="Status"
                        isDisabled={true}
                        id="status-service"
                        value={props.service.status}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="4">
                    <InputTextAutoComplete
                        title="Titulo"
                        onBlur={props.onBlur}
                        validation={NOT_NULL_MARK}
                        value={props.service.title}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetTitle}
                        validationMessage="Titulo em branco."
                        onValidate={handleChangeFormValidation}
                        id={"title-service-" + (props.index ?? 0) + "-" + props.id}
                        sugestions={["Ambiental", "Desmembramento", "Georeferenciamento", "União", "Licenciamento"]}
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        mask="date"
                        title="Prazo"
                        maxLength={10}
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.service.dateString}
                        onSetText={handleSetDate}
                        onValidate={handleChangeFormValidation}
                        id={"date-due-service-" + props.index + "-" + props.id}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="2">
                    <InputTextCurrency
                        title="Valor"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        value={props.service.value}
                        isDisabled={props.isDisabled}
                        onSet={handleSetValue}
                        onValidate={handleChangeFormValidation}
                        id={"value-service-" + (props.index ?? 0) + "-" + props.id}
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        title="Quantidade"
                        onBlur={props.onBlur}
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetQuantity}
                        value={props.service.quantity}
                        onValidate={handleChangeFormValidation}
                        id={"quantity-service-" + (props.index ?? 0) + "-" + props.id}
                    />
                </FormRowColumn>
                <FormRowColumn unit="2" className="flex flex-col sm:flex-row">
                    <InputTextCurrency
                        isDisabled
                        title="Total"
                        isLoading={props.isLoading}
                        value={props.service.total}
                        id={"total-service-" + (props.index ?? 0) + "-" + props.id}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputSelectProfessional
                        title="Profissional"
                        onBlur={props.onBlur}
                        onSet={handleSetProfessional}
                        isLoading={props.isLoading}
                        value={props.service?.professional?.title}
                        id={"budget-professional" + (props.index ? "-" + props.index : "")}
                        isDisabled={
                            props.isDisabled ||
                            (props.service?.status === "FINALIZADO" || props.service?.status === "ARQUIVADO")
                        }
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
                        id={"description-service-" + props.index + "-" + props.id}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6">
                    <SelectImmobileFormNew
                        title="Imóvel alvo"
                        onSet={handleSetImmobileTarget}
                        subtitle="Selecione o imóvel alvo"
                        value={props.service.immobilesTarget}
                        id={"immobile-target-service-" + props.index + "-" + props.id}
                        excludeList={[...props.service.immobilesTarget, ...props.service.immobilesOrigin]}
                    />
                </FormRowColumn>
            </FormRow>
            {props.service?.immobilesTarget?.length > 0 && (
                <FormRow>
                    <FormRowColumn unit="6">
                        <SelectImmobileFormNew
                            title="Imóvel de origem"
                            onSet={handleSetImmobileOrigin}
                            subtitle="Selecione o imóvel de origem"
                            value={props.service.immobilesOrigin}
                            id={"immobile-origin-service-" + props.index + "-" + props.id}
                            excludeList={[...props.service.immobilesTarget, ...props.service.immobilesOrigin]}
                        />
                    </FormRowColumn>
                </FormRow>
            )}
        </>
    )
}