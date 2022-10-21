import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import AddressForm from "./addressForm";
import FormRowColumn from "./formRowColumn";
import ArrayTextForm from "./arrayTextForm";
import InputText from "../inputText/inputText";
import ActionButtonsForm from "./actionButtonsForm";
import InputCheckbox from "../inputText/inputCheckbox";
import SelectPersonForm from "../select/selectPersonForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import ScrollDownTransition from "../animation/scrollDownTransition";
import FeedbackMessageSaveText from "../modal/feedbackMessageSavingText";
import { defaultCompany, Company } from "../../interfaces/objectInterfaces";
import { handleCompanyValidationForDB, handleIsEqual } from "../../util/validationUtil";
import { CNPJ_MARK, NOT_NULL_MARK, TELEPHONE_MARK } from "../../util/patternValidationUtil";
import { defaultElementFromBase, ElementFromBase, handlePrepareCompanyForDB } from "../../util/converterUtil";

interface CompanyFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canAutoSave?: boolean,
    canMultiple?: boolean,
    isForSelect?: boolean,
    isDisabled?: boolean,
    isForOldRegister?: boolean,
    company?: Company,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function CompanyForm(props: CompanyFormProps) {
    const [companyID, setCompanyID] = useState(props?.company?.id?.length ? props?.company?.id : "")
    const [originalClientCode, setOriginalClientCode] = useState(props?.company?.clientCode ?? "")
    const [company, setCompany] = useState<Company>(props?.company ?? defaultCompany)
    const [companyOriginal, setCompanyOriginal] = useState<Company>(props?.company ?? defaultCompany)
    const [isFormValid, setIsFormValid] = useState(handleCompanyValidationForDB(company).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)
    const [isAutoSaving, setIsAutoSaving] = useState(false)
    const [isClientCodeInvalid, setIsClientCodeInvalid] = useState(false)
    const [isCheckingClientCode, setIsCheckingClientCode] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.company?.oldData ?? defaultElementFromBase)

    const handleSetCompanyName = (value) => { setCompany({ ...company, name: value }) }
    const handleSetCompanyCnpj = (value) => { setCompany({ ...company, cnpj: value }) }
    const handleSetCompanyOwners = (value) => { setCompany({ ...company, owners: value }) }
    const handleSetCompanyAddress = (value) => { setCompany({ ...company, address: value }) }
    const handleSetCompanyTelephones = (value) => { setCompany({ ...company, telephones: value }) }
    const handleSetCompanyClientCode = (value) => {
        setCompany({ ...company, clientCode: value })
    }

    const handleOnBack = () => {
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleDiference = (): boolean => {
        return !handleIsEqual(company, companyOriginal)
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleValidClientCode = async (event, show?) => {
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        let code = company.clientCode
        if (code?.length && originalClientCode !== code) {
            if (!show) {
                setIsCheckingClientCode(true)
            }
            let res = await fetch("api/isClientCodeAvaliable/" + code).then(res => res.json())
            if (!show) {
                setIsCheckingClientCode(false)
            }
            setIsClientCodeInvalid(res.data)
            return res.data
        } else {
            setIsClientCodeInvalid(false)
            return false
        }
    }

    const handleCompanyValidationForDBInner = (company, isSearching) => {
        let isValid = handleCompanyValidationForDB(company)
        if (company.clientCode.length > 0 && company.clientCode !== originalClientCode) {
            if (isSearching) {
                isValid = {
                    ...isValid,
                    validation: false,
                    messages: [...isValid.messages, "O codigo do cliente já está em uso."]
                }
            }
        }
        return isValid
    }

    const handlePrepareCompanyForDBInner = (company) => {
        let companyForDB = { ...company }
        if (!companyForDB?.id?.length && companyID?.length) {
            companyForDB = { ...companyForDB, id: companyID }
        }
        companyForDB = handlePrepareCompanyForDB(companyForDB)
        return companyForDB
    }

    const handleAutoSave = async (event?) => {
        if (!props.canAutoSave) {
            return
        }
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (isAutoSaving || isCheckingClientCode || isClientCodeInvalid) {
            return
        }
        if (!handleDiference()) {
            return
        }
        const isValid = handleCompanyValidationForDBInner(company, isCheckingClientCode || isClientCodeInvalid)
        if (!isValid.validation) {
            return
        }
        setIsAutoSaving(old => true)
        const res = await handleSaveInner(company, false)
        if (res.status === "ERROR") {
            return
        }
        setIsAutoSaving(old => false)
        setCompanyID(res.id)
        setCompanyOriginal(old => res.company)
    }

    const handleSaveInner = async (company, history) => {
        let res = { status: "ERROR", id: "", company: company }
        let companyForDB = handlePrepareCompanyForDBInner(company)
        try {
            const saveRes = await fetch("api/company", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: companyForDB, history: history }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, company: { ...company, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async () => {
        if (isAutoSaving) {
            return
        }
        setIsLoading(true)
        let resCC = await handleValidClientCode(null, true)
        const isValid = handleCompanyValidationForDBInner(company, resCC)
        if (!isValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            setIsLoading(false)
            return
        }
        let companyFromDB = { ...company }
        let res = await handleSaveInner(company, true)
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            setIsLoading(false)
            return
        }
        setCompany({ ...company, id: res.id })
        setCompanyOriginal({ ...company, id: res.id })
        setOriginalClientCode(company.clientCode)
        companyFromDB = { ...res.company }
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (isMultiple) {
            setCompany(defaultCompany)
            setCompanyOriginal(defaultCompany)
            setCompanyID("")
            setOriginalClientCode("")
        }
        if (!isMultiple && props.onAfterSave) {
            props.onAfterSave(feedbackMessage, companyFromDB)
        }
        setIsLoading(false)
    }

    const handleActionBar = () => {
        return (
            <ActionButtonsForm
                isLeftOn
                isRightOn
                isForBackControl
                isLoading={isLoading}
                isDisabled={!isFormValid || isAutoSaving}
                rightWindowText="Deseja confirmar as alterações?"
                isForOpenLeft={company.id !== "" && handleDiference()}
                isForOpenRight={company.id !== "" && handleDiference()}
                rightButtonText={"Salvar"}
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
        )
    }

    return (
        <>
            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>

                {handleActionBar()}

                <ScrollDownTransition
                    isOpen={isAutoSaving}>
                    <Form>
                        <FeedbackMessageSaveText
                            isOpen={true}
                        />
                    </Form>
                </ScrollDownTransition>

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
                                    isDisabled={props.isDisabled}
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
                                onBlur={handleAutoSave}
                                validation={NOT_NULL_MARK}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetCompanyName}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O nome da empresa não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                id="code"
                                isLoading={isLoading}
                                onBlur={(event) => {
                                    handleValidClientCode(event)
                                    handleAutoSave(event)
                                }}
                                title="Codigo de cliente"
                                value={company.clientCode}
                                isInvalid={isClientCodeInvalid}
                                isDisabled={props.isDisabled}
                                message="Verificando o codigo..."
                                onSetText={handleSetCompanyClientCode}
                                isForShowMessage={isCheckingClientCode}
                                validationMessage="O código já está em uso."
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
                                onBlur={handleAutoSave}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetCompanyCnpj}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O CPNPJ não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>
                </Form>
            </form>

            <ArrayTextForm
                maxLength={15}
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
                title="Representantes"
                isLoading={isLoading}
                isMultipleSelect={true}
                persons={company.owners}
                formClassName="p-1 m-3"
                onSetLoading={setIsLoading}
                onShowMessage={props.onShowMessage}
                buttonTitle="Adicionar representante"
                subtitle="Selecione os representante"
                onSetPersons={handleSetCompanyOwners}
                validationMessage="Esta pessoa já é um representante"
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
                    onBlur={handleAutoSave}
                    address={company.address}
                    setAddress={handleSetCompanyAddress}
                    subtitle="Informações sobre o endereço"
                />

                {handleActionBar()}
            </form>
        </>
    )
}