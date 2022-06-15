import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import SelectPersonForm from "./selectPersonForm";
import { handleNewDateToUTC } from "../../util/dateUtils";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { PersonConversor, ProfessionalConversor } from "../../db/converters";
import { handleProfessionalValidationForDB } from "../../util/validationUtil";
import { defaultElementFromBase, ElementFromBase } from "../../util/converterUtil";
import { defaultProfessional, Professional } from "../../interfaces/objectInterfaces";
import { db, PERSON_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME } from "../../db/firebaseDB";

interface ProfessionalFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    professional?: Professional,
    onBack?: (object) => void,
    onAfterSave?: (object) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProfessionalForm(props: ProfessionalFormProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    const [professional, setProfessional] = useState<Professional>(props?.professional ? structuredClone(props?.professional) : defaultProfessional)
    const [isFormValid, setIsFormValid] = useState(handleProfessionalValidationForDB(professional).validation)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.professional?.oldData ?? defaultElementFromBase)

    const [persons, setPersons] = useState(props?.professional?.person ? [props.professional.person] : [])

    const handleSetProfessionalTitle = (value) => { setProfessional({ ...professional, title: value }) }
    const handleSetProfessionalCreaNumber = (value) => { setProfessional({ ...professional, creaNumber: value }) }
    const handleSetProfessionalCredentialCode = (value) => { setProfessional({ ...professional, credentialCode: value }) }
    const handleSetProfessionalPerson = (value) => { setProfessional({ ...professional, title: value }) }

    const handleListItemClick = async (professional: Professional) => {
        setIsLoading(true)
        if (props.onSelectPerson) {
            props.onSelectPerson(professional)
        }
        setPersons([])
        setProfessional(professional)
        setIsOpen(false)
        setIsFormValid(true)
        setIsLoading(false)
    }

    const handleSave = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }

        let professionalForDB = structuredClone(professional)
        if (persons.length > 0) {
            professionalForDB = { ...professionalForDB, person: persons[0] }
        }

        const isValid = handleProfessionalValidationForDB(professionalForDB)
        if (isValid.validation) {
            let nowID = professionalForDB?.id ?? ""
            let personDocRef = {}

            if (persons?.length > 0) {
                persons?.map((element, index) => {
                    if (element.id) {
                        personDocRef = doc(personCollection, element.id)
                    }
                })
                professionalForDB = { ...professionalForDB, person: personDocRef }
            }

            if (professionalForDB.dateInsertUTC === 0) {
                professionalForDB = { ...professionalForDB, dateInsertUTC: handleNewDateToUTC() }
            }

            if (professionalForDB.oldData) {
                delete professionalForDB.oldData
            }
            const isSave = nowID === ""
            if (isSave) {
                try {
                    const docRef = await addDoc(professionalCollection, professionalForDB)
                    setProfessional({ ...professional, id: docRef.id })
                    feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                    console.error("Error adding document: ", e)
                }
            } else {
                try {
                    professionalForDB = { ...professionalForDB, dateLastUpdateUTC: handleNewDateToUTC() }
                    const docRef = doc(professionalCollection, nowID)
                    await updateDoc(docRef, professionalForDB)
                    feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em atualizar!"], messageType: "ERROR" }
                    console.error("Error upddating document: ", e)
                }
            }
            {/*
        */}
            if (props.onAfterSave) {
                props.onAfterSave(feedbackMessage)
            }
            handleListItemClick(defaultProfessional)
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

                    <FormRow>
                        <FormRowColumn unit="6">
                            <InputText
                                id="professionalTitle"
                                value={professional.title}
                                isLoading={isLoading}
                                validation={NOT_NULL_MARK}
                                title="Titulo do profissional"
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProfessionalTitle}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O titulo do profissional não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="creaNumber"
                                title="Número do CREA"
                                value={professional.creaNumber}
                                isLoading={isLoading}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProfessionalCreaNumber}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O numero do crea não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="credentialCode"
                                title="Codigo credencial"
                                isLoading={isLoading}
                                value={professional.credentialCode}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProfessionalCredentialCode}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O codigo credencial não pode ficar em branco."
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

            <SelectPersonForm
                persons={persons}
                isLoading={isLoading}
                title="Dados pessoais"
                isMultipleSelect={false}
                onSetPersons={setPersons}
                subtitle="Selecione a pessoa"
                onShowMessage={props.onShowMessage}
                buttonTitle="Pesquisar profissional"
                validationMessage="Esta pessoa já é um proprietário"
            />

            <form
                onSubmit={handleSave}>
                <FormRow>
                    {props.isBack && (
                        <FormRowColumn unit="3" className="justify-self-start">
                            <Button
                                onClick={props.onBack}
                                isLoading={isLoading}
                                isDisabled={isLoading}
                            >
                                Voltar
                            </Button>
                        </FormRowColumn>
                    )}

                    <FormRowColumn unit={props.isBack ? "3" : "6"} className="justify-self-end">
                        <Button
                            isLoading={isLoading}
                            isDisabled={!isFormValid}
                            type="submit">
                            Salvar
                        </Button>
                    </FormRowColumn>
                </FormRow>
            </form>
        </>
    )
}