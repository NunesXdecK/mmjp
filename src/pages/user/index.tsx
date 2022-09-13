import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import UserView from "../../components/view/userView"
import UserForm from "../../components/form/userForm"
import { defaultUser, User } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import FeedbackPendency from "../../components/modal/feedbackPendencyModal"

export default function Users() {
    const [title, setTitle] = useState("Lista de usuários")
    const [user, setUser] = useState<User>(defaultUser)
    const [users, setUsers] = useState<User[]>([])
    const [messages, setMessages] = useState<string[]>([])

    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isRegister, setIsRegister] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setUsers([])
        setUser(defaultUser)
        setIsFirst(true)
        setIsLoading(true)
        setIsRegister(false)
        setTitle("Lista de usuários")
    }

    const handleDeleteClick = async (user) => {
        setIsLoading(true)
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
        const index = users.indexOf(user)
        const list = [
            ...users.slice(0, index),
            ...users.slice(index + 1, users.length),
        ]
        setUsers(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = () => {
        setIsRegister(true)
        setUser(defaultUser)
        setTitle("Novo usuário")
    }

    const handleFilterList = (string) => {
        let listItems = [...users]
        let listItemsFiltered: User[] = []
        listItemsFiltered = listItems.filter((element: User, index) => {
            return element.username.toLowerCase().includes(string.toLowerCase())
        })
        return listItemsFiltered
    }

    const handleEditClick = async (user) => {
        setIsLoading(true)
        let localUser = await fetch("api/user/" + user.id).then((res) => res.json()).then((res) => res.data)
        setIsRegister(true)
        setUser({ ...defaultUser, ...localUser })
        setTitle("Editar usuário")
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage) => {
        handleBackClick()
        handleShowMessage(feedbackMessage)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/users").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setUsers(res.list)
                }
                setIsLoading(false)
            })
            fetch("api/checkPendencies").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.messages.length) {
                    setMessages(res.messages)
                }
            })
        }
    })

    return (
        <Layout
            title={title}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={title} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {!isRegister ? (
                <List
                    haveNew
                    canEdit
                    canDelete
                    canSeeInfo
                    autoSearch
                    title={title}
                    isLoading={isLoading}
                    onNewClick={handleNewClick}
                    onEditClick={handleEditClick}
                    onSetElement={setUser}
                    onFilterList={handleFilterList}
                    onDeleteClick={handleDeleteClick}
                    deleteWindowTitle={"Deseja realmente deletar " + user.username + "?"}
                    onTitle={(element: User) => {
                        return (
                            <UserView
                                title=""
                                hideData
                                hideBorder
                                hidePaddingMargin
                                user={element}
                            />
                        )
                    }}
                    onInfo={(element: User) => {
                        return (<UserView classNameContentHolder="" elementId={element.id} />)
                    }}
                />
            ) : (
                <UserForm
                    canMultiple
                    canAutoSave
                    isBack={true}
                    onBack={handleBackClick}
                    user={user}
                    onAfterSave={handleAfterSave}
                    title="Informações do usuário"
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre o usuário" />
            )}

            <FeedbackPendency messages={messages} />

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                setIsOpen={setIsFeedbackOpen}
                feedbackMessage={feedbackMessage}
            />
        </Layout>
    )
}
