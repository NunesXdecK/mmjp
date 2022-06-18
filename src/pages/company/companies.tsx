import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import CompanyForm from "../../components/form/companyForm"
import CompanyList from "../../components/list/companyList"
import { defaultCompany, Company } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"
import { handlePrepareCompanyForShow } from "../../util/converterUtil"

export default function Companys() {
    const [title, setTitle] = useState("Lista de empresas")
    const [company, setCompany] = useState<Company>(defaultCompany)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setCompany(defaultCompany)
        setTitle("Lista de empresas")
    }

    const handleListItemClick = (company) => {
        let localCompany = {...company}
        localCompany = handlePrepareCompanyForShow(localCompany)
        setCompany(localCompany)
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

    return (
        <Layout
            title={title}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={title} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {company.id === "" ? (
                <CompanyList
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <CompanyForm
                    isBack={true}
                    company={company}
                    onBack={handleBackClick}
                    title="Informações empresariais"
                    onAfterSave={handleAfterSave}
                    onShowMessage={handleShowMessage}
                    subtitle="Dados importantes sobre a empresa" />
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout>
    )
}
