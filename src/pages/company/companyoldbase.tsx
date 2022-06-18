import Head from "next/head"
import { useState } from "react"
import Layout from "../../components/layout/layout"
import { collection, getDocs } from "firebase/firestore"
import { handleRemoveCPFMask } from "../../util/maskUtil"
import CompanyList from "../../components/list/companyList"
import CompanyForm from "../../components/form/companyForm"
import { handlePrepareCompanyForShow } from "../../util/converterUtil"
import { CompanyConversor, PersonConversor } from "../../db/converters"
import { defaultCompany, Company } from "../../interfaces/objectInterfaces"
import { db, COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../../components/modal/feedbackMessageModal"

export default function CompanyOldBase() {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)

    const [title, setTitle] = useState("Lista de empresas da base antiga")
    const [company, setCompany] = useState<Company>(defaultCompany)

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setCompany(defaultCompany)
        setTitle("Lista de empresas da base antiga")
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

    const handleListItemClick = async (company: Company) => {
        let localCompany = {...company}
        try {
            const querySnapshot = await getDocs(companyCollection)
            querySnapshot.forEach((doc) => {
                const localCNPJ = handleRemoveCPFMask(localCompany.cnpj)
                const baseCNPJ = handleRemoveCPFMask(doc.data().cnpj)
                if (doc.id && localCNPJ === baseCNPJ) {
                    localCompany = doc.data()
                    localCompany = { ...localCompany, oldData: company.oldData }
                }
            })

            if (localCompany.owners?.length > 0) {
                const querySnapshotPerson = await getDocs(personCollection)
                let ownersIdList = []
                let ownersList = []
                localCompany?.owners?.map((element, index) => {
                    ownersIdList = [...ownersIdList, element.id]
                })
                querySnapshotPerson.forEach((docPerson) => {
                    const personID = docPerson.data().id
                    if (ownersIdList.includes(personID)) {
                        if (!ownersList.includes(docPerson.data())) {
                            ownersList = [...ownersList, docPerson.data()]
                        }
                    }
                })
                localCompany = { ...localCompany, owners: ownersList }
            }
        } catch (err) {
            console.error(err)
            let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu, tente novamente."], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
        }
        localCompany = handlePrepareCompanyForShow(localCompany)
        {/*
    */}
    setCompany(localCompany)
    setTitle("Empresa da base antiga")
    }

    return (
        <Layout
            title={title}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={title} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {company.name === "" ? (
                <CompanyList
                    isOldBase={true}
                    onShowMessage={handleShowMessage}
                    onListItemClick={handleListItemClick}
                />
            ) : (
                <CompanyForm
                    isBack={true}
                    company={company}
                    isForOldRegister={true}
                    onBack={handleBackClick}
                    title="Informações da empresa"
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
