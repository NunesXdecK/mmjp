import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import ActionButtonsForm from "./actionButtonsForm";
import InputCheckbox from "../inputText/inputCheckbox";
import SelectPersonForm from "../select/selectPersonForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import ScrollDownTransition from "../animation/scrollDownTransition";
import FeedbackMessageSaveText from "../modal/feedbackMessageSavingText";
import { defaultProfessional, Professional } from "../../interfaces/objectInterfaces";
import { handleIsEqual, handleProfessionalValidationForDB } from "../../util/validationUtil";
import { defaultElementFromBase, ElementFromBase, handlePrepareProfessionalForDB } from "../../util/converterUtil";

interface ProfessionalFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canAutoSave?: boolean,
    canMultiple?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    professional?: Professional,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProfessionalForm(props: ProfessionalFormProps) {
    const [professionalID, setProfessionalID] = useState(props?.professional?.id?.length ? props?.professional?.id : "")
    const [professional, setProfessional] = useState<Professional>(props?.professional ?? defaultProfessional)
    const [professionalOriginal, setProfessionalOriginal] = useState<Professional>(props?.professional ?? defaultProfessional)
    const [isFormValid, setIsFormValid] = useState(handleProfessionalValidationForDB(professional).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)
    const [isAutoSaving, setIsAutoSaving] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.professional?.oldData ?? defaultElementFromBase)

    const [persons, setPersons] = useState((props?.professional?.person && "id" in props?.professional?.person && props?.professional?.person.id.length) ? [props.professional.person] : [])

    const handleSetProfessionalTitle = (value) => { setProfessional({ ...professional, title: value }) }
    const handleSetProfessionalCreaNumber = (value) => { setProfessional({ ...professional, creaNumber: value }) }
    const handleSetProfessionalCredentialCode = (value) => { setProfessional({ ...professional, credentialCode: value }) }

    const handleOnBack = () => {
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleDiference = (): boolean => {
        let professionalForValid = { ...professional }
        if (persons.length > 0) {
            professionalForValid = { ...professionalForValid, person: persons[0] }
        } else {
            professionalForValid = { ...professionalForValid, person: {} }
        }
        return !handleIsEqual(professionalForValid, professionalOriginal)
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleProfessionalToDB = (professional) => {
        let professionalFinal = { ...professional }
        if (persons.length > 0) {
            professionalFinal = { ...professionalFinal, person: persons[0] }
        } else {
            professionalFinal = { ...professionalFinal, person: {} }
        }
        return professionalFinal
    }

    const handleAutoSave = async (event?) => {
        if (!props.canAutoSave) {
            return
        }
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (isAutoSaving) {
            return
        }
        if (!handleDiference()) {
            return
        }
        let professionalForValid = handleProfessionalToDB(professional)
        const isValid = handleProfessionalValidationForDB(professionalForValid)
        if (!isValid.validation) {
            return
        }
        setIsAutoSaving(old => true)
        const res = await handleSaveInner(professionalForValid, false)
        if (res.status === "ERROR") {
            return
        }
        setIsAutoSaving(old => false)
        setProfessionalID(res.id)
        setProfessionalOriginal(res.professional)
    }

    const handleSaveInner = async (professional, history) => {
        let res = { status: "ERROR", id: "", professional: professional }
        let professionalForDB = handlePrepareProfessionalForDB(professional)
        if (!professionalForDB?.id?.length && professionalID?.length) {
            professionalForDB = { ...professionalForDB, id: professionalID }
        }
        try {
            const saveRes = await fetch("api/professional", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: professionalForDB, history }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, professional: { ...professional, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async () => {
        if (isAutoSaving) {
            return
        }
        let professionalForValid = handleProfessionalToDB(professional)
        const isValid = handleProfessionalValidationForDB(professionalForValid)
        if (!isValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        setIsLoading(true)
        let professionalFromDB = { ...professionalForValid }
        let res = await handleSaveInner(professionalForValid, true)
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            setIsLoading(false)
            return
        }
        setProfessional({ ...professionalForValid, id: res.id })
        setProfessionalOriginal({ ...professionalForValid, id: res.id })
        professionalFromDB = { ...res.professional }
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (isMultiple) {
            setProfessional(defaultProfessional)
        }
        if (!isMultiple && props.onAfterSave) {
            props.onAfterSave(feedbackMessage, professionalFromDB)
        }
        setIsLoading(false)
    }

    const handleActionBar = () => {
        return (
            <ActionButtonsForm
                isLeftOn
                isRightOn
                isForBackControl
                isDisabled={!isFormValid || isAutoSaving}
                rightWindowText="Deseja confirmar as alterações?"
                isForOpenLeft={professional.id !== "" && handleDiference()}
                isForOpenRight={professional.id !== "" && handleDiference()}
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
                        <FormRowColumn unit="6">
                            <InputText
                                id="professionalTitle"
                                isLoading={isLoading}
                                onBlur={handleAutoSave}
                                value={professional.title}
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
                                onBlur={handleAutoSave}
                                isLoading={isLoading}
                                value={professional.creaNumber}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProfessionalCreaNumber}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O numero do crea não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="credentialCode"
                                isLoading={isLoading}
                                onBlur={handleAutoSave}
                                title="Codigo credencial"
                                isDisabled={props.isForDisable}
                                value={professional.credentialCode}
                                onSetText={handleSetProfessionalCredentialCode}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O codigo credencial não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>
                </Form>
            </form>

            <SelectPersonForm
                persons={persons}
                isLoading={isLoading}
                title="Dados pessoais"
                formClassName="p-1 m-3"
                onSetPersons={setPersons}
                subtitle="Selecione a pessoa"
                buttonTitle="Adicionar pessoa"
                onShowMessage={props.onShowMessage}
                validationButton={persons.length === 1}
                validationMessage="Esta pessoa já é um proprietário"
                validationMessageButton="Você não pode mais adicionar pessoas"
            />

            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>
                {handleActionBar()}
            </form>
        </>
    )
}