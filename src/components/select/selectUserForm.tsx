import Form from "../form/form";
import List from "../list/list";
import FormRow from "../form/formRow";
import Button from "../button/button";
import UserForm from "../form/userForm";
import IOSModal from "../modal/iosModal";
import { useEffect, useState } from "react";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import FormRowColumn from "../form/formRowColumn";
import FeedbackMessageText from "../modal/feedbackMessageText";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { defaultUser, User } from "../../interfaces/objectInterfaces";
import { defaultFeedbackMessage, FeedbackMessage } from "../modal/feedbackMessageModal";
import UserView from "../view/userView";

interface SelectUserFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    buttonTitle?: string,
    formClassName?: string,
    validationMessage?: string,
    validationMessageButton?: string,
    isLocked?: boolean,
    isLoading?: boolean,
    validationButton?: boolean,
    isMultipleSelect?: boolean,
    users?: User[],
    onFinishAdd?: (any?) => void,
    onSetLoading?: (any) => void,
    onSetUsers?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onValidate?: (any) => boolean,
}

export default function SelectUserForm(props: SelectUserFormProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const [editIndex, setEditIndex] = useState(-1)

    const [user, setUser] = useState<User>(defaultUser)

    const [users, setUsers] = useState<User[]>([])

    const handleNewClick = () => {
        setIsRegister(true)
        setUser(defaultUser)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setUsers([])
        setUser(defaultUser)
        setIsFirst(true)
        setIsRegister(false)
    }

    const handleFilterList = (string) => {
        let listItems = [...users]
        let listItemsFiltered: User[] = []
        listItemsFiltered = listItems.filter((element: User, index) => {
            return element.username.toLowerCase().includes(string.toLowerCase())
                || element.email.toLowerCase().includes(string.toLowerCase())
        })
        return listItemsFiltered
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, user) => {
        handleAdd(user)
        handleBackClick()
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleAdd = (user) => {
        let localUsers = props.users
        let canAdd = true

        localUsers?.map((element, index) => {
            if (element.username === user.username
                || element.email === user.email) {
                canAdd = false
            }
        })

        if (props.onValidate) {
            canAdd = props.onValidate(user)
        }

        if (canAdd) {
            if (props.isMultipleSelect) {
                if (editIndex > -1) {
                    localUsers = [
                        ...localUsers.slice(0, editIndex),
                        user,
                        ...localUsers.slice(editIndex + 1, localUsers.length),
                    ]
                } else {
                    localUsers = [...localUsers, user]
                }
            } else {
                localUsers = [user]
            }
            setEditIndex(-1)
            if (props.onSetUsers) {
                props.onSetUsers(localUsers)
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

    const handleRemoveUser = () => {
        if (!props.isMultipleSelect) {
            props.onSetUsers([])
        } else {
            let localUsers = props.users
            if (localUsers.length > -1) {
                let index = localUsers.indexOf(user)
                localUsers.splice(index, 1)
                if (props.onSetUsers) {
                    props.onSetUsers(localUsers)
                }
            }
        }
        setUser(defaultUser)
    }

    useEffect(() => {
        if (isOpen && isFirst) {
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
            <Form
                title={props.title}
                subtitle={props.subtitle}
                className={props.formClassName}
            >
                {!props.isLocked && (
                    <FormRow>
                        <FormRowColumn unit="6" className="flex flex-col items-end justify-self-end">
                            <Button
                                type="submit"
                                className="w-fit"
                                isLoading={props.isLoading}
                                isDisabled={props.isLoading}
                                onClick={() => {
                                    if (props.validationButton) {
                                        setIsInvalid(true)
                                        setTimeout(() => setIsInvalid((old) => false), 2000)
                                    } else {
                                        setIsOpen(true)
                                    }
                                }}
                            >
                                {props.buttonTitle}
                            </Button>
                            <FeedbackMessageText
                                isOpen={isInvalid}
                                setIsOpen={setIsInvalid}
                                feedbackMessage={
                                    {
                                        ...defaultFeedbackMessage,
                                        messages: [props.validationMessageButton],
                                        messageType: "ERROR"
                                    }} />
                        </FormRowColumn>
                    </FormRow>
                )}

                {props.users?.map((element, index) => (
                    <form key={index + element.dateInsertUTC}
                        onSubmit={(event) => {
                            event.preventDefault()
                            setUser(element)
                            setIsOpenDelete(true)
                        }}>
                        <FormRow>
                            <FormRowColumn unit="3">
                                <InputText
                                    title="Username"
                                    isDisabled={true}
                                    value={element.username}
                                    isLoading={props.isLoading}
                                    id={"user-name-" + index}
                                />
                            </FormRowColumn>

                            <FormRowColumn unit="3" className="flex flex-col sm:flex-row">
                                <InputText
                                    isDisabled={true}
                                    title="E-mail"
                                    isLoading={props.isLoading}
                                    value={element.email}
                                    id={"user-email-" + index}
                                />

                                {!props.isLocked && (
                                    <div className="min-w-fit flex-col mt-4 sm:mt-0 self-end">
                                        <Button
                                            type="button"
                                            isLoading={props.isLoading}
                                            isDisabled={props.isLoading}
                                            className="ml-2 h-fit self-end"
                                            onClick={(event) => {
                                                event.preventDefault()
                                                setEditIndex(index)
                                                setIsOpen(true)
                                            }}
                                        >
                                            <PencilAltIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                        </Button>
                                        <Button
                                            color="red"
                                            type="submit"
                                            isLoading={props.isLoading}
                                            isDisabled={props.isLoading}
                                            className="ml-2 h-fit self-end"
                                        >
                                            <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                        </Button>
                                    </div>
                                )}
                            </FormRowColumn>
                        </FormRow>
                    </form>
                ))}
            </Form>

            <IOSModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <>
                    {isOpen && (
                        <>
                            {!isRegister ? (
                                <List
                                    haveNew
                                    canSelect
                                    autoSearch
                                    onSelectClick={handleAdd}
                                    isLoading={props.isLoading}
                                    onNewClick={handleNewClick}
                                    onFilterList={handleFilterList}
                                    title={"Lista de profissionais"}
                                    onTitle={(element: User) => {
                                        return (
                                            <UserView
                                                title=""
                                                hideData
                                                hideBorder
                                                hidePaddingMargin
                                                user={element}
                                            />)
                                    }}
                                    onInfo={(element: User) => {
                                        return (<p>{element.username}</p>)
                                    }}
                                    onShowMessage={props.onShowMessage}
                                />
                            ) : (
                                <UserForm
                                    isBack={true}
                                    canMultiple={false}
                                    onBack={handleBackClick}
                                    user={user}
                                    onAfterSave={handleAfterSave}
                                    title="Informações do profisisonal"
                                    onShowMessage={props.onShowMessage}
                                    subtitle="Dados importantes sobre o profissional" />
                            )}
                        </>
                    )}
                </>
            </IOSModal>

            <WindowModal
                isOpen={isOpenDelete}
                setIsOpen={setIsOpenDelete}>
                <p className="text-center">Deseja realmente deletar {user.username}?</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={(event) => {
                            event.preventDefault()
                            setIsOpenDelete(false)
                        }}
                    >
                        Voltar
                    </Button>
                    <Button
                        color="red"
                        type="submit"
                        onClick={(event) => {
                            event.preventDefault()
                            handleRemoveUser()
                            setIsOpenDelete(false)
                        }}
                    >
                        Excluir
                    </Button>
                </div>
            </WindowModal>
        </>
    )
}
