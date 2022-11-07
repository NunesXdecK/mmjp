import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import InputTextArea from "../inputText/inputTextArea";
import InputSelectUser from "../inputText/inputSelectUsers";
import { ServiceStage } from "../../interfaces/objectInterfaces";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";

interface ServiceStageDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isPrint?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    serviceStage?: ServiceStage,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
}

export default function ServiceStageDataForm(props: ServiceStageDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(true)

    const handleSetServiceStageTitle = (value) => { handleSet({ ...props.serviceStage, title: value }) }
    const handleSetServiceStageDate = (value) => { handleSet({ ...props.serviceStage, dateString: value }) }
    const handleSetServiceStageDescription = (value) => { handleSet({ ...props.serviceStage, description: value }) }
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
            <FormRow className="py-2">
                <FormRowColumn unit="4" className="flex flex-col sm:flex-row">
                    <InputTextAutoComplete
                        title="Titulo"
                        onBlur={props.onBlur}
                        holderClassName="w-full"
                        validation={NOT_NULL_MARK}
                        isLoading={props.isLoading}
                        value={props.serviceStage.title}
                        sugestions={["Planta", "Memorial"]}
                        onSetText={handleSetServiceStageTitle}
                        onValidate={handleChangeFormValidation}
                        validationMessage="O titulo não pode ficar em branco."
                        id={"service-stage-title" + (props.index ? "-" + props.index : "") + (props.id ? "-" + props.id : "")}
                        isDisabled={
                            props.isDisabled ||
                            (props.serviceStage?.status === "FINALIZADO" || props.serviceStage?.status === "ARQUIVADO")
                        }
                    />
                </FormRowColumn>
                <FormRowColumn unit="2" className="flex flex-col sm:flex-row">
                    <InputText
                        mask="date"
                        maxLength={10}
                        title="Prazo"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        onSetText={handleSetServiceStageDate}
                        onValidate={handleChangeFormValidation}
                        id={"date-due-stages" + (props.index ? "-" + props.index : "") + (props.id ? "-" + props.id : "")}
                        value={props.serviceStage.dateString}
                        isDisabled={
                            props.isDisabled ||
                            (props.serviceStage?.status === "FINALIZADO" || props.serviceStage?.status === "ARQUIVADO")
                        }
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="2">
                    <InputText
                        title="Status"
                        isDisabled={true}
                        id="status-stages"
                        value={props.serviceStage.status}
                    />
                </FormRowColumn>
            </FormRow>

            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputTextArea
                        title="Descrição"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        value={props.serviceStage.description}
                        onSetText={handleSetServiceStageDescription}
                        id={"description-stages" + (props.index ? "-" + props.index : "") + (props.id ? "-" + props.id : "")}
                        isDisabled={
                            props.isDisabled ||
                            (props.serviceStage?.status === "FINALIZADO" || props.serviceStage?.status === "ARQUIVADO")
                        }
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputSelectUser
                        title="Responsável"
                        onBlur={props.onBlur}
                        onSet={handleSetResponsible}
                        isLoading={props.isLoading}
                        value={props.serviceStage?.responsible?.name}
                        id={"budget-responsible" + (props.index ? "-" + props.index : "")}
                        isDisabled={
                            props.isDisabled ||
                            (props.serviceStage?.status === "FINALIZADO" || props.serviceStage?.status === "ARQUIVADO")
                        }
                    />
                </FormRowColumn>
            </FormRow>
        </Form>
    )
}