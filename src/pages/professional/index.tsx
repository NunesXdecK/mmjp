import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import ProfessionalForm from "../../components/form/professionalForm"
import { defaultProfessional, Professional } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Professionals() {
    const [title, setTitle] = useState("Lista de profissionais")
    const [professional, setProfessional] = useState<Professional>(defaultProfessional)
    const [professionals, setProfessionals] = useState<Professional[]>([])
    const [professionalsForShow, setProfessionalsForShow] = useState<Professional[]>([])

    const [isLoading, setIsLoading] = useState(true)
    const [isRegister, setIsRegister] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setProfessionals([])
        setProfessionalsForShow([])
        setProfessional(defaultProfessional)
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
        handleShowMessage(feedbackMessage)
        setProfessionals([])
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
        setProfessionalsForShow((old) => listItemsFiltered)
    }

    const handleEditClick = async (professional) => {
        setIsLoading(true)
        let localProfessional = await fetch("api/professional/" + professional.id).then((res) => res.json()).then((res) => res.data)
        console.log(localProfessional)
        setIsRegister(true)
        setProfessional(localProfessional)
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
        if (professionals.length === 0) {
            fetch("api/professionals").then((res) => res.json()).then((res) => {
                setProfessionals(res.list)
                setProfessionalsForShow(res.list)
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
                    isLoading={isLoading}
                    list={professionalsForShow}
                    onNewClick={handleNewClick}
                    onEditClick={handleEditClick}
                    onFilterList={handleFilterList}
                    onDeleteClick={handleDeleteClick}
                    onTitle={(element: Professional) => {
                        return (<p>{element.title}</p>)
                    }}
                    onInfo={(element: Professional) => {
                        return (<p>{element.title}</p>)
                    }}
                />
            ) : (
                <ProfessionalForm
                    isBack={true}
                    professional={professional}
                    onBack={handleBackClick}
                    title="Informações do profissional"
                    onAfterSave={handleAfterSave}
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre o profissional" />
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
