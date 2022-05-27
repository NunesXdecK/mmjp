import { useState } from "react"
import { Person, PersonAddress } from "../../interfaces/objectInterfaces"
import { ElementFromBase } from "../../util/ConverterUtil"
import { CPF_MARK, CPF_PATTERN, NOT_NULL_MARK, NOT_NULL_PATTERN } from "../../util/PatternValidationUtil"
import Button from "../button/button"
import InputText from "../inputText/inputText"
import PersonList from "../list/personList"
import IOSModal from "../modal/iosModal"
import AddressForm from "./addressForm"
import ArrayTextForm from "./arrayTextForm"
import Form from "./form"
import { OldDataProps } from "./oldDataForm"

const defaultAddress: PersonAddress = {
    cep: "",
    publicPlace: "",
    number: "",
    district: "",
    county: "",
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
    const [isFormValid, setIsFormValid] = useState(false)

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

    const handleListItemClick = (person: Person) => {
        if (props.onSelectPerson) {
            props.onSelectPerson(person)
        }
        setName(person.name)
        setCpf(person.cpf)
        setRg(person.rg)
        setRgIssuer(person.rgIssuer)
        setNationality(person.nationality)
        setNaturalness(person.naturalness)
        setMaritalStatus(person.maritalStatus)
        setProfession(person.profession)
        setAddress(person.address)
        setTelephones(person.telephones)
        setOldPerson(person.oldPerson)
        setIsOpen(false)
    }

    const handleChangeValid = (isValid) => {
        setIsFormValid(isValid)
    }

    const save = (event) => {
        event.preventDefault()
        console.log("save")
        if (isFormValid) {
            console.log("valid")
            const person = {
                name: name,
                cpf: cpf,
                rg: rg,
                rgIssuer: rgIssuer,
                nationality: nationality,
                naturalness: naturalness,
                maritalStatus: maritalStatus,
                profession: profession,
                address: address,
                telephones: telephones,
            }

            console.log(person)

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
                        <div className="grid grid-cols-6 sm:gap-6">
                            <div className="p-2 col-span-6 sm:col-span-6 justify-self-end">
                                <Button
                                    onClick={() => setIsOpen(true)}
                                    type="button">
                                    Pesquisar pessoa
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-6 sm:gap-6">
                        <div className="p-2 col-span-6 sm:col-span-6">
                            <InputText
                                validation={NOT_NULL_MARK}
                                validationMessage="O nome não pode ficar em branco."
                                isDisabled={props.isForDisable}
                                onValidate={handleChangeValid}
                                value={name}
                                setText={setName}
                                id="fullname"
                                title="Nome completo" />
                        </div>
                    </div>

                    <div className="grid grid-cols-6 sm:gap-6 md:pt-2">
                        <div className="p-2 col-span-6 sm:col-span-3">
                            <InputText
                                maxLength={14}
                                validation={CPF_MARK}
                                onValidate={handleChangeValid}
                                validationMessage="O CPF está invalido"
                                isDisabled={props.isForDisable}
                                mask="cpf"
                                value={cpf}
                                setText={setCpf}
                                id="cpf"
                                title="CPF" />
                        </div>
                    </div>

                    <div className="grid grid-cols-6 sm:gap-6 md:pt-2">
                        <div className="p-2 sm:mt-0 col-span-6 sm:col-span-3">
                            <InputText
                                isDisabled={props.isForDisable}
                                mask="rg"
                                value={rg}
                                setText={setRg}
                                id="rg"
                                title="RG" />
                        </div>

                        <div className="p-2 sm:mt-0 col-span-6 sm:col-span-3">
                            <InputText
                                isDisabled={props.isForDisable}
                                value={rgIssuer}
                                setText={setRgIssuer}
                                id="rg-issuer"
                                title="Emissor RG" />
                        </div>
                    </div>

                    <div className="grid grid-cols-6 sm:gap-6 md:pt-2">
                        <div className="p-2 sm:mt-0 col-span-6 sm:col-span-3">
                            <InputText
                                isDisabled={props.isForDisable}
                                value={naturalness}
                                setText={setNaturalness}
                                id="naturalness"
                                title="Naturalidade" />
                        </div>

                        <div className="p-2 sm:mt-0 col-span-6 sm:col-span-3">
                            <InputText
                                isDisabled={props.isForDisable}
                                value={nationality}
                                setText={setNationality}
                                id="nationality"
                                title="Nacionalidade" />
                        </div>
                    </div>

                    <div className="grid grid-cols-6 sm:gap-6 md:pt-2">
                        <div className="p-2 sm:mt-0 col-span-6 sm:col-span-3">
                            <InputText
                                isDisabled={props.isForDisable}
                                value={maritalStatus}
                                setText={setMaritalStatus}
                                id="martial-status"
                                title="Estado Civil" />
                        </div>

                        <div className="p-2 sm:mt-0 col-span-6 sm:col-span-3">
                            <InputText
                                isDisabled={props.isForDisable}
                                value={profession}
                                setText={setProfession}
                                id="profession"
                                title="Profissão" />
                        </div>
                    </div>
                </Form>

                <div className="hidden">
                    <Button
                        type="submit">
                    </Button>
                </div>
            </form>

            <ArrayTextForm
                texts={telephones}
                setTexts={setTelephones}
                title="Telefones"
                subtitle="Informações sobre os contatos" />

            <form
                onSubmit={save}>
                <AddressForm
                    address={address}
                    setAddress={setAddress}
                    title="Endereço"
                    subtitle="Informações sobre o endereço"
                />
                {/*
                {!props.isForSelect && (
                    )}
                */}
                <div className="grid grid-cols-6 gap-6">
                    <div className="p-2 col-span-6 sm:col-span-6 justify-self-end">
                        <Button
                            type="submit">
                            Salvar
                        </Button>
                    </div>
                </div>
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