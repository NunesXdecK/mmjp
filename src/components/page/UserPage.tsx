import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid"
import UserDataForm from "../form/userDataForm"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import UserActionBarForm from "../bar/userActionBar"
import { User, defaultUser } from "../../interfaces/objectInterfaces"
import PersonNameListItem from "../list/personNameListItem"

interface UserPageProps {
    id?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canUpdate?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    onSetPage?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function UserPage(props: UserPageProps) {
    const [user, setUser] = useState<User>(defaultUser)
    const [users, setUsers] = useState<User[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
    const [isLoading, setIsLoading] = useState(props.getInfo)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setUser(defaultUser)
        setIndex(-1)
        setIsForShow(false)
        setIsRegister(false)
    }

    const handleDeleteClick = async (user, index) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/userNew", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: user.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const list = [
            ...users.slice(0, (index - 1)),
            ...users.slice(index, users.length),
        ]
        setUsers(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setUser({
            ...defaultUser,
        })
        setIsRegister(true)
        setIndex(-1)
    }

    const handleCloseModal = (value) => {
        setIsRegister(value)
        setIsForShow(value)
    }

    const handleShowClick = (project) => {
        setIsLoading(true)
        setUser({ ...defaultUser, ...project })
        setIsForShow(true)
        setIsLoading(false)
    }

    const handleEditClick = async (user, index?) => {
        setIsLoading(true)
        setIsForShow(false)
        let localUser: User = await fetch("api/user/" + user?.id).then((res) => res.json()).then((res) => res.data)
        localUser = {
            ...localUser,
            passwordConfirm: localUser.password,
        }
        setIsLoading(false)
        setIsRegister(true)
        setUser(localUser)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, user: User, isForCloseModal) => {
        let localIndex = -1
        users.map((element, index) => {
            if (element.id === user.id) {
                localIndex = index
            }
        })
        let list: User[] = [
            user,
            ...users,
        ]
        if (localIndex > -1) {
            list = [
                user,
                ...users.slice(0, localIndex),
                ...users.slice(localIndex + 1, users.length),
            ]
        }
        setUsers((old) => list)
        handleShowMessage(feedbackMessage)
        if (!isForCloseModal) {
            handleBackClick()
            setIndex((old) => -1)
        } else {
            setIndex((old) => 1)
        }
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="2">Nome</FormRowColumn>
                <FormRowColumn unit="2">Username</FormRowColumn>
                <FormRowColumn unit="2">E-mail</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: User) => {
        return (
            <FormRow>
                <FormRowColumn unit="2"><PersonNameListItem id={element.person?.id} /></FormRowColumn>
                <FormRowColumn unit="2">{element.username}</FormRowColumn>
                <FormRowColumn unit="2">{element.email}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/users/").then((res) => res.json()).then((res) => {
                setUsers(res.list ?? [])
                setIsFirst(old => false)
                setIsLoading(false)
            })
        }
    })

    return (
        <>
            <ActionBar className="flex flex-row justify-end">
                <Button
                    isLoading={isLoading}
                    isHidden={!props.canUpdate}
                    isDisabled={props.isDisabled}
                    onClick={() => {
                        setIndex(-1)
                        setIsFirst(true)
                        setIsLoading(true)
                        handleBackClick()
                    }}
                >
                    <RefreshIcon className="block h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                    isLoading={isLoading}
                    onClick={handleNewClick}
                    isHidden={!props.canSave}
                    isDisabled={props.isDisabled}
                >
                    <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                </Button>
            </ActionBar>
            <ListTable
                title="Profissionais"
                isActive={index}
                list={users}
                isLoading={isLoading}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                onShowClick={handleShowClick}
                onEditClick={handleEditClick}
                isDisabled={props.isDisabled}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />
            <WindowModal
                max
                title="Profissional"
                id="service-stage-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                headerBottom={(
                    <>
                        {isRegister && (
                            <div className="p-4 pb-0">
                                <UserActionBarForm
                                    user={user}
                                    onSet={setUser}
                                    isLoading={isLoading}
                                    onSetIsLoading={setIsLoading}
                                    onAfterSave={handleAfterSave}
                                    onShowMessage={handleShowMessage}
                                />
                            </div>
                        )}
                        {isForShow && (
                            <ActionBar
                                className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"
                            >
                                <Button
                                    isLoading={isLoading}
                                    onClick={() => {
                                        handleEditClick(user)
                                    }}
                                >
                                    Editar
                                </Button>
                            </ActionBar>
                        )}
                    </>
                )}
            >
                <>
                    {isRegister && (
                        <UserDataForm
                            isLoading={isLoading}
                            onSet={setUser}
                            user={user}
                        />
                    )}
                    {isForShow && (
                        <></>
                    )}
                </>
            </WindowModal>
        </>
    )
}
