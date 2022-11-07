import Button from "../button/button";
import UserForm from "../form/userForm";
import { useEffect, useState } from "react";
import WindowModal from "../modal/windowModal";
import { XCircleIcon } from "@heroicons/react/outline";
import { PlusCircleIcon } from "@heroicons/react/solid";
import InputTextAutoComplete from "./inputTextAutocomplete";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { defaultUser, User } from "../../interfaces/objectInterfaces";

interface InputSelectUserProps {
    id?: string,
    title?: string,
    value?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    buttonTitle?: string,
    formClassName?: string,
    validationMessage?: string,
    validationMessageButton?: string,
    isLocked?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    validationButton?: boolean,
    isMultipleSelect?: boolean,
    users?: User[],
    onSet?: (any) => void,
    onBlur?: (any?) => void,
    onFinishAdd?: (any?) => void,
    onSetLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onValidate?: (any) => boolean,
}

export default function InputSelectUser(props: InputSelectUserProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFirst, setIsFirst] = useState(true)
    const [isSelected, setIsSelected] = useState(props.value?.length > 0)
    const [isRegister, setIsRegister] = useState(false)

    const [text, setText] = useState<string>(props.value ?? "")
    const [user, setUser] = useState<User>(defaultUser)

    const [users, setUsers] = useState<User[]>([])

    const handleNewClick = () => {
        setIsOpen(true)
        setIsRegister(false)
        setUser(defaultUser)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setUsers([])
        setUser(defaultUser)
        setIsOpen(false)
        setIsFirst(true)
        setIsRegister(false)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, element) => {
        handleAdd(element)
        handleBackClick()
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleAdd = (user: User) => {
        let canAdd = true
        if (props.onValidate) {
            canAdd = props.onValidate(user)
        }

        if (canAdd) {
            setText(user.username)
            setIsSelected(true)
            if (props.onSet) {
                props.onSet(user)
                setIsOpen(false)
            }
            if (props.onFinishAdd) {
                props.onFinishAdd()
            }
        } else {
            let feedbackMessage: FeedbackMessage = { messages: [props?.validationMessage], messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
    }

    const handlePutActions = (cleanFunction?) => {
        return (
            <Button
                isLight
                isLoading={props.isLoading}
                isDisabled={props.isLoading}
                id={props.id + "-auto-complete-option-new-person"}
                className="py-4 rounded-none text-left shadow-none w-full text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 "
                onClick={() => {
                    handleNewClick()
                    if (cleanFunction) {
                        cleanFunction("")
                    }
                }}
            >
                <div className="w-full text-left flex flex-row gap-1">
                    <PlusCircleIcon className="text-indigo-600 dark:text-gray-200 block h-5 w-5" aria-hidden="true" />
                    Novo usuário
                </div>
            </Button>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/users").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setUsers(res.list)
                }
                if (props.onSetLoading) {
                    props.onSetLoading(false)
                }
            })
        }
    })

    return (
        <>
            <div className="relative">
                <InputTextAutoComplete
                    value={text}
                    id={props.id}
                    sugestions={users}
                    title={props.title}
                    onSetText={setText}
                    onBlur={props.onBlur}
                    onClickItem={handleAdd}
                    isLoading={props.isLoading}
                    onListOptions={handlePutActions}
                    isDisabled={isSelected || props.isDisabled}
                />
                {isSelected && (
                    <Button
                        isLight
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        className="p-0 top-8 right-2 absolute"
                        onClick={() => {
                            setText("")
                            handleAdd(defaultUser)
                            setIsSelected(false)
                        }}
                    >
                        <XCircleIcon className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 h-6 w-6" aria-hidden="true" />
                    </Button>
                )}
            </div>

            <WindowModal
                max
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                id={props.id + "-window-modal-register-person-company"}
                onClose={() => {
                    setIsRegister(false)
                }}
            >
                <>
                    {isOpen && (
                        <UserForm
                            user={user}
                            isBack={true}
                            canMultiple={false}
                            onBack={handleBackClick}
                            title="Informações pessoais"
                            onAfterSave={handleAfterSave}
                            onShowMessage={props.onShowMessage}
                            subtitle="Dados importantes sobre o usuário" />
                    )}
                </>
            </WindowModal>
        </>
    )
}
