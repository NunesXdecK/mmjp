import Form from "./form";
import FormRow from "./formRow";
import Button from "../button/button";
import AddressForm from "./addressForm";
import { useEffect, useState } from "react";
import FormRowColumn from "./formRowColumn";
import ArrayTextForm from "./arrayTextForm";
import WindowModal from "../modal/windowModal";
import InputText from "../inputText/inputText";
import InputCheckbox from "../inputText/inputCheckbox";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleCompanyValidationForDB } from "../../util/validationUtil";
import { defaultCompany, Company } from "../../interfaces/objectInterfaces";
import { CNPJ_MARK, NOT_NULL_MARK, TELEPHONE_MARK } from "../../util/patternValidationUtil";
import { defaultElementFromBase, ElementFromBase, handlePrepareCompanyForDB } from "../../util/converterUtil";
import SelectPersonForm from "../select/selectPersonForm";
import ActionButtonsForm from "./actionButtonsForm";

interface CompanyFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canMultiple?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    company?: Company,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function CompanyForm(props: CompanyFormProps) {
    const [companyOriginal, setCompanyOriginal] = useState<Company>(props?.company ?? defaultCompany)
    const [company, setCompany] = useState<Company>(props?.company ?? defaultCompany)
    const [isFormValid, setIsFormValid] = useState(handleCompanyValidationForDB(company).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.company?.oldData ?? defaultElementFromBase)

    const handleSetCompanyName = (value) => { setCompany({ ...company, name: value }) }
    const handleSetCompanyCnpj = (value) => { setCompany({ ...company, cnpj: value }) }
    const handleSetCompanyOwners = (value) => { setCompany({ ...company, owners: value }) }
    const handleSetCompanyAddress = (value) => { setCompany({ ...company, address: value }) }
    const handleSetCompanyClientCode = (value) => { setCompany({ ...company, clientCode: value }) }
    const handleSetCompanyTelephones = (value) => { setCompany({ ...company, telephones: value }) }

    const handleDiference = (): boolean => {
        let hasDiference = false
        Object.keys(companyOriginal)?.map((element, index) => {
            if (company[element] !== companyOriginal[element]) {
                hasDiference = true
            }
        })
        return hasDiference
    }

    const handleOnBack = () => {
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleSave = async () => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }
        let companyForDB = { ...company }
        const isValid = handleCompanyValidationForDB(companyForDB)
        if (isValid.validation) {
            companyForDB = handlePrepareCompanyForDB(companyForDB)
            let nowID = companyForDB?.id ?? ""
            const isSave = nowID === ""
            let res = { status: "ERROR", id: nowID, message: "" }
            if (isSave) {
                feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
            } else {
                feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
            }
            try {
                res = await fetch("api/company", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", data: companyForDB }),
                }).then((res) => res.json())
            } catch (e) {
                if (isSave) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                } else {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em Atualizadar!"], messageType: "ERROR" }
                }
                console.error("Error adding document: ", e)
            }
            if (res.status === "SUCCESS") {
                setCompany({ ...company, id: res.id })
                companyForDB = { ...companyForDB, id: res.id }

                if (isMultiple) {
                    setCompany(defaultCompany)
                }

                if (!isMultiple && props.onAfterSave) {
                    props.onAfterSave(feedbackMessage, companyForDB)
                }
            } else {
                feedbackMessage = { ...feedbackMessage, messages: ["Erro!"], messageType: "ERROR" }
            }

            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        } else {
            feedbackMessage = { ...feedbackMessage, messages: isValid.messages, messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
        setIsLoading(false)
    }

    return (
        <>
            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>

                <ActionButtonsForm
                    isLeftOn
                    isForBackControl
                    isDisabled={!isFormValid}
                    rightWindowText="Deseja confirmar as alterações?"
                    isForOpenLeft={company.id !== "" && handleDiference()}
                    isForOpenRight={company.id !== "" && handleDiference()}
                    rightButtonText={company.id === "" ? "Salvar" : "Editar"}
                    leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                    onLeftClick={(event) => {
                        if (event) {
                            event.preventDefault()
                        }
                        handleOnBack()
                    }}
                    onRightClick={(event) => {
                        if (event) {
                            event.preventDefault()
                        }
                        handleSave()
                    }}
                />

                <Form
                    title={props.title}
                    subtitle={props.subtitle}>
                    {props.canMultiple && (
                        <FormRow>
                            <FormRowColumn unit="6">
                                <InputCheckbox
                                    id="multiple"
                                    value={isMultiple}
                                    isLoading={isLoading}
                                    onSetText={setIsMultiple}
                                    title="Cadastro multiplo?"
                                    isDisabled={props.isForDisable}
                                />
                            </FormRowColumn>
                        </FormRow>
                    )}

                    <FormRow>
                        <FormRowColumn unit="4">
                            <InputText
                                id="companyname"
                                value={company.name}
                                isLoading={isLoading}
                                title="Nome da empresa"
                                validation={NOT_NULL_MARK}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetCompanyName}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O nome da empresa não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                id="code"
                                isLoading={isLoading}
                                title="Codigo do cliente"
                                value={company.clientCode}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetCompanyClientCode}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="cnpj"
                                mask="cnpj"
                                title="CNPJ"
                                maxLength={18}
                                value={company.cnpj}
                                isLoading={isLoading}
                                validation={CNPJ_MARK}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetCompanyCnpj}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O CPNPJ não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>
                </Form>
            </form>

            <ArrayTextForm
                id="telephone"
                mask="telephone"
                title="Telefones"
                isLoading={isLoading}
                inputTitle="Telephone"
                texts={company.telephones}
                validation={TELEPHONE_MARK}
                onSetTexts={handleSetCompanyTelephones}
                subtitle="Informações sobre os contatos"
                validationMessage="Faltam números no telefone"
            />

            <SelectPersonForm
                title="Proprietários"
                isLoading={isLoading}
                isMultipleSelect={true}
                persons={company.owners}
                formClassName="p-1 m-3"
                onSetLoading={setIsLoading}
                onShowMessage={props.onShowMessage}
                buttonTitle="Adicionar proprietário"
                subtitle="Selecione os proprietários"
                onSetPersons={handleSetCompanyOwners}
                validationMessage="Esta pessoa já é um proprietário"
            />

            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>

                <AddressForm
                    title="Endereço"
                    isLoading={isLoading}
                    address={company.address}
                    setAddress={handleSetCompanyAddress}
                    subtitle="Informações sobre o endereço"
                />

                <ActionButtonsForm
                    isLeftOn
                    isDisabled={!isFormValid}
                    rightWindowText="Deseja confirmar as alterações?"
                    isForOpenLeft={company.id !== "" && handleDiference()}
                    isForOpenRight={company.id !== "" && handleDiference()}
                    rightButtonText={company.id === "" ? "Salvar" : "Editar"}
                    leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                    onLeftClick={(event) => {
                        if (event) {
                            event.preventDefault()
                        }
                        handleOnBack()
                    }}
                    onRightClick={(event) => {
                        if (event) {
                            event.preventDefault()
                        }
                        handleSave()
                    }}
                />
            </form>
        </>
    )
}