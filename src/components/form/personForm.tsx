import Form from "./form"
import FormRow from "./formRow"
import { useState } from "react"
import Button from "../button/button"
import AddressForm from "./addressForm"
import FormRowColumn from "./formRowColumn"
import ArrayTextForm from "./arrayTextForm"
import { OldDataProps } from "./oldDataForm"
import InputText from "../inputText/inputText"
import InputSelect from "../inputText/inputSelect"
import { PersonConversor } from "../../db/converters"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { db, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import { handlePersonValidationForDB } from "../../util/validationUtil"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { defaultElementFromBase, ElementFromBase } from "../../util/converterUtil"
import { CPF_MARK, NOT_NULL_MARK, TELEPHONE_MARK } from "../../util/patternValidationUtil"
import { handleRemoveCEPMask, handleRemoveCPFMask, handleRemoveTelephoneMask } from "../../util/maskUtil"
import { handleNewDateToUTC } from "../../util/dateUtils"

interface PersonFormProps {
    title?: string,
    subtitle?: string,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    person?: Person,
    onAfterSave?: (object) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function PersonForm(props: PersonFormProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)

    const [person, setPerson] = useState<Person>(props?.person ?? defaultPerson)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isFormValid, setIsFormValid] = useState(handlePersonValidationForDB(person).validation)

    const [oldPerson, setOldPerson] = useState<ElementFromBase>(props?.person?.oldPerson ?? defaultElementFromBase)


    const handleSetPersonName = (value) => { setPerson({ ...person, name: value }) }
    const handleSetPersonCPF = (value) => { setPerson({ ...person, cpf: value }) }
    const handleSetPersonRG = (value) => { setPerson({ ...person, rg: value }) }
    const handleSetPersonRgIssuer = (value) => { setPerson({ ...person, rgIssuer: value }) }
    const handleSetPersonNaturalness = (value) => { setPerson({ ...person, naturalness: value }) }
    const handleSetPersonNationality = (value) => { setPerson({ ...person, nationality: value }) }
    const handleSetPersonMaritalStatus = (value) => { setPerson({ ...person, maritalStatus: value }) }
    const handleSetPersonProfession = (value) => { setPerson({ ...person, profession: value }) }
    const handleSetPersonTelephones = (values) => { setPerson({ ...person, telephones: values }) }
    const handleSetPersonAddress = (address) => { setPerson({ ...person, address: address }) }

    const handleListItemClick = async (person: Person) => {
        if (props.onSelectPerson) {
            props.onSelectPerson(person)
        }
        setPerson(person)
        setIsOpen(false)
        setIsFormValid(true)
        setIsLoading(true)
        if (person.id !== "" || props.isForOldRegister) {
            try {
                setOldPerson(person.oldPerson)
                const querySnapshot = await getDocs(personCollection)
                querySnapshot.forEach((doc) => {
                    const name = doc.data().name
                    const cpf = doc.data().cpf
                    if (doc.id && (person.cpf === cpf || person.name === name)) {
                        setPerson(doc.data())
                    }
                })
            } catch (err) {
                console.error(err)
                if (props.onShowMessage) {
                    let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu, tente novamente."], messageType: "ERROR" }
                    props.onShowMessage(feedbackMessage)
                }
            }
        }
        setIsLoading(false)
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleSave = async (event) => {
        event.preventDefault()
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }

        let nowID = ""
        const querySnapshot = await getDocs(personCollection)
        querySnapshot.forEach((doc) => {
            const cpf = doc.data().cpf
            if (doc.id && person.cpf === cpf) {
                nowID = doc.id
            }
        })

        const isSave = nowID === ""
        const isValid = handlePersonValidationForDB(person)

        if (isValid.validation) {
            setIsLoading(true)

            let personForDB: Person = person
            if (person.dateInsertUTC === 0) {
                personForDB = { ...personForDB, dateInsertUTC: handleNewDateToUTC() }
            }

            let telephonesWithNoMask = []
            personForDB.telephones.map((element, index) => {
                telephonesWithNoMask = [...telephonesWithNoMask, handleRemoveTelephoneMask(element)]
            })

            if (personForDB.oldPerson) {
                delete personForDB.oldPerson
            }

            personForDB = {
                ...personForDB
                , cpf: handleRemoveCPFMask(personForDB.cpf)
                , address: { ...personForDB.address, cep: handleRemoveCEPMask(personForDB.address.cep) }
                , telephones: telephonesWithNoMask
            }

            if (isSave) {
                try {
                    const docRef = await addDoc(personCollection, personForDB)
                    setPerson({ ...person, id: docRef.id })
                    feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                    console.error("Error adding document: ", e)
                }
            } else {
                try {
                    const docRef = doc(personCollection, nowID)
                    await updateDoc(docRef, personForDB)
                    feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em atualizar!"], messageType: "ERROR" }
                    console.error("Error upddating document: ", e)
                }
            }

            setIsLoading(false)
            handleListItemClick(defaultPerson)

            if (props.onAfterSave) {
                props.onAfterSave(feedbackMessage)
            }
        } else {
            feedbackMessage = { ...feedbackMessage, messages: isValid.messages, messageType: "ERROR" }
            props.onShowMessage(feedbackMessage)
        }

    }

    return (
        <>
            {props.isForOldRegister && (oldPerson["Nome Prop."] || oldPerson["CPF Prop."]) && (
                <OldDataProps
                    oldData={oldPerson}
                    title="Informações antigas"
                    subtitle="Dados da base antiga"
                />
            )}

            <form
                onSubmit={handleSave}>
                <Form
                    title={props.title}
                    subtitle={props.subtitle}>

                    <FormRow>
                        <FormRowColumn unit="6">
                            <InputText
                                id="fullname"
                                value={person.name}
                                title="Nome completo"
                                isLoading={isLoading}
                                validation={NOT_NULL_MARK}
                                onSetText={handleSetPersonName}
                                isDisabled={props.isForDisable}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O nome não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="cpf"
                                mask="cpf"
                                title="CPF"
                                maxLength={14}
                                value={person.cpf}
                                isLoading={isLoading}
                                validation={CPF_MARK}
                                onSetText={handleSetPersonCPF}
                                isDisabled={props.isForDisable}
                                validationMessage="O CPF está invalido"
                                onValidate={handleChangeFormValidation}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="rg"
                                title="RG"
                                value={person.rg}
                                validation="number"
                                isLoading={isLoading}
                                onSetText={handleSetPersonRG}
                                isDisabled={props.isForDisable}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="rg-issuer"
                                title="Emissor RG"
                                isLoading={isLoading}
                                value={person.rgIssuer}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPersonRgIssuer}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="naturalness"
                                title="Naturalidade"
                                isLoading={isLoading}
                                value={person.naturalness}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPersonNaturalness}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="nationality"
                                title="Nacionalidade"
                                isLoading={isLoading}
                                value={person.nationality}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPersonNationality}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputSelect
                                id="martial-status"
                                title="Estado Civil"
                                isLoading={isLoading}
                                value={person.maritalStatus}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPersonMaritalStatus}
                                options={["casado", "divorciado", "separado", "solteiro", "viuvo"]}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="profession"
                                title="Profissão"
                                isLoading={isLoading}
                                value={person.profession}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPersonProfession}
                            />
                        </FormRowColumn>
                    </FormRow>
                </Form>

                <div className="hidden">
                    <Button
                        type="submit">
                    </Button>
                </div>
            </form>

            <ArrayTextForm
                id="telephone"
                mask="telephone"
                title="Telefones"
                isLoading={isLoading}
                inputTitle="Telephone"
                texts={person.telephones}
                validation={TELEPHONE_MARK}
                onSetTexts={handleSetPersonTelephones}
                subtitle="Informações sobre os contatos"
                validationMessage="Faltam números no telefone"
            />

            <form
                onSubmit={handleSave}>
                <AddressForm
                    title="Endereço"
                    isLoading={isLoading}
                    address={person.address}
                    setAddress={handleSetPersonAddress}
                    subtitle="Informações sobre o endereço"
                />

                <FormRow>
                    <FormRowColumn unit="6" className="justify-self-end">
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