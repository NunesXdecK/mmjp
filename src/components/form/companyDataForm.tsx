import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import AddressForm from "./addressForm";
import ArrayTextForm from "./arrayTextForm";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import InputClientCode from "../inputText/inputClientCode";
import { Company } from "../../interfaces/objectInterfaces";
import InputSelectPerson from "../inputText/inputSelectPerson";
import { CNPJ_MARK, NOT_NULL_MARK, TELEPHONE_MARK } from "../../util/patternValidationUtil";

interface CompanyDataFormProps {
    title?: string,
    subtitle?: string,
    index?: number,
    isPrint?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    company?: Company,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
}

export default function CompanyDataForm(props: CompanyDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(true)

    const handleSetName = (value) => { handleSet({ ...props.company, name: value }) }
    const handleSetCnpj = (value) => { handleSet({ ...props.company, cnpj: value }) }
    const handleSetOwners = (value) => { handleSet({ ...props.company, owners: [value] }) }
    const handleSetAddress = (value) => { handleSet({ ...props.company, address: value }) }
    const handleSetTelephones = (value) => { handleSet({ ...props.company, telephones: value }) }
    const handleSetClientCode = (value) => { handleSet({ ...props.company, clientCode: value }) }

    const handleSet = (value: Company) => {
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
                            id="company-fullname"
                            title="Nome completo"
                            onSetText={handleSetName}
                            validation={NOT_NULL_MARK}
                            value={props.company.name}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onValidate={handleChangeFormValidation}
                            validationMessage="O nome não pode ficar em branco."
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="2">
                        <InputClientCode
                            id="company-client-code"
                            title="Codigo de cliente"
                            isLoading={props.isLoading}
                            onSet={handleSetClientCode}
                            elementId={props.company.id}
                            isDisabled={props.isDisabled}
                            value={props.company.clientCode}
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="3">
                        <InputText
                            mask="cnpj"
                            title="CNPJ"
                            maxLength={18}
                            id="company-cnpj"
                            validation={CNPJ_MARK}
                            onSetText={handleSetCnpj}
                            value={props.company.cnpj}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onValidate={handleChangeFormValidation}
                            validationMessage="O CPNPJ não pode ficar em branco."
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="6" className="">
                        <InputSelectPerson
                            title="Responsável"
                            onBlur={props.onBlur}
                            onSet={handleSetOwners}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            value={props.company?.owners[0]?.name}
                            id={"company-responsible" + (props.index ? "-" + props.index : "")}
                        />
                    </FormRowColumn>
                </FormRow>
            </Form>
            <ArrayTextForm
                maxLength={15}
                mask="telephone"
                title="Telefones"
                id="company-telephone"
                inputTitle="Telephone"
                isLoading={props.isLoading}
                validation={TELEPHONE_MARK}
                texts={props.company.telephones}
                onSetTexts={handleSetTelephones}
                subtitle="Informações sobre os contatos"
                validationMessage="Faltam números no telefone"
            />
            <AddressForm
                title="Endereço"
                isLoading={props.isLoading}
                setAddress={handleSetAddress}
                address={props.company.address}
                subtitle="Informações sobre o endereço"
            />
        </>
    )
}
