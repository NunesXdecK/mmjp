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
import { CPF_MARK, NOT_NULL_MARK, TELEPHONE_MARK, TEXT_NOT_NULL_MARK } from "../../util/patternValidationUtil"

interface PersonFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canAutoSave?: boolean,
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
    const [person, setPerson] = useState<Person>(props?.person ?? defaultPerson)
    const [personOriginal, setPersonOriginal] = useState<Person>(props?.person ?? defaultPerson)
    const [isFormValid, setIsFormValid] = useState(handlePersonValidationForDB(person).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)
    const [isAutoSaving, setIsAutoSaving] = useState(false)

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

    const handleAutoSave = async (event) => {
        if (!props.canAutoSave) {
            return
        }
        if (event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (isAutoSaving) {
            return
        }
        if (!handleDiference()) {
            return
        }
        const isValid = handlePersonValidationForDB(person)
        if (!isValid.validation) {
            return
        }
        setIsAutoSaving(old => true)
        const res = await handleSaveInner(person)
        if (res.status === "ERROR") {
            return
        }
        setIsAutoSaving(old => false)
        setPerson({ ...person, id: res.id })
        setPersonOriginal(old => res.person)
    }

    const handleSaveInner = async (person) => {
        let res = { status: "ERROR", id: "", person: person }
        const personForDB = handlePreparePersonForDB(person)
        try {
            const saveRes = await fetch("api/person", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: personForDB }),
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
        const isValid = handlePersonValidationForDB(person)
        if (!isValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        setIsLoading(true)
        let personFromDB = { ...person }
        if (!handleIsEqual(person, personOriginal)) {
            let res = await handleSaveInner(person)
            if (res.status === "ERROR") {
                const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
                handleShowMessage(feedbackMessage)
                setIsLoading(false)
                return
            }
            setPerson({ ...person, id: res.id })
            setPersonOriginal({ ...person, id: res.id })
            personFromDB = { ...res.person }
        }
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (isMultiple) {
            setPerson(defaultPerson)
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
                isForBackControl
                isLoading={isLoading}
                isDisabled={!isFormValid || isAutoSaving}
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
                                onBlur={handleAutoSave}
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
                                isLoading={isLoading}
                                onBlur={handleAutoSave}
                                title="Codigo de cliente"
                                value={person.clientCode}
                                validation={NOT_NULL_MARK}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetPersonClientCode}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O código não pode ficar em branco."
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
                                onBlur={handleAutoSave}
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
                                onBlur={handleAutoSave}
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
                                onBlur={handleAutoSave}
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
                                onBlur={handleAutoSave}
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
                                onBlur={handleAutoSave}
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
                                onBlur={handleAutoSave}
                                value={person.profession}
                                isDisabled={props.isForDisable}
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