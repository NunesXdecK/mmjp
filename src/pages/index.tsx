import Head from "next/head"
import { useState } from "react"
import Layout from "../components/layout/layout"
import BudgetPage from "../components/pages/BudgetPage"
import FeedbackPendency from "../components/modal/feedbackPendencyModal"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../components/modal/feedbackMessageModal"

export type PageOps =
    "DASHBOARD"
    | "PERSON" | "COMPANY" | "PROFESSIONAL" | "IMMOBILE" | "USER"
    | "BUDGET"
    | "PROJECT" | "SERVICE" | "SERVICESTAGE" | "PAYMENT"

interface IndexProps {
    page?: any | PageOps
}

export default function Index(props: IndexProps) {
    const [page, setPage] = useState<PageOps>(props.page ?? "BUDGET")
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    let title = ""
    switch (page) {
        default:
            title = "Orçamentos"
            window.history.pushState({}, "", "/budget");
            break
        case "DASHBOARD":
            title = "Dashboard"
            window.history.pushState({}, "", "/dashboard");
            break
        case "PERSON":
            title = "Pessoas"
            window.history.pushState({}, "", "/person");
            break
        case "COMPANY":
            title = "Empresas"
            window.history.pushState({}, "", "/company");
            break
        case "PROFESSIONAL":
            title = "Profissionais"
            window.history.pushState({}, "", "/professional");
            break
        case "IMMOBILE":
            title = "Imovéis"
            window.history.pushState({}, "", "/immobile");
            break
        case "USER":
            title = "Usuários"
            window.history.pushState({}, "", "/user");
            break
        case "BUDGET":
            title = "Orçamentos"
            window.history.pushState({}, "", "/budget");
            break
        case "PROJECT":
            title = "Projetos"
            window.history.pushState({}, "", "/project");
            break
        case "SERVICE":
            title = "Serviços"
            window.history.pushState({}, "", "/service");
            break
        case "SERVICESTAGE":
            title = "Etapas"
            window.history.pushState({}, "", "/servicestage");
            break
        case "PAYMENT":
            title = "Pagamentos"
            window.history.pushState({}, "", "/payment");
            break
    }

    {/*
    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

const [subjectMessage, setSubjectMessage] = useState<SubjectMessage>({
    ...defaultSubjectMessage,
        referenceId: "M8Kvcag59gggzvesKOV2",
        referenceBase: PERSON_COLLECTION_NAME,
    })
    
    useEffect(() => {
        if (isFirst) {
            fetch("api/checkPendencies").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.messages.length) {
                    setMessages(res.messages)
                }
            })
        }
    })
*/}

    return (
        <Layout
            title={title}
            onSetPage={setPage}>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content={title} />
            </Head>

            {page === "DASHBOARD" && (
                <></>
            )}
            {page === "BUDGET" && (
                <BudgetPage
                    onSetPage={setPage}
                    onShowMessage={handleShowMessage}
                />
            )}
            {/*
            <Form>
                <Button
                    isLight
                    onClick={() => {
                        setIsLoading(!isFeedbackOpen)
                    }}
                >
                    <ChatAltIcon
                        aria-hidden="true"
                        className="block text-indigo-600 h-6 w-6"
                    />
                </Button>
            </Form>

            <SubjectMessageFormModal
                isOpen={isLoading}
                setIsOpen={setIsLoading}
                subjectMessage={subjectMessage}
            />
        */}
            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />

            <FeedbackPendency />
        </Layout >
    )
}
