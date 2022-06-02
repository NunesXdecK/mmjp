import Form from "./form"
import FormRow from "./formRow"
import { useState } from "react"
import Button from "../button/button"
import AddressForm from "./addressForm"
import IOSModal from "../modal/iosModal"
import PersonList from "../list/personList"
import FormRowColumn from "./formRowColumn"
import ArrayTextForm from "./arrayTextForm"
import { OldDataProps } from "./oldDataForm"
import InputText from "../inputText/inputText"
import InputSelect from "../inputText/inputSelect"
import { PersonConversor } from "../../db/converters"
import { db, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { defaultElementFromBase, ElementFromBase } from "../../util/converterUtil"
import { CPF_MARK, NOT_NULL_MARK, TELEPHONE_MARK } from "../../util/patternValidationUtil"
import { handlePersonValidationForDB } from "../../util/validationUtil"
import { FeedbackMessage } from "../modal/feedbackMessageModal"

interface PersonFormProps {
    title?: string,
    subtitle?: string,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    person?: Person,
    onShowMessage?: (any) => void,
    onAfterSave?: (object) => void,
    onSelectPerson?: (object) => void,
}

export default function PersonForm(props: PersonFormProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)

    const [person, setPerson] = useState<Person>(props?.person ?? defaultPerson)
    const [isLoading, setIsLoading] = useState(false)
    const [isFormValid, setIsFormValid] = useState(handlePersonValidationForDB(person).validation)
    
    const [oldPerson, setOldPerson] = useState<ElementFromBase>(props?.person?.oldPerson ?? defaultElementFromBase)
    
    const [isOpen, setIsOpen] = useState(false)
    
    const handleSetPersonName = (text) => { setPerson({ ...person, name: text }) }
    const handleSetPersonCPF = (text) => { setPerson({ ...person, cpf: text }) }
    const handleSetPersonRG = (text) => { setPerson({ ...person, rg: text }) }
    const handleSetPersonRgIssuer = (text) => { setPerson({ ...person, rgIssuer: text }) }
    const handleSetPersonNaturalness = (text) => { setPerson({ ...person, naturalness: text }) }
    const handleSetPersonNationality = (text) => { setPerson({ ...person, nationality: text }) }
    const handleSetPersonMaritalStatus = (text) => { setPerson({ ...person, maritalStatus: text }) }
    const handleSetPersonProfession = (text) => { setPerson({ ...person, profession: text }) }
    const handleSetPersonTelephones = (texts) => { setPerson({ ...person, telephones: texts }) }
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

    const save = async (event) => {
        event.preventDefault()
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "SUCCESS" }

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
            if (person.dateInsertUTC === 0) {
                setPerson({ ...person, dateInsertUTC: Date.parse(new Date().toUTCString()) })
            }

            setIsLoading(true)

            if (isSave) {
                try {
                    const docRef = await addDoc(personCollection, person)
                    setPerson({ ...person, id: docRef.id })
                    feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"] }
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                    console.error("Error adding document: ", e)
                }
            } else {
                try {
                    const docRef = doc(personCollection, nowID)
                    await updateDoc(docRef, person)
                    feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"] }
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
        }
    }

    return (
        <>
            {props.isForOldRegister && (oldPerson["Nome Prop."] || oldPerson["CPF Prop."]) && (
                <OldDataProps
                    title="Informações antigas"
                    subtitle="Dados da base antiga"
                    oldData={oldPerson} />
            )}

            <form
                onSubmit={save}>
                <Form
                    title={props.title}
                    subtitle={props.subtitle}>
                    {props.isForSelect && (
                        <FormRow>
                            <FormRowColumn unit="6" className="justify-self-end">
                                <Button
                                    type="button"
                                    isLoading={isLoading}
                                    onClick={() => setIsOpen(true)}
                                >
                                    Pesquisar pessoa
                                </Button>
                            </FormRowColumn>
                        </FormRow>
                    )}

                    <FormRow>
                        <FormRowColumn unit="6">
                            <InputText
                                value={person.name}
                                id="fullname"
                                onSetText={handleSetPersonName}
                                title="Nome completo"
                                isLoading={isLoading}
                                validation={NOT_NULL_MARK}
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
                                value={person.cpf}
                                maxLength={14}
                                onSetText={handleSetPersonCPF}
                                isLoading={isLoading}
                                validation={CPF_MARK}
                                isDisabled={props.isForDisable}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O CPF está invalido"
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="rg"
                                title="RG"
                                validation="number"
                                value={person.rg}
                                onSetText={handleSetPersonRG}
                                isLoading={isLoading}
                                isDisabled={props.isForDisable}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="rg-issuer"
                                value={person.rgIssuer}
                                title="Emissor RG"
                                isLoading={isLoading}
                                onSetText={handleSetPersonRgIssuer}
                                isDisabled={props.isForDisable}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="naturalness"
                                value={person.naturalness}
                                title="Naturalidade"
                                isLoading={isLoading}
                                onSetText={handleSetPersonNaturalness}
                                isDisabled={props.isForDisable}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="nationality"
                                value={person.nationality}
                                title="Nacionalidade"
                                isLoading={isLoading}
                                onSetText={handleSetPersonNationality}
                                isDisabled={props.isForDisable}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputSelect
                                id="martial-status"
                                title="Estado Civil"
                                value={person.maritalStatus}
                                isLoading={isLoading}
                                onSetText={handleSetPersonMaritalStatus}
                                isDisabled={props.isForDisable}
                                options={["casado", "divorciado", "separado", "solteiro", "viuvo"]}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="profession"
                                title="Profissão"
                                value={person.profession}
                                isLoading={isLoading}
                                onSetText={handleSetPersonProfession}
                                isDisabled={props.isForDisable}
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
                onSubmit={save}>
                <AddressForm
                    title="Endereço"
                    address={person.address}
                    isLoading={isLoading}
                    setAddress={handleSetPersonAddress}
                    subtitle="Informações sobre o endereço"
                />

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
            
            {props.isForSelect && (
                <IOSModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}>
                    <PersonList
                        isForSelect={true}
                        onListItemClick={handleListItemClick} />
                </IOSModal>
            )}
        </>
    )
}