import ActionBar from "./actionBar";
import Button from "../button/button";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleCheckClientCode } from "../inputText/inputClientCode";
import { handleUserValidationForDB } from "../../util/validationUtil";
import { User, defaultUser } from "../../interfaces/objectInterfaces";
import { handleRemoveCEPMask, handleRemoveCPFMask, handleRemoveTelephoneMask } from "../../util/maskUtil";
import { handleCheckUserEmail, handleCheckUsername } from "../form/userDataForm";

interface UserActionBarFormProps {
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    user?: User,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any?, boolean?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export const handleUserForDB = (user: User) => {
    user = {
        ...user,
        username: user.username.trim(),
        password: user.password.trim(),
    }
    return user
}

export const handleSaveUserInner = async (user, history) => {
    let res = { status: "ERROR", id: "", user: user }
    user = handleUserForDB(user)
    try {
        const saveRes = await fetch("api/user", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: user, history: history }),
        }).then((res) => res.json())
        res = { ...res, status: "SUCCESS", id: saveRes.id, user: { ...user, id: saveRes.id } }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export default function UserActionBarForm(props: UserActionBarFormProps) {
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

    const handleUserValidationForDBInner = (user: User, isUsernameValid, isUserEmailValid) => {
        let isValid = handleUserValidationForDB(user)
        if (user.username.length > 0) {
            if (isUsernameValid) {
                isValid = {
                    ...isValid,
                    validation: false,
                    messages: [...isValid.messages, "O username já está em uso."]
                }
            }
        }
        if (user.email.length > 0) {
            if (isUserEmailValid) {
                isValid = {
                    ...isValid,
                    validation: false,
                    messages: [...isValid.messages, "O email já está em uso."]
                }
            }
        }
        return isValid
    }

    const handleSave = async (isForCloseModal) => {
        handleSetIsLoading(true)
        let user = props.user
        let resUN = await handleCheckUsername(user.username, user.id)
        let resEM = await handleCheckUserEmail(user.email, user.id)
        const isValid = handleUserValidationForDBInner(user, resUN.data, resEM.data)
        if (!isValid.validation) {
            handleSetIsLoading(false)
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        let res = await handleSaveUserInner(user, true)
        user = { ...user, id: res.id }
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
            props.onSet(defaultUser)
        } else if (isForCloseModal) {
            props.onSet(user)
        }
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, user, isForCloseModal)
        }
    }

    return (
        <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
            <div className="w-full flex flex-row justify-between">
                <Button
                    isLoading={props.isLoading}
                    onClick={() => handleSave(false)}
                >
                    Salvar
                </Button>
            </div>
        </ActionBar>
    )
}
