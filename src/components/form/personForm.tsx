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
import ScrollDownTransition from "../animation/scrollDownTransition"
import FeedbackMessageSaveText from "../modal/feedbackMessageSavingText"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"
import { handleIsEqual, handlePersonValidationForDB } from "../../util/validationUtil"
import { CPF_MARK, TELEPHONE_MARK, TEXT_NOT_NULL_MARK } from "../../util/patternValidationUtil"

interface PersonFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canAutoSave?: boolean,
    canMultiple?: boolean,
    isDisabled?: boolean,
    isForOldRegister?: boolean,
    person?: Person,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function PersonForm(props: PersonFormProps) {
    const [personID, setPersonID] = useState(props?.person?.id?.length ? props?.person?.id : "")
    const [originalClientCode, setOriginalClientCode] = useState(props?.person?.clientCode ?? "")
    const [person, setPerson] = useState<Person>(props?.person ?? defaultPerson)
    const [personOriginal, setPersonOriginal] = useState<Person>(props?.person ?? defaultPerson)
    const [isFormValid, setIsFormValid] = useState(handlePersonValidationForDB(person).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)
    const [isAutoSaving, setIsAutoSaving] = useState(false)
    const [isClientCodeInvalid, setIsClientCodeInvalid] = useState(false)
    const [isCheckingClientCode, setIsCheckingClientCode] = useState(false)

    const handleSetPersonOldData = (value) => { setPerson({ ...person, oldData: value }) }

    const handleSetPersonRG = (value) => { setPerson({ ...person, rg: value }) }
    const handleSetPersonCPF = (value) => { setPerson({ ...person, cpf: value }) }
    const handleSetPersonName = (value) => { setPerson({ ...person, name: value }) }
    const handleSetPersonRgIssuer = (value) => { setPerson({ ...person, rgIssuer: value }) }
    const handleSetPersonAddress = (address) => { setPerson({ ...person, address: address }) }
    const handleSetPersonProfession = (value) => { setPerson({ ...person, profession: value }) }
    const handleSetPersonNaturalness = (value) => { setPerson({ ...person, naturalness: value }) }
    const handleSetPersonNationality = (value) => { setPerson({ ...person, nationality: value }) }
    const handleSetPersonTelephones = (values) => { setPerson({ ...person, telephones: values }) }
    const handleSetPersonMaritalStatus = (value) => { setPerson({ ...person, maritalStatus: value }) }
    const handleSetPersonClientCode = (value) => {
        setPerson({ ...person, clientCode: value })
    }

    const handleOnBack = () => {
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleDiference = (): boolean => {
        return !handleIsEqual(person, personOriginal)
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(old => isValid)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleValidClientCode = async (event, show?) => {
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        let code = person.clientCode
        if (code?.length && originalClientCode !== code) {
            if (!show) {
                setIsCheckingClientCode(true)
            }
            let res = await fetch("api/isClientCodeAvaliable/" + code).then(res => res.json())
            if (!show) {
                setIsCheckingClientCode(false)
            }
            setIsClientCodeInvalid(res.data)
            return res.data
        } else {
            setIsClientCodeInvalid(false)
            return false
        }
    }

    const handlePersonValidationForDBInner = (person, isSearching) => {
        let isValid = handlePersonValidationForDB(person)
        if (person.clientCode.length > 0 && person.clientCode !== originalClientCode) {
            if (isSearching) {
                isValid = {
                    ...isValid,
                    validation: false,
                    messages: [...isValid.messages, "O codigo do cliente já está em uso."]
                }
            }
        }
        return isValid
    }

    const handlePreparePersonForDBInner = (person) => {
        let personForDB = { ...person }
        if (!personForDB?.id?.length && personID?.length) {
            personForDB = { ...personForDB, id: personID }
        }
        personForDB = handlePreparePersonForDB(personForDB)
        return personForDB
    }

    const handleAutoSave = async (event?) => {
        if (!props.canAutoSave) {
            return
        }
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (isAutoSaving || isCheckingClientCode || isClientCodeInvalid) {
            return
        }
        if (!handleDiference()) {
            return
        }
        const isValid = handlePersonValidationForDBInner(person, isCheckingClientCode || isClientCodeInvalid)
        if (!isValid.validation) {
            return
        }
        setIsAutoSaving(old => true)
        let personForDB = handlePreparePersonForDBInner(person)
        const res = await handleSaveInner(personForDB, false)
        if (res.status === "ERROR") {
            return
        }
        setIsAutoSaving(old => false)
        setPersonID(res.id)
        setPersonOriginal(person)
        setOriginalClientCode(res.person.clientCode)
    }

    const handleSaveInner = async (person, history) => {
        let res = { status: "ERROR", id: "", person: person }
        let personForDB = handlePreparePersonForDBInner(person)
        try {
            const saveRes = await fetch("api/person", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: personForDB, history }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, person: { ...person, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async () => {
        if (isAutoSaving) {
            return
        }
        setIsLoading(true)
        let resCC = await handleValidClientCode(null, true)
        const isValid = handlePersonValidationForDBInner(person, resCC)
        if (!isValid.validation) {
            setIsLoading(false)
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        let personFromDB = { ...person }
        let res = await handleSaveInner(person, true)
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            setIsLoading(false)
            return
        }
        setPerson({ ...person, id: res.id })
        setPersonOriginal({ ...person, id: res.id })
        setOriginalClientCode(person.clientCode)
        personFromDB = { ...res.person }
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (isMultiple) {
            setPerson(defaultPerson)
            setPersonOriginal(defaultPerson)
            setPersonID("")
            setOriginalClientCode("")
        }
        if (!isMultiple && props.onAfterSave) {
            props.onAfterSave(feedbackMessage, personFromDB)
        }
        setIsLoading(false)
    }

    const handleActionBar = () => {
        return (
            <ActionButtonsForm
                isLeftOn
                isRightOn
                isForBackControl
                isLoading={isLoading}
                isDisabled={!isFormValid || isAutoSaving}
                rightWindowText="Deseja confirmar as alterações?"
                isForOpenLeft={person.id !== "" && handleDiference()}
                isForOpenRight={person.id !== "" && handleDiference()}
                rightButtonText={"Salvar"}
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
        )
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

                {handleActionBar()}

                <ScrollDownTransition
                    isOpen={isAutoSaving}>
                    <Form>
                        <FeedbackMessageSaveText
                            isOpen={true}
                        />
                    </Form>
                </ScrollDownTransition>

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
                                    isDisabled={props.isDisabled}
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
                                onBlur={handleAutoSave}
                                validation={TEXT_NOT_NULL_MARK}
                                onSetText={handleSetPersonName}
                                isDisabled={props.isDisabled}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O nome não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                id="code"
                                isLoading={isLoading}
                                title="Codigo de cliente"
                                value={person.clientCode}
                                isInvalid={isClientCodeInvalid}
                                isDisabled={props.isDisabled}
                                message="Verificando o codigo..."
                                onSetText={handleSetPersonClientCode}
                                isForShowMessage={isCheckingClientCode}
                                validationMessage="O código já está em uso."
                                onBlur={(event) => {
                                    handleValidClientCode(event)
                                    handleAutoSave(event)
                                }}
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
                                onBlur={handleAutoSave}
                                onSetText={handleSetPersonCPF}
                                isDisabled={props.isDisabled}
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
                                onBlur={handleAutoSave}
                                onSetText={handleSetPersonRG}
                                isDisabled={props.isDisabled}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="rg-issuer"
                                title="Emissor RG"
                                isLoading={isLoading}
                                value={person.rgIssuer}
                                onBlur={handleAutoSave}
                                isDisabled={props.isDisabled}
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
                                onBlur={handleAutoSave}
                                value={person.naturalness}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetPersonNaturalness}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="nationality"
                                title="Nacionalidade"
                                isLoading={isLoading}
                                onBlur={handleAutoSave}
                                value={person.nationality}
                                isDisabled={props.isDisabled}
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
                                onBlur={handleAutoSave}
                                value={person.maritalStatus}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetPersonMaritalStatus}
                                options={["casado", "divorciado", "separado", "solteiro", "viuvo"]}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="profession"
                                title="Profissão"
                                isLoading={isLoading}
                                onBlur={handleAutoSave}
                                value={person.profession}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetPersonProfession}
                            />
                        </FormRowColumn>
                    </FormRow>
                </Form>
            </form>

            <ArrayTextForm
                maxLength={15}
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
                    onBlur={handleAutoSave}
                    address={person.address}
                    setAddress={handleSetPersonAddress}
                    subtitle="Informações sobre o endereço"
                />

                {handleActionBar()}
            </form>
        </>
    )
}