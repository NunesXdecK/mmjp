import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import ProfessionalView from "../../components/view/professionalView"
import ProfessionalForm from "../../components/form/professionalForm"
import { defaultProfessional, Professional } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import FeedbackPendency from "../../components/modal/feedbackPendencyModal"

export default function Professionals() {
    const [title, setTitle] = useState("Lista de profissionais")
    const [professional, setProfessional] = useState<Professional>(defaultProfessional)
    const [professionals, setProfessionals] = useState<Professional[]>([])
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
        setProfessionals([])
        setProfessional(defaultProfessional)
        setIsFirst(true)
        setIsLoading(true)
        setIsRegister(false)
        setTitle("Lista de profissionais")
    }

    const handleDeleteClick = async (professional) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/professional", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: professional.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const index = professionals.indexOf(professional)
        const list = [
            ...professionals.slice(0, index),
            ...professionals.slice(index + 1, professionals.length),
        ]
        setProfessionals(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = () => {
        setIsRegister(true)
        setProfessional(defaultProfessional)
        setTitle("Novo profissional")
    }

    const handleFilterList = (string) => {
        let listItems = [...professionals]
        let listItemsFiltered: Professional[] = []
        listItemsFiltered = listItems.filter((element: Professional, index) => {
            return element.title.toLowerCase().includes(string.toLowerCase())
        })
        return listItemsFiltered
    }

    const handleEditClick = async (professional) => {
        setIsLoading(true)
        let localProfessional = await fetch("api/professional/" + professional.id).then((res) => res.json()).then((res) => res.data)
        setIsRegister(true)
        setProfessional({ ...defaultProfessional, ...localProfessional })
        setTitle("Editar empresa")
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
            fetch("api/professionals").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setProfessionals(res.list)
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
                    onSetElement={setProfessional}
                    onFilterList={handleFilterList}
                    onDeleteClick={handleDeleteClick}
                    deleteWindowTitle={"Deseja realmente deletar " + professional.title + "?"}
                    onTitle={(element: Professional) => {
                        return (
                            <ProfessionalView
                                title=""
                                hideData
                                hideBorder
                                hidePaddingMargin
                                professional={element}
                            />
                        )
                    }}
                    onInfo={(element: Professional) => {
                        return (<ProfessionalView classNameContentHolder="" elementId={element.id} />)
                    }}
                />
            ) : (
                <ProfessionalForm
                    canMultiple
                    canAutoSave
                    isBack={true}
                    onBack={handleBackClick}
                    professional={professional}
                    onAfterSave={handleAfterSave}
                    title="Informações do profissional"
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre o profissional" />
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
