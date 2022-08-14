import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../components/list/list"
import Layout from "../../components/layout/layout"
import CompanyForm from "../../components/form/companyForm"
import CompanyView from "../../components/view/companyView"
import { handlePrepareCompanyForShow } from "../../util/converterUtil"
import { defaultCompany, Company } from "../../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function Companies() {
    const [title, setTitle] = useState("Lista de empresas")
    const [company, setCompany] = useState<Company>(defaultCompany)
    const [companies, setCompanies] = useState<Company[]>([])
    const [companiesForShow, setCompaniesForShow] = useState<Company[]>([])

    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isRegister, setIsRegister] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setCompanies([])
        setCompaniesForShow([])
        setCompany(defaultCompany)
        setIsFirst(true)
        setIsLoading(true)
        setIsRegister(false)
        setTitle("Lista de empresas")
    }

    const handleDeleteClick = async (company) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/company", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: company.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const index = companies.indexOf(company)
        const list = [
            ...companies.slice(0, index),
            ...companies.slice(index + 1, companies.length),
        ]
        setCompanies(list)
        setCompaniesForShow(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = () => {
        setIsRegister(true)
        setCompany(defaultCompany)
        setTitle("Nova empresa")
    }

    const handleFilterList = (string) => {
        let listItems = [...companies]
        let listItemsFiltered: Company[] = []
        listItemsFiltered = listItems.filter((element: Company, index) => {
            return element.name.toLowerCase().includes(string.toLowerCase())
        })
        setCompaniesForShow((old) => listItemsFiltered)
    }

    const handleEditClick = async (company) => {
        setIsLoading(true)
        let localCompany = await fetch("api/company/" + company.id).then((res) => res.json()).then((res) => res.data)
        localCompany = handlePrepareCompanyForShow(localCompany)
        setIsRegister(true)
        setCompany({ ...defaultCompany, ...localCompany })
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
            fetch("api/companies").then((res) => res.json()).then((res) => {
                if (res.list.length) {
                    setCompanies(res.list)
                    setCompaniesForShow(res.list)
                }
                setIsFirst(false)
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
                    list={companiesForShow}
                    onSetElement={setCompany}
                    onNewClick={handleNewClick}
                    onEditClick={handleEditClick}
                    onFilterList={handleFilterList}
                    onDeleteClick={handleDeleteClick}
                    deleteWindowTitle={"Deseja realmente deletar " + company.name + "?"}
                    onTitle={(element: Company) => {
                        return (
                            <CompanyView
                                title=""
                                hideData
                                hideBorder
                                company={element}
                                classNameHolder="pb-0 pt-0 px-0 mt-0"
                                classNameContentHolder="py-0 px-0 mt-0"
                            />
                        )
                    }}
                    onInfo={(element: Company) => {
                        return (<CompanyView classNameContentHolder="" id={element.id} />)
                    }}
                />
            ) : (
                <CompanyForm
                    canMultiple
                    canAutoSave
                    isBack={true}
                    company={company}
                    onBack={handleBackClick}
                    onAfterSave={handleAfterSave}
                    title="Informações empresariais"
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
