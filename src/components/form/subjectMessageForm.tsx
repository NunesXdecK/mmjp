import Form from "./form"
import FormRow from "./formRow"
import { useState } from "react"
import FormRowColumn from "./formRowColumn"
import ActionButtonsForm from "./actionButtonsForm"
import InputCheckbox from "../inputText/inputCheckbox"
import InputTextArea from "../inputText/inputTextArea"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import ScrollDownTransition from "../animation/scrollDownTransition"
import FeedbackMessageSaveText from "../modal/feedbackMessageSavingText"
import { handlePrepareSubjectMessageForDB } from "../../util/converterUtil"
import { defaultSubjectMessage, SubjectMessage } from "../../interfaces/objectInterfaces"
import { handleIsEqual, handleSubjectMessageValidationForDB } from "../../util/validationUtil"

interface SubjectMessageFormProps {
    title?: string,
    subtitle?: string,
    className?: string,
    isBack?: boolean,
    isMultiple?: boolean,
    canAutoSave?: boolean,
    canMultiple?: boolean,
    isDisabled?: boolean,
    isForOldRegister?: boolean,
    haveActionButtons?: boolean,
    subjectMessage?: SubjectMessage,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectSubjectMessage?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SubjectMessageForm(props: SubjectMessageFormProps) {
    const [subjectMessageID, setSubjectMessageID] = useState(props?.subjectMessage?.id?.length ? props?.subjectMessage?.id : "")
    const [subjectMessage, setSubjectMessage] = useState<SubjectMessage>(props?.subjectMessage ?? defaultSubjectMessage)
    const [subjectMessageOriginal, setSubjectMessageOriginal] = useState<SubjectMessage>(props?.subjectMessage ?? defaultSubjectMessage)
    const [isFormValid, setIsFormValid] = useState(handleSubjectMessageValidationForDB(subjectMessage).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(props.isMultiple)
    const [isAutoSaving, setIsAutoSaving] = useState(false)

    const handleSetSubjectMessageText = (value) => { setSubjectMessage({ ...subjectMessage, text: value }) }

    const handleOnBack = () => {
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleDiference = (): boolean => {
        return !handleIsEqual(subjectMessage, subjectMessageOriginal)
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(old => isValid)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handlePrepareSubjectMessageForDBInner = (subjectMessage) => {
        let subjectMessageForDB = { ...subjectMessage }
        if (!subjectMessageForDB?.id?.length && subjectMessageID?.length) {
            subjectMessageForDB = { ...subjectMessageForDB, id: subjectMessageID }
        }
        subjectMessageForDB = handlePrepareSubjectMessageForDB(subjectMessageForDB)
        return subjectMessageForDB
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
        const isValid = handleSubjectMessageValidationForDB(subjectMessage)
        if (!isValid.validation) {
            return
        }
        setIsAutoSaving(old => true)
        const res = await handleSaveInner(subjectMessage, false)
        if (res.status === "ERROR") {
            return
        }
        setIsAutoSaving(old => false)
        setSubjectMessageID(res.id)
        setSubjectMessageOriginal(old => res.subjectMessage)
    }

    const handleSaveInner = async (subjectMessage, history) => {
        let res = { status: "ERROR", id: "", subjectMessage: subjectMessage }
        let subjectMessageForDB = handlePrepareSubjectMessageForDBInner(subjectMessage)
        try {
            const saveRes = await fetch("api/subjectMessage", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: subjectMessageForDB, history }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, subjectMessage: { ...subjectMessage, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async () => {
        if (isAutoSaving) {
            return
        }
        const isValid = handleSubjectMessageValidationForDB(subjectMessage)
        if (!isValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        setIsLoading(true)
        let subjectMessageFromDB = { ...subjectMessage }
        let res = await handleSaveInner(subjectMessage, true)
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            setIsLoading(false)
            return
        }
        setSubjectMessage({ ...subjectMessage, id: res.id })
        setSubjectMessageOriginal({ ...subjectMessage, id: res.id })
        subjectMessageFromDB = { ...res.subjectMessage }
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, subjectMessageFromDB)
        }
        if (isMultiple) {
            setSubjectMessage({ ...res.subjectMessage, text: "", id: "" })
            setSubjectMessageOriginal({ ...res.subjectMessage, text: "", id: "" })
            setSubjectMessageID("")
        }
        setIsLoading(false)
    }

    const handleActionBar = () => {
        return (
            <>
                {props.haveActionButtons && (
                    <ActionButtonsForm
                        isRightOn
                        isForBackControl
                        isLoading={isLoading}
                        isLeftOn={props.isBack}
                        rightButtonText={"Enviar"}
                        actionBarClassName="shadow-none py-0"
                        isDisabled={!isFormValid || isAutoSaving}
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
                )}
            </>
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
                    subtitle={props.subtitle}
                    className={props.className}
                >

                    {props.canMultiple && (
                        <FormRow
                        >
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
                        <FormRowColumn unit="6">
                            <InputTextArea
                                title="Mensagem"
                                isLoading={isLoading}
                                onBlur={handleAutoSave}
                                id="subject-message-text"
                                value={subjectMessage.text}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetSubjectMessageText}
                                onValidate={handleChangeFormValidation}
                            />
                        </FormRowColumn>
                    </FormRow>


                    {handleActionBar()}
                </Form>
            </form>

            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>
            </form>
        </>
    )
}