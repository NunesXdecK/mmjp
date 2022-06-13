import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import SelectPersonForm from "./selectPersonForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { PersonConversor, PropertyConversor } from "../../db/converters";
import { handlePropertyValidationForDB } from "../../util/validationUtil";
import { defaultProperty, Property } from "../../interfaces/objectInterfaces";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { defaultElementFromBase, ElementFromBase } from "../../util/converterUtil";
import { db, PERSON_COLLECTION_NAME, PROPERTY_COLLECTION_NAME } from "../../db/firebaseDB";

interface PropertyFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    property?: Property,
    onBack?: (object) => void,
    onAfterSave?: (object) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function PropertyForm(props: PropertyFormProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const propertyCollection = collection(db, PROPERTY_COLLECTION_NAME).withConverter(PropertyConversor)

    const [property, setProperty] = useState<Property>(props?.property ? structuredClone(props?.property) : defaultProperty)
    const [isFormValid, setIsFormValid] = useState(handlePropertyValidationForDB(property).validation)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.property?.oldData ?? defaultElementFromBase)

    const handleSetPropertyName = (value) => { setProperty({ ...property, name: value }) }
    const handleSetPropertyLand = (value) => { setProperty({ ...property, land: value }) }
    const handleSetPropertyArea = (value) => { setProperty({ ...property, area: value }) }
    const handleSetPropertyCounty = (value) => { setProperty({ ...property, county: value }) }
    const handleSetPropertyOwners = (value) => { setProperty({ ...property, owners: value }) }
    const handleSetPropertyPerimeter = (value) => { setProperty({ ...property, perimeter: value }) }

    const handleListItemClick = async (property: Property) => {
        setIsLoading(true)
        if (props.onSelectPerson) {
            props.onSelectPerson(property)
        }
        setProperty(property)
        setIsOpen(false)
        setIsFormValid(true)
        setIsLoading(false)
    }

    const handleSave = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }

        let propertyForDB = structuredClone(property)
        const isValid = handlePropertyValidationForDB(propertyForDB)
        if (isValid) {
            let nowID = propertyForDB?.id ?? ""
            let docRefsForDB = []

            if (propertyForDB.owners?.length > 0) {
                propertyForDB.owners?.map((element, index) => {
                    if (element.id) {
                        const docRef = doc(personCollection, element.id)
                        docRefsForDB = [...docRefsForDB, docRef]
                    }
                })
                propertyForDB = { ...propertyForDB, owners: docRefsForDB }
            }

            const isSave = nowID === ""
            if (isSave) {
                try {
                    const docRef = await addDoc(propertyCollection, propertyForDB)
                    setProperty({ ...property, id: docRef.id })
                    feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                    console.error("Error adding document: ", e)
                }
            } else {
                try {
                    const docRef = doc(propertyCollection, nowID)
                    await updateDoc(docRef, propertyForDB)
                    feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em atualizar!"], messageType: "ERROR" }
                    console.error("Error upddating document: ", e)
                }
            }
            handleListItemClick(defaultProperty)
            if (props.onAfterSave) {
                props.onAfterSave(feedbackMessage)
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

                    <FormRow>
                        <FormRowColumn unit="6">
                            <InputText
                                id="propertyname"
                                value={property.name}
                                isLoading={isLoading}
                                validation={NOT_NULL_MARK}
                                title="Nome da propriedade"
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPropertyName}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O nome da propriedade não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="land"
                                title="Gleba"
                                value={property.land}
                                isLoading={isLoading}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPropertyLand}
                                onValidate={handleChangeFormValidation}
                                validationMessage="A gleba não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="county"
                                title="Município/UF"
                                isLoading={isLoading}
                                value={property.county}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPropertyCounty}
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
                                value={property.area}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPropertyArea}
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
                                value={property.perimeter}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPropertyPerimeter}
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

            <SelectPersonForm
                title="Proprietários"
                isLoading={isLoading}
                persons={property.owners}
                onShowMessage={props.onShowMessage}
                subtitle="Selecione os proprietários"
                onSetPersons={handleSetPropertyOwners}
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