import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { collection } from "firebase/firestore";
import SelectPersonForm from "./selectPersonForm";
import { PersonConversor, PropertyConversor } from "../../db/converters";
import { handlePropertyValidationForDB } from "../../util/validationUtil";
import { defaultProperty, Property } from "../../interfaces/objectInterfaces";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { db, PERSON_COLLECTION_NAME, PROPERTY_COLLECTION_NAME } from "../../db/firebaseDB";

interface PropertyFormProps {
    title?: string,
    subtitle?: string,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    property?: Property,
    onAfterSave?: (object) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function PropertyForm(props: PropertyFormProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const propertyCollection = collection(db, PROPERTY_COLLECTION_NAME).withConverter(PropertyConversor)
    let test = props?.property ?? defaultProperty

    const [property, setProperty] = useState<Property>(test)
    const [isFormValid, setIsFormValid] = useState(handlePropertyValidationForDB(property).validation)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSetPropertyLote = (value) => { setProperty({ ...property, lote: value }) }
    const handleSetPropertyLand = (value) => { setProperty({ ...property, land: value }) }
    const handleSetPropertyArea = (value) => { setProperty({ ...property, area: value }) }
    const handleSetPropertyCounty = (value) => { setProperty({ ...property, county: value }) }
    const handleSetPropertyOwners = (value) => { setProperty({ ...property, owners: value }) }
    const handleSetPropertyPerimeter = (value) => { setProperty({ ...property, perimeter: value }) }

    function handleSave() {
        if (props.onAfterSave) {
            props.onAfterSave({})
        }
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
                                id="lote"
                                title="Nome da propriedade"
                                value={property.lote}
                                isLoading={isLoading}
                                validation={NOT_NULL_MARK}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPropertyLote}
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
                                validation={NOT_NULL_MARK}
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
                                validation={NOT_NULL_MARK}
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
                                title="Área"
                                isLoading={isLoading}
                                validation={NUMBER_MARK}
                                value={property.area + ""}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPropertyArea}
                                onValidate={handleChangeFormValidation}
                                validationMessage="A área não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="perimeter"
                                title="Perímetro"
                                isLoading={isLoading}
                                validation={NUMBER_MARK}
                                value={property.perimeter + ""}
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
                persons={property.owners}
                subtitle="Selecione os proprietários"
                onSetPersons={handleSetPropertyOwners} 
                onShowMessage={props.onShowMessage}
                />

            <form
                onSubmit={handleSave}>
                <FormRow>
                    <FormRowColumn unit="6" className="justify-self-end">
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
