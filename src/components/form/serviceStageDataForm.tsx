import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import InputTextArea from "../inputText/inputTextArea";
import InputSelectUser from "../inputText/inputSelectUser";
import { ServiceStage } from "../../interfaces/objectInterfaces";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { NavBarPath } from "../bar/navBar";
import { handleOnlyDate } from "../../util/dateUtils";

interface ServiceStageDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isPrint?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    serviceStage?: ServiceStage,
    prevPath?: NavBarPath[] | any,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
    onSetIsLoading?: (boolean) => void,
}

export default function ServiceStageDataForm(props: ServiceStageDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(true)

    const handleSetTitle = (value) => { handleSet({ ...props.serviceStage, title: value }) }
    const handleSetDate = (value) => { handleSet({ ...props.serviceStage, dateDue: value }) }
    const handleSetDescription = (value) => { handleSet({ ...props.serviceStage, description: value }) }
    const handleSetResponsible = (value) => { handleSet({ ...props.serviceStage, responsible: value }) }

    const handleSet = (value: ServiceStage) => {
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
        <Form
            title={props.title ?? "Dados básicos"}
            subtitle={props.subtitle ?? "Informe os dados básicos"}
        >
            <FormRow>
                <FormRowColumn unit="1">
                    <InputText
                        title="Status"
                        isDisabled={true}
                        id="status-service-stage"
                        value={props.serviceStage.status}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="4">
                    <InputTextAutoComplete
                        title="Titulo"
                        onBlur={props.onBlur}
                        holderClassName="w-full"
                        validation={NOT_NULL_MARK}
                        onSetText={handleSetTitle}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.serviceStage.title}
                        sugestions={["Planta", "Memorial"]}
                        onValidate={handleChangeFormValidation}
                        validationMessage="O titulo não pode ficar em branco."
                        id={"service-stage-title" + (props.index ? "-" + props.index : "") + (props.id ? "-" + props.id : "")}
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        mask="date"
                        maxLength={10}
                        title="Prazo"
                        onBlur={props.onBlur}
                        onSetText={handleSetDate}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onValidate={handleChangeFormValidation}
                        value={handleOnlyDate(props.serviceStage?.dateDue) ?? ""}
                        id={"date-due-stages" + (props.index ? "-" + props.index : "") + (props.id ? "-" + props.id : "")}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputSelectUser
                        title="Responsável"
                        onBlur={props.onBlur}
                        prevPath={props.prevPath}
                        isLoading={props.isLoading}
                        onSet={handleSetResponsible}
                        isDisabled={props.isDisabled}
                        value={props.serviceStage?.responsible?.username}
                        id={"budget-responsible" + (props.index ? "-" + props.index : "")}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputTextArea
                        title="Descrição"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetDescription}
                        value={props.serviceStage.description}
                        id={"description-stages" + (props.index ? "-" + props.index : "") + (props.id ? "-" + props.id : "")}
                    />
                </FormRowColumn>
            </FormRow>
        </Form>
    )
}
