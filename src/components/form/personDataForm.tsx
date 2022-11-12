import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { Person } from "../../interfaces/objectInterfaces";
import { CPF_MARK, NOT_NULL_MARK, TELEPHONE_MARK, TEXT_NOT_NULL_MARK } from "../../util/patternValidationUtil";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import InputSelectPersonCompany from "../inputText/inputSelectPersonCompany";
import InputClientCode from "../inputText/inputClientCode";
import ArrayTextForm from "./arrayTextForm";
import AddressForm from "./addressForm";
import InputSelect from "../inputText/inputSelect";

interface PersonDataFormProps {
    title?: string,
    subtitle?: string,
    index?: number,
    isPrint?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    person?: Person,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
}

export default function PersonDataForm(props: PersonDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(true)

    const handleSetRG = (value) => { handleSet({ ...props.person, rg: value }) }
    const handleSetCPF = (value) => { handleSet({ ...props.person, cpf: value }) }
    const handleSetName = (value) => { handleSet({ ...props.person, name: value }) }
    const handleSetAddress = (value) => { handleSet({ ...props.person, address: value }) }
    const handleSetRgIssuer = (value) => { handleSet({ ...props.person, rgIssuer: value }) }
    const handleSetTelephones = (value) => { handleSet({ ...props.person, telephones: value }) }
    const handleSetProfession = (value) => { handleSet({ ...props.person, profession: value }) }
    const handleSetClientCode = (value) => { handleSet({ ...props.person, clientCode: value }) }
    const handleSetNaturalness = (value) => { handleSet({ ...props.person, naturalness: value }) }
    const handleSetNationality = (value) => { handleSet({ ...props.person, nationality: value }) }
    const handleSetMaritalStatus = (value) => { handleSet({ ...props.person, maritalStatus: value }) }

    const handleSet = (value: Person) => {
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
            <Form
                title={props.title ?? "Dados básicos"}
                subtitle={props.subtitle ?? "Informe os dados básicos"}
            >
                <FormRow>
                    <FormRowColumn unit="4">
                        <InputText
                            id="person-fullname"
                            title="Nome completo"
                            value={props.person.name}
                            onSetText={handleSetName}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            validation={TEXT_NOT_NULL_MARK}
                            onValidate={handleChangeFormValidation}
                            validationMessage="O nome não pode ficar em branco."
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="2">
                        <InputClientCode
                            id="person-client-code"
                            title="Codigo de cliente"
                            elementId={props.person.id}
                            isLoading={props.isLoading}
                            onSet={handleSetClientCode}
                            isDisabled={props.isDisabled}
                            value={props.person.clientCode}
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="3">
                        <InputText
                            mask="cpf"
                            title="CPF"
                            maxLength={14}
                            id="person-cpf"
                            validation={CPF_MARK}
                            onSetText={handleSetCPF}
                            value={props.person.cpf}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            validationMessage="O CPF está invalido"
                            onValidate={handleChangeFormValidation}
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="3">
                        <InputText
                            title="RG"
                            id="person-rg"
                            validation="number"
                            onSetText={handleSetRG}
                            value={props.person.rg}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                        />
                    </FormRowColumn>

                    <FormRowColumn unit="3">
                        <InputText
                            title="Emissor RG"
                            id="person-rg-issuer"
                            isLoading={props.isLoading}
                            value={props.person.rgIssuer}
                            isDisabled={props.isDisabled}
                            onSetText={handleSetRgIssuer}
                        />
                    </FormRowColumn>
                </FormRow>

                <FormRow>
                    <FormRowColumn unit="3">
                        <InputText
                            title="Naturalidade"
                            id="person-naturalness"
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            value={props.person.naturalness}
                            onSetText={handleSetNaturalness}
                        />
                    </FormRowColumn>

                    <FormRowColumn unit="3">
                        <InputText
                            title="Nacionalidade"
                            id="person-nationality"
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            value={props.person.nationality}
                            onSetText={handleSetNationality}
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="3">
                        <InputSelect
                            title="Estado Civil"
                            id="person-martial-status"
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            value={props.person.maritalStatus}
                            onSetText={handleSetMaritalStatus}
                            options={["casado", "divorciado", "separado", "solteiro", "viuvo"]}
                        />
                    </FormRowColumn>

                    <FormRowColumn unit="3">
                        <InputText
                            title="Profissão"
                            id="person-profession"
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            value={props.person.profession}
                            onSetText={handleSetProfession}
                        />
                    </FormRowColumn>
                </FormRow>
            </Form>
            <ArrayTextForm
                maxLength={15}
                mask="telephone"
                title="Telefones"
                id="person-telephone"
                inputTitle="Telephone"
                isLoading={props.isLoading}
                validation={TELEPHONE_MARK}
                texts={props.person.telephones}
                onSetTexts={handleSetTelephones}
                subtitle="Informações sobre os contatos"
                validationMessage="Faltam números no telefone"
            />
            <AddressForm
                title="Endereço"
                isLoading={props.isLoading}
                setAddress={handleSetAddress}
                address={props.person.address}
                subtitle="Informações sobre o endereço"
            />
        </>
    )
}
