import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import { NavBarPath } from "../bar/navBar";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import InputSelectPerson from "../inputText/inputSelectPerson";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import { Professional } from "../../interfaces/objectInterfaces";
import InputTextArea from "../inputText/inputTextArea";

interface ProfessionalDataFormProps {
    title?: string,
    subtitle?: string,
    index?: number,
    isPrint?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    professional?: Professional,
    prevPath?: NavBarPath[] | any,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
    onSetIsLoading?: (boolean) => void,
}

export default function ProfessionalDataForm(props: ProfessionalDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(true)

    const handleSetTitle = (value) => { handleSet({ ...props.professional, title: value }) }
    const handleSetCreaNumber = (value) => { handleSet({ ...props.professional, creaNumber: value }) }
    const handleSetDescription = (value) => { handleSet({ ...props.professional, description: value }) }
    const handleSetCredentialCode = (value) => { handleSet({ ...props.professional, credentialCode: value }) }
    const handleSetPerson = (value) => { handleSet({ ...props.professional, personId: value.id, person: value }) }

    const handleSet = (value: Professional) => {
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
                <FormRowColumn unit="6">
                    <InputText
                        id="professionalTitle"
                        isLoading={props.isLoading}
                        value={props.professional.title}
                        validation={NOT_NULL_MARK}
                        title="Titulo do profissional"
                        isDisabled={props.isDisabled}
                        onSetText={handleSetTitle}
                        onValidate={handleChangeFormValidation}
                        validationMessage="O titulo do profissional não pode ficar em branco."
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="3">
                    <InputText
                        id="professional-crea-number"
                        title="Número do CREA"
                        isLoading={props.isLoading}
                        value={props.professional.creaNumber}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetCreaNumber}
                        onValidate={handleChangeFormValidation}
                        validationMessage="O numero do crea não pode ficar em branco."
                    />
                </FormRowColumn>

                <FormRowColumn unit="3">
                    <InputText
                        id="credential-Code"
                        isLoading={props.isLoading}
                        title="Codigo credencial"
                        isDisabled={props.isDisabled}
                        onSetText={handleSetCredentialCode}
                        onValidate={handleChangeFormValidation}
                        value={props.professional.credentialCode}
                        validationMessage="O codigo credencial não pode ficar em branco."
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputSelectPerson
                        title="Pessoa"
                        onBlur={props.onBlur}
                        onSet={handleSetPerson}
                        prevPath={props.prevPath}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onShowMessage={props.onShowMessage}
                        onSetLoading={props.onSetIsLoading}
                        value={props.professional?.person?.name}
                        id={"professional-person" + (props.index ? "-" + props.index : "")}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputTextArea
                        title="Descrição"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        id="professional-description"
                        isDisabled={props.isDisabled}
                        onSetText={handleSetDescription}
                        value={props.professional.description}
                    />
                </FormRowColumn>
            </FormRow>
        </Form>
    )
}
