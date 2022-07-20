import Head from "next/head"
import { useEffect, useState } from "react"
import Layout from "../../components/layout/layout"
import ImmobileForm from "../../components/form/immobileForm"
import ImmobileList from "../../components/list/immobileList"
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import List from "../../components/list/list"

export default function Properties() {
    const [title, setTitle] = useState("Lista de imóveis")
    const [immobile, setImmobile] = useState<Immobile>(defaultImmobile)
    const [immobiles, setImmobiles] = useState<Immobile[]>([])
    const [immobilesForShow, setImmobilesForShow] = useState<Immobile[]>([])

    const [isLoading, setIsLoading] = useState(true)
    const [isRegister, setIsRegister] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setImmobiles([])
        setImmobilesForShow([])
        setImmobile(defaultImmobile)
        setIsLoading(true)
        setIsRegister(false)
        setTitle("Lista de imóveis")
    }

    const handleDeleteClick = async (immobile) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/immobile", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: immobile.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        handleShowMessage(feedbackMessage)
        setImmobiles([])
    }

    const handleNewClick = () => {
        setIsRegister(true)
        setImmobile(defaultImmobile)
        setTitle("Novo imóvel")
    }

    const handleFilterList = (string) => {
        let listItems = [...immobiles]
        let listItemsFiltered: Immobile[] = []
        listItemsFiltered = listItems.filter((element: Immobile, index) => {
            return element.name.toLowerCase().includes(string.toLowerCase())
        })
        setImmobilesForShow((old) => listItemsFiltered)
    }

    const handleEditClick = async (immobile) => {
        let localImmobile = await fetch("api/immobile/" + immobile.id).then((res) => res.json()).then((res) => res.data)
        console.log(localImmobile)
        setIsRegister(true)
        setImmobile(localImmobile)
        setTitle("Editar Imóvel")
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
        if (immobiles.length === 0) {
            fetch("api/immobiles").then((res) => res.json()).then((res) => {
                setImmobiles(res.list)
                setImmobilesForShow(res.list)
                setIsLoading(false)
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
                    list={immobilesForShow}
                    isLoading={isLoading}
                    onNewClick={handleNewClick}
                    onEditClick={handleEditClick}
                    onFilterList={handleFilterList}
                    onDeleteClick={handleDeleteClick}
                    onTitle={(element: Immobile) => {
                        return (<p>{element.name}</p>)
                    }}
                    onInfo={(element: Immobile) => {
                        return (<p>{element.name}</p>)
                    }}
                />
            ) : (
                <ImmobileForm
                    canMultiple
                    isBack={true}
                    immobile={immobile}
                    onBack={handleBackClick}
                    title="Informações do imóvel"
                    onAfterSave={handleAfterSave}
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre o imóvel" />
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
