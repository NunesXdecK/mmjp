import Form from "./form"
import { useState } from "react"
import Button from "../button/button"
import AddressForm from "./addressForm"
import IOSModal from "../modal/iosModal"
import PersonList from "../list/personList"
import ArrayTextForm from "./arrayTextForm"
import { OldDataProps } from "./oldDataForm"
import InputText from "../inputText/inputText"
import { ElementFromBase } from "../../util/converterUtil"
import { Person, PersonAddress } from "../../interfaces/objectInterfaces"
import { CPF_MARK, NOT_NULL_MARK, TELEPHONE_MARK } from "../../util/patternValidationUtil"
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { PersonConversor } from "../../db/converters"
import { db, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import InputSelect from "../inputText/inputSelect"
import { handleRemoveCEPMask, handleRemoveCPFMask } from "../../util/maskUtil"
import FormRow from "./formRow"
import FormRowColumn from "./formRowColumn"

const defaultAddress: PersonAddress = {
    cep: "",
    number: "",
    county: "",
    district: "",
    complement: "",
    publicPlace: "",
}

const defaultElementFromBase: ElementFromBase = {
    "Nome Prop.": "",
    "CPF Prop.": "",
    "RG Prop.": "",
    "Nacionalidade Prop.": "",
    "Naturalidade Prop.": "",
    "Estado Civíl Prop.": "",
    "Profissão Prop.": "",
    "Telefone Prop.": "",
    "Logradouro End.": "",
    "Numero End.": "",
    "Bairro End.": "",
    "CEP End.": "",
    "Município/UF End.": "",
    "Lote": "",
    "Data": "",
    "Data Simples": "",
    "Nome Prof.": "",
    "CPF Prof.": "",
    "RG Prof.": "",
    "Título Prof.": "",
    "CREA Prof.": "",
    "Cod. Credenciado": "",
    "Endereço Prof.": "",
    "Bairro Prof.": "",
    "Cidade/UF Prof.": "",
    "CEP": "",
    "Telefone Prof. ": "",
}


interface PersonFormProps {
    title?: string,
    subtitle?: string,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    onSelectPerson?: (object) => void,
    afterSave?: (object) => void,
}

export default function PersonForm(props: PersonFormProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)

    const [isFormValid, setIsFormValid] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [personID, setPersonID] = useState("")
    const [personDateInsertUTC, setPersonDateInsertUTC] = useState(0)

    const [name, setName] = useState("")
    const [cpf, setCpf] = useState("")
    const [rg, setRg] = useState("")
    const [rgIssuer, setRgIssuer] = useState("")
    const [nationality, setNationality] = useState("")
    const [naturalness, setNaturalness] = useState("")
    const [maritalStatus, setMaritalStatus] = useState("")
    const [profession, setProfession] = useState("")

    const [oldPerson, setOldPerson] = useState<ElementFromBase>(defaultElementFromBase)
    const [address, setAddress] = useState<PersonAddress>(defaultAddress)

    const [telephones, setTelephones] = useState([])


    const [isOpen, setIsOpen] = useState(false)

    const handleListItemClick = async (person: Person) => {
        if (props.onSelectPerson) {
            props.onSelectPerson(person)
        }

        setPersonID(person.id)
        setPersonDateInsertUTC(person.dateInsertUTC)

        setRg(person.rg)
        setCpf(person.cpf)
        setName(person.name)
        setAddress(person.address)
        setRgIssuer(person.rgIssuer)
        setOldPerson(person.oldPerson)
        setTelephones(person.telephones)
        setProfession(person.profession)
        setNationality(person.nationality)
        setNaturalness(person.naturalness)
        setMaritalStatus(person.maritalStatus)
        setIsOpen(false)
        setIsFormValid(true)
        setIsLoading(true)
        const querySnapshot = await getDocs(personCollection)
        querySnapshot.forEach((doc) => {
            const id = doc.id
            const name = doc.data().name
            const cpf = doc.data().cpf
            if (doc.id && person.cpf === cpf || person.name === name) {
                setPersonID(() => id)
            }
        })
        setIsLoading(false)
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const save = async (event) => {
        event.preventDefault()
        if (isFormValid) {
            if (personDateInsertUTC === 0) {
                setPersonDateInsertUTC(Date.parse(new Date().toUTCString()))
            }

            let person: Person = {
                rg: rg,
                cpf: handleRemoveCPFMask(cpf),
                name: name,
                rgIssuer: rgIssuer,
                profession: profession,
                nationality: nationality,
                naturalness: naturalness,
                maritalStatus: maritalStatus,
                dateInsertUTC: personDateInsertUTC,
                address: { ...address, cep: handleRemoveCEPMask(address.cep) },
                telephones: telephones,
            }

            setIsLoading(true)

            if (personID === "") {
                try {
                    const docRef = await addDoc(personCollection, person)
                    setPersonID(docRef.id)
                } catch (e) {
                    console.error("Error adding document: ", e)
                }
            } else {
                try {
                    const docRef = doc(personCollection, personID)
                    await updateDoc(docRef, person)
                } catch (e) {
                    console.error("Error upddating document: ", e)
                }
            }
            {/*
        */}
            setIsLoading(false)

            if (props.afterSave) {
                props.afterSave({})
            }
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
                    {(props.isForSelect || props.isForOldRegister) && (
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
                                value={name}
                                id="fullname"
                                onSetText={setName}
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
                                value={cpf}
                                maxLength={14}
                                onSetText={setCpf}
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
                                value={rg}
                                onSetText={setRg}
                                isLoading={isLoading}
                                isDisabled={props.isForDisable}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="rg-issuer"
                                value={rgIssuer}
                                title="Emissor RG"
                                isLoading={isLoading}
                                onSetText={setRgIssuer}
                                isDisabled={props.isForDisable}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="naturalness"
                                value={naturalness}
                                title="Naturalidade"
                                isLoading={isLoading}
                                onSetText={setNaturalness}
                                isDisabled={props.isForDisable}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="nationality"
                                value={nationality}
                                title="Nacionalidade"
                                isLoading={isLoading}
                                onSetText={setNationality}
                                isDisabled={props.isForDisable}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputSelect
                                id="martial-status"
                                title="Estado Civil"
                                value={maritalStatus}
                                isLoading={isLoading}
                                onSetText={setMaritalStatus}
                                isDisabled={props.isForDisable}
                                options={["", "casado", "divorciado", "separado", "solteiro", "viuvo"]}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="profession"
                                title="Profissão"
                                value={profession}
                                isLoading={isLoading}
                                onSetText={setProfession}
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
                texts={telephones}
                isLoading={isLoading}
                inputTitle="Telephone"
                onSetTexts={setTelephones}
                validation={TELEPHONE_MARK}
                subtitle="Informações sobre os contatos"
                validationMessage="Faltam números no telefone"
            />

            <form
                onSubmit={save}>
                <AddressForm
                    title="Endereço"
                    address={address}
                    isLoading={isLoading}
                    setAddress={setAddress}
                    subtitle="Informações sobre o endereço"
                />
                {/*
                {!props.isForSelect && (
                    )}
                */}
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

            {(props.isForSelect || props.isForOldRegister) && (
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