import FormRow from "../form/formRow"
import Button from "../button/button"
import UserView from "../view/userView"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import UserDataForm from "../form/userDataForm"
import FormRowColumn from "../form/formRowColumn"
import { PlusIcon } from "@heroicons/react/solid"
import NavBar, { NavBarPath } from "../bar/navBar"
import UserStatusButton from "../button/userStatusButton"
import PersonNameListItem from "../list/personNameListItem"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { User, defaultUser } from "../../interfaces/objectInterfaces"
import UserActionBarForm, { handleSaveUserInner } from "../bar/userActionBar"

interface UserPageProps {
    id?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canDelete?: boolean,
    canUpdate?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    prevPath?: NavBarPath[],
    onSetPage?: (any) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function UserPage(props: UserPageProps) {
    const [user, setUser] = useState<User>(defaultUser)
    const [users, setUsers] = useState<User[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
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

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleDeleteClick = async (user, index) => {
        handleSetIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/user", {
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
        handleSetIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleStatusClick = async (element, value) => {
        const user: User = {
            ...element,
            isBlocked: value,
        }
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
        handleSetIsLoading(true)
        const res = await handleSaveUserInner(user, true)
        handleSetIsLoading(false)
        if (res.status === "ERROR") {
            handleShowMessage(feedbackMessage)
            return
        }
        feedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleAfterSave(feedbackMessage, user, true)
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
        handleSetIsLoading(true)
        setUser({ ...defaultUser, ...project })
        setIsForShow(true)
        handleSetIsLoading(false)
    }

    const handleEditClick = async (user, index?) => {
        handleSetIsLoading(true)
        setIsForShow(false)
        let localUser: User = await fetch("api/user/" + user?.id).then((res) => res.json()).then((res) => res.data)
        localUser = {
            ...localUser,
            passwordConfirm: localUser?.password,
        }
        handleSetIsLoading(false)
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

    const handlePutModalTitle = (short: boolean) => {
        let paths = []
        let path: NavBarPath = { path: "Novo usuário", onClick: null }
        if (short) {
            //path = { ...path, path: "S" }
        }
        if (user.id?.length > 0) {
            path = { ...path, path: "Usuário-" + user.username, onClick: null }
        }
        try {
            if (props.prevPath?.length > 0) {
                let prevPath: NavBarPath = {
                    ...props.prevPath[props.prevPath?.length - 1],
                    onClick: handleBackClick,
                    path: props.prevPath[props.prevPath?.length - 1]?.path + "/",
                }
                paths = [...props.prevPath.slice(0, props.prevPath?.length - 1), prevPath,]
            }
            paths = [...paths, path]
        } catch (err) {
            console.error(err)
        }
        if (short) {
            return paths
        } else {
            return (
                <>
                    {paths?.length > 0 ? (<NavBar pathList={paths} />) : path.path}
                </>
            )
        }
    }

    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="2">Nome</FormRowColumn>
                <FormRowColumn unit="1">Username</FormRowColumn>
                <FormRowColumn unit="2">E-mail</FormRowColumn>
                <FormRowColumn unit="1"></FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: User) => {
        return (
            <FormRow>
                <FormRowColumn unit="2"><PersonNameListItem id={element.person?.id} /></FormRowColumn>
                <FormRowColumn unit="1">{element.username}</FormRowColumn>
                <FormRowColumn unit="2">{element.email}</FormRowColumn>
                <FormRowColumn unit="1">
                    <UserStatusButton
                        user={element}
                        id={element.id}
                        onAfter={handleAfterSave}
                        isDisabled={props.isDisabled}
                        value={element.isBlocked ? "BLOQUEADO" : "ATIVO"}
                        onClick={async (value) => {
                            handleStatusClick(element, (value === "ATIVO" ? false : true))
                        }}
                    />
                </FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/users/").then((res) => res.json()).then((res) => {
                setUsers(res.list ?? [])
                setIsFirst(old => false)
                handleSetIsLoading(false)
            })
        }
    })

    return (
        <>
            <ActionBar
                isHidden={!props.canSave}
                className="flex flex-row justify-end"
            >
                <Button
                    isLoading={props.isLoading}
                    onClick={handleNewClick}
                    isHidden={!props.canSave}
                    isDisabled={props.isDisabled}
                >
                    <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                </Button>
            </ActionBar>
            <ListTable
                list={users}
                title="Usuarios"
                isActive={index}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                isLoading={props.isLoading}
                canDelete={props.canDelete}
                onShowClick={handleShowClick}
                onEditClick={handleEditClick}
                isDisabled={props.isDisabled}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />
            <WindowModal
                max
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                id="service-stage-register-modal"
                title={(handlePutModalTitle(false))}
                headerBottom={(
                    <div className="p-4 pb-0">
                        {isRegister && (
                            <UserActionBarForm
                                user={user}
                                onSet={setUser}
                                isLoading={props.isLoading}
                                onSetIsLoading={handleSetIsLoading}
                                onAfterSave={handleAfterSave}
                                onShowMessage={handleShowMessage}
                            />
                        )}
                        {isForShow && (
                            <ActionBar
                                className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"
                            >
                                <Button
                                    isLoading={props.isLoading}
                                    onClick={() => {
                                        handleEditClick(user)
                                    }}
                                >
                                    Editar
                                </Button>
                            </ActionBar>
                        )}
                    </div>
                )}
            >
                <>
                    {isRegister && (
                        <UserDataForm
                            user={user}
                            onSet={setUser}
                            isLoading={props.isLoading}
                            prevPath={(handlePutModalTitle(true))}
                        />
                    )}
                    {isForShow && (
                        <UserView elementId={user.id} />
                    )}
                </>
            </WindowModal>
        </>
    )
}
