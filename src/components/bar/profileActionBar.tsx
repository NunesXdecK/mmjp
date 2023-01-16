import ActionBar from "./actionBar";
import Button from "../button/button";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { User, Person } from "../../interfaces/objectInterfaces";
import { handleCheckUserEmail, handleCheckUsername } from "../form/userDataForm";
import { handleSaveUserInner, handleUserValidationForDBInner } from "./userActionBar";
import { handlePersonValidationForDB, handleSavePersonInner } from "./personActionBar";

interface ProfileActionBarFormProps {
    className?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    user?: User,
    person?: Person,
    onAfterSave?: () => void,
    onSetUser?: (any) => void,
    onSetPerson?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProfileActionBarForm(props: ProfileActionBarFormProps) {
    const handleSetUser = (value: User) => {
        if (props.onSetUser) {
            props.onSetUser(value)
        }
    }

    const handleSetPerson = (value: Person) => {
        if (props.onSetPerson) {
            props.onSetPerson(value)
        }
    }

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

    const handleSave = async () => {
        handleSetIsLoading(true)
        let user = props.user
        let person = props.person
        let resUN = await handleCheckUsername(user.username, user.id)
        let resEM = await handleCheckUserEmail(user.email, user.id)
        const isValidUser = handleUserValidationForDBInner(user, resUN.data, resEM.data)
        const isValidPerson = handlePersonValidationForDB(person)
        if (!isValidUser.validation || !isValidPerson.validation) {
            handleSetIsLoading(false)
            const feedbackMessage: FeedbackMessage = { messages: [...isValidUser.messages, ...isValidPerson.messages], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        let resPerson = await handleSavePersonInner(person, true)
        if (resPerson.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            handleSetIsLoading(false)
            return
        }
        let resUser = await handleSaveUserInner(user, true)
        if (resUser.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            handleSetIsLoading(false)
            return
        }
        user = { ...user, person: { id: resPerson.id } }
        handleSetIsLoading(false)
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        handleSetUser(user)
        if (props.onAfterSave) {
            props.onAfterSave()
        }
    }

    return (
        <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
            <div className="w-full flex flex-row justify-between">
                <Button
                    isLoading={props.isLoading}
                    onClick={() => handleSave()}
                >
                    Salvar
                </Button>
            </div>
        </ActionBar>
    )
}
