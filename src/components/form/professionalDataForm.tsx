import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import AddressForm from "./addressForm";
import ArrayTextForm from "./arrayTextForm";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import InputClientCode from "../inputText/inputClientCode";
import { Professional } from "../../interfaces/objectInterfaces";
import InputSelectPerson from "../inputText/inputSelectPerson";
import { CNPJ_MARK, NOT_NULL_MARK, TELEPHONE_MARK, TEXT_NOT_NULL_MARK } from "../../util/patternValidationUtil";

interface ProfessionalDataFormProps {
    title?: string,
    subtitle?: string,
    index?: number,
    isPrint?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    professional?: Professional,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
}

export default function ProfessionalDataForm(props: ProfessionalDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(true)

    const handleSetTitle = (value) => { handleSet({ ...props.professional, title: value }) }
    const handleSetPerson = (value) => { handleSet({ ...props.professional, person: value }) }
    const handleSetCreaNumber = (value) => { handleSet({ ...props.professional, creaNumber: value }) }
    const handleSetCredentialCode = (value) => { handleSet({ ...props.professional, credentialCode: value }) }

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
                        value={props.professional.credentialCode}
                        onSetText={handleSetCredentialCode}
                        onValidate={handleChangeFormValidation}
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
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.professional?.person?.name}
                        id={"professional-person" + (props.index ? "-" + props.index : "")}
                    />
                </FormRowColumn>
            </FormRow>
        </Form>
    )
}
