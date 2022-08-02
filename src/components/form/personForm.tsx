import Form from "./form"
import FormRow from "./formRow"
import { useState } from "react"
import AddressForm from "./addressForm"
import FormRowColumn from "./formRowColumn"
import ArrayTextForm from "./arrayTextForm"
import { OldDataForm } from "./oldDataForm"
import InputText from "../inputText/inputText"
import InputSelect from "../inputText/inputSelect"
import ActionButtonsForm from "./actionButtonsForm"
import InputCheckbox from "../inputText/inputCheckbox"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { handlePreparePersonForDB } from "../../util/converterUtil"
import { handlePersonValidationForDB } from "../../util/validationUtil"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"
import { CPF_MARK, TELEPHONE_MARK, TEXT_NOT_NULL_MARK } from "../../util/patternValidationUtil"

interface PersonFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canMultiple?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    person?: Person,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function PersonForm(props: PersonFormProps) {

    const [personOriginal, setPersonOriginal] = useState<Person>(props?.person ?? defaultPerson)
    const [person, setPerson] = useState<Person>(props?.person ?? defaultPerson)
    const [isFormValid, setIsFormValid] = useState(handlePersonValidationForDB(person).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)

    const handleSetPersonOldData = (value) => { setPerson({ ...person, oldData: value }) }

    const handleSetPersonRG = (value) => { setPerson({ ...person, rg: value }) }
    const handleSetPersonCPF = (value) => { setPerson({ ...person, cpf: value }) }
    const handleSetPersonName = (value) => { setPerson({ ...person, name: value }) }
    const handleSetPersonRgIssuer = (value) => { setPerson({ ...person, rgIssuer: value }) }
    const handleSetPersonAddress = (address) => { setPerson({ ...person, address: address }) }
    const handleSetPersonClientCode = (value) => { setPerson({ ...person, clientCode: value }) }
    const handleSetPersonProfession = (value) => { setPerson({ ...person, profession: value }) }
    const handleSetPersonNaturalness = (value) => { setPerson({ ...person, naturalness: value }) }
    const handleSetPersonNationality = (value) => { setPerson({ ...person, nationality: value }) }
    const handleSetPersonTelephones = (values) => { setPerson({ ...person, telephones: values }) }
    const handleSetPersonMaritalStatus = (value) => { setPerson({ ...person, maritalStatus: value }) }

    const handleDiference = (): boolean => {
        let hasDiference = false
        Object.keys(personOriginal)?.map((element, index) => {
            if (person[element] !== personOriginal[element]) {
                hasDiference = true
            }
        })
        return hasDiference
    }

    const handleOnBack = () => {
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleSave = async () => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }
        let personForDB: Person = { ...person }
        const isValid = handlePersonValidationForDB(personForDB)
        if (isValid.validation) {
            personForDB = handlePreparePersonForDB(personForDB)
            let nowID = personForDB?.id ?? ""
            const isSave = nowID === ""
            let res = { status: "ERROR", id: nowID, message: "" }

            if (isSave) {
                feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
            } else {
                feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
            }

            try {
                res = await fetch("api/person", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", data: personForDB }),
                }).then((res) => res.json())
            } catch (e) {
                if (isSave) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                } else {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em Atualizadar!"], messageType: "ERROR" }
                }
                console.error("Error adding document: ", e)
            }

            if (res.status === "SUCCESS") {
                setPerson({ ...person, id: res.id })
                personForDB = { ...personForDB, id: res.id }

                if (isMultiple) {
                    setPerson(defaultPerson)
                }

                if (!isMultiple && props.onAfterSave) {
                    props.onAfterSave(feedbackMessage, personForDB)
                }
            } else {
                feedbackMessage = { ...feedbackMessage, messages: ["Erro!"], messageType: "ERROR" }
            }

            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        } else {
            feedbackMessage = { ...feedbackMessage, messages: isValid.messages, messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
        setIsLoading(false)
    }

    return (
        <>
            {props.isForOldRegister && (person.oldData["Nome Prop."] || person.oldData["CPF Prop."]) && (
                <OldDataForm
                    oldData={person.oldData}
                    title="Informações antigas"
                    subtitle="Dados da base antiga"
                />
            )}

            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>
                <ActionButtonsForm
                    isLeftOn
                    isForBackControl
                    isDisabled={!isFormValid}
                    rightWindowText="Deseja confirmar as alterações?"
                    isForOpenLeft={person.id !== "" && handleDiference()}
                    isForOpenRight={person.id !== "" && handleDiference()}
                    rightButtonText={person.id === "" ? "Salvar" : "Editar"}
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
                                id="fullname"
                                value={person.name}
                                title="Nome completo"
                                isLoading={isLoading}
                                validation={TEXT_NOT_NULL_MARK}
                                onSetText={handleSetPersonName}
                                isDisabled={props.isForDisable}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O nome não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                id="code"
                                title="Codigo do cliente"
                                value={person.clientCode}
                                isLoading={isLoading}
                                onSetText={handleSetPersonClientCode}
                                isDisabled={props.isForDisable}
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
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>

                <AddressForm
                    title="Endereço"
                    isLoading={isLoading}
                    address={person.address}
                    setAddress={handleSetPersonAddress}
                    subtitle="Informações sobre o endereço"
                />

                <ActionButtonsForm
                    isLeftOn
                    isDisabled={!isFormValid}
                    rightWindowText="Deseja confirmar as alterações?"
                    isForOpenLeft={person.id !== "" && handleDiference()}
                    isForOpenRight={person.id !== "" && handleDiference()}
                    rightButtonText={person.id === "" ? "Salvar" : "Editar"}
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
            </form>
        </>
    )
}