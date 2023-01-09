import ActionBar from "./actionBar";
import Button from "../button/button";
import { handleCheckPointId } from "../inputText/inputPointId";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { ImmobilePoint, defaultImmobilePoint } from "../../interfaces/objectInterfaces";
import { handleValidationOnlyTextNotNull, ValidationReturn } from "../../util/validationUtil";

interface ImmobilePointActionBarFormProps {
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    immobilePoint?: ImmobilePoint,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any?, boolean?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export const handleImmobilePointValidationForDB = (immobilePoint: ImmobilePoint) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let pointCheck = true
    if (!handleValidationOnlyTextNotNull(immobilePoint?.pointId)) {
        validation = { ...validation, messages: [...validation.messages, "O campo nome está em branco."] }
        pointCheck = false
    }
    validation = { ...validation, validation: pointCheck }
    return validation
}

export const handleImmobilePointValidationForDBInner = (immobilePoint: ImmobilePoint, isSearching) => {
    let isValid = handleImmobilePointValidationForDB(immobilePoint)
    if (immobilePoint?.pointId?.toString().length > 0) {
        if (isSearching) {
            isValid = {
                ...isValid,
                validation: false,
                messages: [...isValid.messages, "O id do ponto já está em uso."]
            }
        }
    }
    return isValid
}

export const handleImmobilePointForDB = (immobilePoint: ImmobilePoint) => {
    immobilePoint = {
        ...immobilePoint,
    }
    return immobilePoint
}

export const handleSaveImmobilePointInner = async (immobilePoint, history) => {
    let res = { status: "ERROR", id: 0, immobilePoint: immobilePoint }
    immobilePoint = handleImmobilePointForDB(immobilePoint)
    try {
        const saveRes = await fetch("api/point", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: immobilePoint, history: history }),
        }).then((res) => res.json())
        if (saveRes.status === "SUCCESS") {
            res = { ...res, status: "SUCCESS", id: saveRes.id, immobilePoint: { ...immobilePoint, id: saveRes.id } }
        }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export default function ImmobilePointActionBarForm(props: ImmobilePointActionBarFormProps) {
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
        let immobilePoint = props.immobilePoint
        let resPI = await handleCheckPointId(immobilePoint.pointId, immobilePoint.id)
        const isValid = handleImmobilePointValidationForDBInner(immobilePoint, resPI.data)
        if (!isValid.validation) {
            handleSetIsLoading(false)
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        let res = await handleSaveImmobilePointInner(immobilePoint, true)
        immobilePoint = { ...immobilePoint, id: res.id }
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            handleSetIsLoading(false)
            return
        }
        handleSetIsLoading(false)
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (props.isMultiple && props.onSet) {
            props.onSet(defaultImmobilePoint)
        } else if (isForCloseModal) {
            props.onSet(immobilePoint)
        }
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, immobilePoint, isForCloseModal)
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
