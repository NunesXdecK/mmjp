import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import AddressForm from "./addressForm";
import { NavBarPath } from "../bar/navBar";
import TelephoneForm from "./telephoneForm";
import FormRowColumn from "./formRowColumn";
import InputCNPJ from "../inputText/inputCNPJ";
import InputText from "../inputText/inputText";
import InputTextArea from "../inputText/inputTextArea";
import InputClientCode from "../inputText/inputClientCode";
import { Company } from "../../interfaces/objectInterfaces";
import InputSelectPerson from "../inputText/inputSelectPerson";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";

interface CompanyDataFormProps {
    title?: string,
    subtitle?: string,
    index?: number,
    isPrint?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    company?: Company,
    prevPath?: NavBarPath[] | any,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
    onSetIsLoading?: (boolean) => void,
}

export default function CompanyDataForm(props: CompanyDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(true)

    const handleSetName = (value) => { handleSet({ ...props.company, name: value }) }
    const handleSetCnpj = (value) => { handleSet({ ...props.company, cnpj: value }) }
    const handleSetAddress = (value) => { handleSet({ ...props.company, address: value }) }
    const handleSetTelephones = (value) => { handleSet({ ...props.company, telephones: value }) }
    const handleSetDescription = (value) => { handleSet({ ...props.company, description: value }) }
    const handleSetOwners = (value) => { handleSet({ ...props.company, owners: [value], personId: value?.id }) }
    const handleSetClientCode = (value) => {
        let val = 0
        if (parseInt(value)) {
            val = parseInt(value)
        }
        handleSet({ ...props.company, clientCode: val })
    }

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
                    <FormRowColumn unit="4" unitM="6">
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
                    <FormRowColumn unit="2" unitM="6">
                        <InputClientCode
                            id="company-client-code"
                            title="Codigo de cliente"
                            isLoading={props.isLoading}
                            onSet={handleSetClientCode}
                            elementId={props.company.id}
                            isDisabled={props.isDisabled}
                            value={props.company.clientCode?.toString()}
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="3" unitM="6">
                        <InputCNPJ
                            id="company-cnpj"
                            onSet={handleSetCnpj}
                            value={props.company.cnpj}
                            isLoading={props.isLoading}
                            elementId={props.company.id}
                            isDisabled={props.isDisabled}
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="6" className="">
                        <InputSelectPerson
                            title="Responsável"
                            onBlur={props.onBlur}
                            onSet={handleSetOwners}
                            prevPath={props.prevPath}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onSetLoading={props.onSetIsLoading}
                            onShowMessage={props.onShowMessage}
                            value={props.company?.owners[0]?.name}
                            id={"company-responsible" + (props.index ? "-" + props.index : "")}
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="6" className="">
                        <InputTextArea
                            title="Descrição"
                            onBlur={props.onBlur}
                            id="company-description"
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onSetText={handleSetDescription}
                            value={props.company.description}
                        />
                    </FormRowColumn>
                </FormRow>
            </Form>
            <TelephoneForm
                title="Contatos"
                id="company-telephone"
                isLoading={props.isLoading}
                companyId={props.company.id}
                isDisabled={props.isDisabled}
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
