import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import AddressForm from "./addressForm";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { handleNewDateToUTC } from "../../util/dateUtils";
import SelectPersonCompanyForm from "./selectPersonCompanyForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { CompanyConversor, PersonConversor, ImmobileConversor } from "../../db/converters";
import { handleImmobileValidationForDB } from "../../util/validationUtil";
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { COMPANY_COLLECTION_NAME, db, PERSON_COLLECTION_NAME, IMMOBILE_COLLECTION_NAME } from "../../db/firebaseDB";
import { defaultElementFromBase, ElementFromBase, handlePrepareImmobileForDB } from "../../util/converterUtil";
import InputCheckbox from "../inputText/inputCheckbox";

interface ImmobileFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canMultiple?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    immobile?: Immobile,
    onBack?: (object) => void,
    onAfterSave?: (object, any?) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ImmobileForm(props: ImmobileFormProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)
    const immobileCollection = collection(db, IMMOBILE_COLLECTION_NAME).withConverter(ImmobileConversor)

    const [immobile, setImmobile] = useState<Immobile>(props?.immobile ?? defaultImmobile)
    const [isFormValid, setIsFormValid] = useState(handleImmobileValidationForDB(immobile).validation)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.immobile?.oldData ?? defaultElementFromBase)

    const handleSetImmobileName = (value) => { setImmobile({ ...immobile, name: value }) }
    const handleSetImmobileLand = (value) => { setImmobile({ ...immobile, land: value }) }
    const handleSetImmobileArea = (value) => { setImmobile({ ...immobile, area: value }) }
    const handleSetImmobileCounty = (value) => { setImmobile({ ...immobile, county: value }) }
    const handleSetImmobileOwners = (value) => { setImmobile({ ...immobile, owners: value }) }
    const handleSetImmobilePerimeter = (value) => { setImmobile({ ...immobile, perimeter: value }) }
    const handleSetImmobileAddress = (value) => { setImmobile({ ...immobile, address: value }) }

    const handleListItemClick = async (immobile: Immobile) => {
        setIsLoading(true)
        if (props.onSelectPerson) {
            props.onSelectPerson(immobile)
        }
        setImmobile(immobile)
        setIsOpen(false)
        setIsFormValid(true)
        setIsLoading(false)
    }

    const handleSave = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }

        let immobileForDB = { ...immobile }
        const isValid = handleImmobileValidationForDB(immobileForDB)
        if (isValid.validation) {
            let nowID = immobileForDB?.id ?? ""
            let docRefsForDB = []

            if (immobileForDB.owners?.length > 0) {
                immobileForDB.owners?.map((element, index) => {
                    if (element.id) {
                        let docRef = {}
                        if ("cpf" in element) {
                            docRef = doc(personCollection, element.id)
                        } else if ("cnpj" in element) {
                            docRef = doc(companyCollection, element.id)
                        }
                        docRefsForDB = [...docRefsForDB, docRef]
                    }
                })
                immobileForDB = { ...immobileForDB, owners: docRefsForDB }
            }

            immobileForDB = handlePrepareImmobileForDB(immobileForDB)

            const isSave = nowID === ""
            if (isSave) {
                try {
                    const docRef = await addDoc(immobileCollection, immobileForDB)
                    setImmobile({ ...immobile, id: docRef.id })
                    immobileForDB = { ...immobileForDB, id: docRef.id }
                    feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
                    handleListItemClick(defaultImmobile)
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                    console.error("Error adding document: ", e)
                }
            } else {
                try {
                    immobileForDB = { ...immobileForDB, dateLastUpdateUTC: handleNewDateToUTC() }
                    const docRef = doc(immobileCollection, nowID)
                    await updateDoc(docRef, immobileForDB)
                    feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
                    handleListItemClick(defaultImmobile)
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em atualizar!"], messageType: "ERROR" }
                    console.error("Error upddating document: ", e)
                }
            }
            if (isMultiple) {
                setImmobile(defaultImmobile)
                if (props.onShowMessage) {
                    props.onShowMessage(feedbackMessage)
                }
            }

            if (!isMultiple && props.onAfterSave) {
                props.onAfterSave(feedbackMessage, immobileForDB)
            }
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
                        <FormRowColumn unit="6">
                            <InputText
                                id="immobilename"
                                value={immobile.name}
                                isLoading={isLoading}
                                validation={NOT_NULL_MARK}
                                title="Nome do imóvel"
                                isDisabled={props.isForDisable}
                                onSetText={handleSetImmobileName}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O nome do imóvel não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="land"
                                title="Gleba"
                                value={immobile.land}
                                isLoading={isLoading}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetImmobileLand}
                                onValidate={handleChangeFormValidation}
                                validationMessage="A gleba não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="county"
                                title="Município/UF"
                                isLoading={isLoading}
                                value={immobile.county}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetImmobileCounty}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O município não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="area"
                                mask="area"
                                title="Área"
                                isLoading={isLoading}
                                validation={NUMBER_MARK}
                                value={immobile.area}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetImmobileArea}
                                onValidate={handleChangeFormValidation}
                                validationMessage="A área não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="perimeter"
                                mask="perimeter"
                                title="Perímetro"
                                isLoading={isLoading}
                                validation={NUMBER_MARK}
                                value={immobile.perimeter}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetImmobilePerimeter}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O perímetro não pode ficar em branco."
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

            <SelectPersonCompanyForm
                title="Proprietários"
                isLoading={isLoading}
                isMultipleSelect={true}
                persons={immobile.owners}
                onShowMessage={props.onShowMessage}
                buttonTitle="Adicionar proprietário"
                subtitle="Selecione os proprietários"
                onSetPersons={handleSetImmobileOwners}
                validationMessage="Esta pessoa, ou empresa já é um proprietário"
            />

            <form
                onSubmit={handleSave}>
                <AddressForm
                    title="Endereço"
                    isLoading={isLoading}
                    address={immobile.address}
                    setAddress={handleSetImmobileAddress}
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