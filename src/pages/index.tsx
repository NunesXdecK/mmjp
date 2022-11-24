import Head from "next/head"
import { useState } from "react"
import Layout from "../components/layout/layout"
import BudgetPage from "../components/page/BudgetPage"
import PaymentPage from "../components/page/PaymentPage"
import ServicePage from "../components/page/ServicePage"
import ProjectPage from "../components/page/ProjectPage"
import ServiceStagePage from "../components/page/ServiceStagePage"
import PersonPage from "../components/page/PersonPage"
import CompanyPage from "../components/page/CompanyPage"
import ProfessionalPage from "../components/page/ProfessionalPage"
import ImmobilePage from "../components/page/ImmobilePage"
import UserPage from "../components/page/UserPage"
import ProfilePage from "../components/page/ProfilePage"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../components/modal/feedbackMessageModal"

export type PageOps =
    "DASHBOARD"
    | "PROFILE"
    | "PERSON" | "COMPANY" | "PROFESSIONAL" | "IMMOBILE" | "USER"
    | "BUDGET"
    | "PROJECT" | "SERVICE" | "SERVICESTAGE" | "PAYMENT"

interface IndexProps {
    page?: any | PageOps
}

export default function Index(props: IndexProps) {
    const [page, setPage] = useState<PageOps>(props.page ?? "DASHBOARD")
    const [isLoading, setIsLoading] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [checkPendencies, setCheckPendencies] = useState(true)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (feedbackMessage && isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    let title = ""
    switch (page) {
        default:
            title = "Dashboard"
            window.history.pushState({}, "", "/dashboard");
            break
        case "DASHBOARD":
            title = "Dashboard"
            window.history.pushState({}, "", "/dashboard");
            break
        case "PROFILE":
            title = "Perfil"
            window.history.pushState({}, "", "/profile");
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
            onSetPage={setPage}
            isLoading={isLoading}
            check={checkPendencies}
            onSetIsLoading={setIsLoading}
            onSetCheck={setCheckPendencies}
        >
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content={title} />
            </Head>
            {page === "DASHBOARD" && (
                <div className="dark:text-gray-200 py-48 flex flex-row items-center justify-center">
                    {title}
                </div>
            )}
            {page === "PROFILE" && (
                <ProfilePage
                    getInfo
                    canSave
                    onSetPage={setPage}
                    isLoading={isLoading}
                    onSetIsLoading={setIsLoading}
                    onShowMessage={handleShowMessage}
                />
            )}
            {page === "PERSON" && (
                <PersonPage
                    getInfo
                    canSave
                    canUpdate
                    onSetPage={setPage}
                    isLoading={isLoading}
                    onSetIsLoading={setIsLoading}
                    onShowMessage={handleShowMessage}
                />
            )}
            {page === "COMPANY" && (
                <CompanyPage
                    getInfo
                    canSave
                    canUpdate
                    onSetPage={setPage}
                    isLoading={isLoading}
                    onSetIsLoading={setIsLoading}
                    onShowMessage={handleShowMessage}
                />
            )}
            {page === "PROFESSIONAL" && (
                <ProfessionalPage
                    getInfo
                    canSave
                    canUpdate
                    onSetPage={setPage}
                    isLoading={isLoading}
                    onSetIsLoading={setIsLoading}
                    onShowMessage={handleShowMessage}
                />
            )}
            {page === "IMMOBILE" && (
                <ImmobilePage
                    getInfo
                    canSave
                    canUpdate
                    onSetPage={setPage}
                    isLoading={isLoading}
                    onSetIsLoading={setIsLoading}
                    onShowMessage={handleShowMessage}
                />
            )}
            {page === "USER" && (
                <UserPage
                    getInfo
                    canSave
                    canUpdate
                    onSetPage={setPage}
                    isLoading={isLoading}
                    onSetIsLoading={setIsLoading}
                    onShowMessage={handleShowMessage}
                />
            )}
            {page === "BUDGET" && (
                <BudgetPage
                    getInfo
                    canSave
                    canUpdate
                    onSetPage={setPage}
                    isLoading={isLoading}
                    onSetIsLoading={setIsLoading}
                    onShowMessage={handleShowMessage}
                />
            )}
            {page === "PROJECT" && (
                <ProjectPage
                    getInfo
                    canUpdate
                    onSetPage={setPage}
                    isLoading={isLoading}
                    onSetIsLoading={setIsLoading}
                    onSetCheck={setCheckPendencies}
                    onShowMessage={handleShowMessage}
                />
            )}
            {page === "SERVICE" && (
                <ServicePage
                    getInfo
                    canUpdate
                    onSetPage={setPage}
                    isLoading={isLoading}
                    onSetIsLoading={setIsLoading}
                    onSetCheck={setCheckPendencies}
                    onShowMessage={handleShowMessage}
                />
            )}
            {page === "SERVICESTAGE" && (
                <ServiceStagePage
                    getInfo
                    canUpdate
                    onSetPage={setPage}
                    isLoading={isLoading}
                    onSetIsLoading={setIsLoading}
                    onSetCheck={setCheckPendencies}
                    onShowMessage={handleShowMessage}
                />
            )}
            {page === "PAYMENT" && (
                <PaymentPage
                    getInfo
                    canUpdate
                    onSetPage={setPage}
                    isLoading={isLoading}
                    onSetIsLoading={setIsLoading}
                    onSetCheck={setCheckPendencies}
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
        <FeedbackPendency />
        */}
            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                setIsOpen={setIsFeedbackOpen}
                feedbackMessage={feedbackMessage}
            />
        </Layout >
    )
}
