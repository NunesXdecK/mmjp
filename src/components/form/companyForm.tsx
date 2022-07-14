import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import AddressForm from "./addressForm";
import FormRowColumn from "./formRowColumn";
import ArrayTextForm from "./arrayTextForm";
import InputText from "../inputText/inputText";
import SelectPersonForm from "./selectPersonForm";
import { handleNewDateToUTC } from "../../util/dateUtils";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { PersonConversor, CompanyConversor } from "../../db/converters";
import { handleCompanyValidationForDB } from "../../util/validationUtil";
import { defaultCompany, Company } from "../../interfaces/objectInterfaces";
import { COMPANY_COLLECTION_NAME, db, PERSON_COLLECTION_NAME } from "../../db/firebaseDB";
import { CNPJ_MARK, NOT_NULL_MARK, TELEPHONE_MARK } from "../../util/patternValidationUtil";
import { defaultElementFromBase, ElementFromBase, handlePrepareCompanyForDB } from "../../util/converterUtil";
import InputCheckbox from "../inputText/inputCheckbox";

interface CompanyFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canMultiple?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    company?: Company,
    onBack?: (object) => void,
    onAfterSave?: (object, any?) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function CompanyForm(props: CompanyFormProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)

    const [company, setCompany] = useState<Company>(props?.company ?? defaultCompany)
    const [isFormValid, setIsFormValid] = useState(handleCompanyValidationForDB(company).validation)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.company?.oldData ?? defaultElementFromBase)

    const handleSetCompanyName = (value) => { setCompany({ ...company, name: value }) }
    const handleSetCompanyCnpj = (value) => { setCompany({ ...company, cnpj: value }) }
    const handleSetCompanyClientCode = (value) => { setCompany({ ...company, clientCode: value }) }
    const handleSetCompanyTelephones = (value) => { setCompany({ ...company, telephones: value }) }
    const handleSetCompanyOwners = (value) => { setCompany({ ...company, owners: value }) }
    const handleSetCompanyAddress = (value) => { setCompany({ ...company, address: value }) }

    const handleListItemClick = async (company: Company) => {
        setIsLoading(true)
        if (props.onSelectPerson) {
            props.onSelectPerson(company)
        }
        setCompany(company)
        setIsOpen(false)
        setIsFormValid(true)
        setIsLoading(false)
    }

    const handleSave = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }

        let companyForDB = { ...company }
        const isValid = handleCompanyValidationForDB(companyForDB)

        if (isValid.validation) {
            let nowID = companyForDB?.id ?? ""
            let docRefsForDB = []

            if (companyForDB.owners?.length > 0) {
                companyForDB.owners?.map((element, index) => {
                    if (element.id) {
                        const docRef = doc(personCollection, element.id)
                        docRefsForDB = [...docRefsForDB, docRef]
                    }
                })
                companyForDB = { ...companyForDB, owners: docRefsForDB }
            }

            companyForDB = handlePrepareCompanyForDB(companyForDB)
            const isSave = nowID === ""
            if (isSave) {
                try {
                    const docRef = await addDoc(companyCollection, companyForDB)
                    setCompany({ ...company, id: docRef.id })
                    companyForDB = { ...companyForDB, id: docRef.id }
                    feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                    console.error("Error adding document: ", e)
                }
            } else {
                try {
                    companyForDB = { ...companyForDB, dateLastUpdateUTC: handleNewDateToUTC() }
                    const docRef = doc(companyCollection, nowID)
                    await updateDoc(docRef, companyForDB)
                    feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em atualizar!"], messageType: "ERROR" }
                    console.error("Error upddating document: ", e)
                }
            }

            if (isMultiple) {
                setCompany(defaultCompany)
                if (props.onShowMessage) {
                    props.onShowMessage(feedbackMessage)
                }
            }

            if (!isMultiple && props.onAfterSave) {
                props.onAfterSave(feedbackMessage, companyForDB)
            }
            {/*
            handleListItemClick(defaultCompany)
        */}
        } else {
            feedbackMessage = { ...feedbackMessage, messages: isValid.messages, messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
        setIsLoading(false)
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    return (
        <>
            <form
                onSubmit={handleSave}>
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
                                validation={NOT_NULL_MARK}
                                title="Nome da empresa"
                                isDisabled={props.isForDisable}
                                onSetText={handleSetCompanyName}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O nome da empresa não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                id="code"
                                title="Codigo do cliente"
                                value={company.clientCode}
                                isLoading={isLoading}
                                onSetText={handleSetCompanyClientCode}
                                isDisabled={props.isForDisable}
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

                    <div className="hidden">
                        <Button
                            type="submit">
                        </Button>
                    </div>
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
                onShowMessage={props.onShowMessage}
                buttonTitle="Adicionar proprietário"
                subtitle="Selecione os proprietários"
                onSetPersons={handleSetCompanyOwners}
                validationMessage="Esta pessoa já é um proprietário"
            />

            <form
                onSubmit={handleSave}>
                <AddressForm
                    title="Endereço"
                    isLoading={isLoading}
                    address={company.address}
                    setAddress={handleSetCompanyAddress}
                    subtitle="Informações sobre o endereço"
                />

                <FormRow className="p-2">
                    <FormRowColumn unit="6" className="flex justify-between">
                        {props.isBack && (
                            <Button
                                onClick={props.onBack}
                                isLoading={isLoading}
                                isDisabled={isLoading}
                            >
                                Voltar
                            </Button>
                        )}

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            isDisabled={!isFormValid}
                        >
                            Salvar
                        </Button>
                    </FormRowColumn>
                </FormRow>
            </form>
        </>
    )
}