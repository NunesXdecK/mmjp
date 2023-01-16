import ActionBar from "./actionBar";
import Button from "../button/button";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { User, defaultUser } from "../../interfaces/objectInterfaces";
import { handleCheckUserEmail, handleCheckUsername } from "../form/userDataForm";
import { handleValidationNotNull, ValidationReturn } from "../../util/validationUtil";

interface UserActionBarFormProps {
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    user?: User,
    onSet?: (any) => void,
    onBeforeSave?: () => void,
    onSetIsLoading?: (boolean) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onAfterSave?: (object, any?, boolean?) => void,
}

export const handleUserForDB = (user: User) => {
    if (user.person?.id?.length > 0) {
        user = { ...user, person: { id: user.person.id } }
    } else {
        user = { ...user, person: {} }
    }
    user = {
        ...user,
        username: user.username?.trim(),
        password: user.password?.trim(),
    }
    return user
}

export const handleSaveUserInner = async (user, history) => {
    let res = { status: "ERROR", id: 0, user: user }
    user = handleUserForDB(user)
    try {
        const saveRes = await fetch("api/user", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: user, history: history }),
        }).then((res) => res.json())
        res = { ...res, status: saveRes.status, id: saveRes.id, user: { ...user, id: saveRes.id } }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export const handleUserValidationForDB = (user: User) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let userNameCheck = handleValidationNotNull(user.username)
    let emailCheck = handleValidationNotNull(user.email)
    let passwordCheck = handleValidationNotNull(user.password)
    let passwordConfirmCheck = handleValidationNotNull(user.passwordConfirm)
    let passwordsEqual = user.password === user.passwordConfirm
    let personCheck = user?.personId > 0 ?? false
    if (!userNameCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo Username está em branco."] }
    }
    if (!emailCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo E-mail está em branco."] }
    }
    if (!passwordCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo Senha está em branco."] }
    }
    /*
    if (!passwordConfirmCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo Confirme a senha está em branco."] }
    }
    */
    if (!passwordsEqual) {
        validation = { ...validation, messages: [...validation.messages, "As senhas estão diferentes"] }
    }
    if (!personCheck) {
        validation = { ...validation, messages: [...validation.messages, "O usuário precisa de dados básicos."] }
    }
    validation = {
        ...validation,
        validation:
            userNameCheck &&
            personCheck &&
            passwordCheck &&
            passwordsEqual
    }
    return validation
}

export const handleUserValidationForDBInner = (user: User, isUsernameValid, isUserEmailValid) => {
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
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            handleSetIsLoading(false)
            return
        }
        user = { ...user, id: res.id }
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
