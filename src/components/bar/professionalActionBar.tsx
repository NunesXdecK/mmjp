import ActionBar from "./actionBar";
import Button from "../button/button";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleValidationNotNull, ValidationReturn } from "../../util/validationUtil";
import { Professional, defaultProfessional } from "../../interfaces/objectInterfaces";

interface ProfessionalActionBarFormProps {
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    professional?: Professional,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any?, boolean?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export const handleProfessionalValidationForDB = (professional: Professional) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let titleCheck = handleValidationNotNull(professional.title)
    let personCheck = professional?.personId > 0 ?? false
    if (!titleCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo titúlo está em branco."] }
    }
    if (!personCheck) {
        validation = { ...validation, messages: [...validation.messages, "O profissional precisa de dados básicos."] }
    }
    validation = { ...validation, validation: titleCheck && personCheck }
    return validation
}

export const handleProfessionalForDB = (professional: Professional) => {
    if (professional.person?.id?.length > 0) {
        professional = { ...professional, person: { id: professional.person.id } }
    }
    professional = {
        ...professional,
        title: professional.title.trim(),
        creaNumber: professional.creaNumber.trim(),
        credentialCode: professional.credentialCode.trim(),
    }
    return professional
}

export const handleSaveProfessionalInner = async (professional, history) => {
    let res = { status: "ERROR", id: 0, professional: professional }
    professional = handleProfessionalForDB(professional)
    try {
        const saveRes = await fetch("api/professional", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: professional, history: history }),
        }).then((res) => res.json())
        res = { ...res, status: saveRes.status, id: saveRes.id, professional: { ...professional, id: saveRes.id } }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export default function ProfessionalActionBarForm(props: ProfessionalActionBarFormProps) {
    const handleSetIsLoading = (value: boolean) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleSave = async (isForCloseModal) => {
        handleSetIsLoading(true)
        let professional = props.professional
        const isValid = handleProfessionalValidationForDB(professional)
        if (!isValid.validation) {
            handleSetIsLoading(false)
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        let res = await handleSaveProfessionalInner(professional, true)
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            handleSetIsLoading(false)
            return
        }
        professional = { ...professional, id: res.id }
        handleSetIsLoading(false)
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (props.isMultiple && props.onSet) {
            props.onSet(defaultProfessional)
        } else if (isForCloseModal) {
            props.onSet(professional)
        }
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, professional, isForCloseModal)
        }
    }

    return (
        <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
            <div className="w-full flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(true)}
                    >
                        Salvar
                    </Button>
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(false)}
                    >
                        Salvar e sair
                    </Button>
                </div>
            </div>
        </ActionBar>
    )
}
