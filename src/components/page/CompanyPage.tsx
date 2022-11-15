import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { handleMaskCNPJ } from "../../util/maskUtil"
import CompanyDataForm from "../form/companyDataForm"
import CompanyActionBarForm from "../bar/companyActionBar"
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { Company, defaultCompany } from "../../interfaces/objectInterfaces"

interface CompanyPageProps {
    id?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canUpdate?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    onSetPage?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function CompanyPage(props: CompanyPageProps) {
    const [company, setCompany] = useState<Company>(defaultCompany)
    const [companys, setCompanys] = useState<Company[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
    const [isLoading, setIsLoading] = useState(props.getInfo)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setCompany(defaultCompany)
        setIndex(-1)
        setIsForShow(false)
        setIsRegister(false)
    }

    const handleDeleteClick = async (company, index) => {
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
        const list = [
            ...companys.slice(0, (index - 1)),
            ...companys.slice(index, companys.length),
        ]
        setCompanys(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setCompany({
            ...defaultCompany,
        })
        setIsRegister(true)
        setIndex(-1)
    }

    const handleCloseModal = (value) => {
        setIsRegister(value)
        setIsForShow(value)
    }

    const handleShowClick = (project) => {
        setIsLoading(true)
        setCompany({ ...defaultCompany, ...project })
        setIsForShow(true)
        setIsLoading(false)
    }

    const handleEditClick = async (company, index?) => {
        setIsLoading(true)
        setIsForShow(false)
        let localCompany: Company = await fetch("api/company/" + company?.id).then((res) => res.json()).then((res) => res.data)
        localCompany = {
            ...localCompany,
        }
        setIsLoading(false)
        setIsRegister(true)
        setCompany(localCompany)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, company: Company, isForCloseModal) => {
        let localIndex = -1
        companys.map((element, index) => {
            if (element.id === company.id) {
                localIndex = index
            }
        })
        let list: Company[] = [
            company,
            ...companys,
        ]
        if (localIndex > -1) {
            list = [
                company,
                ...companys.slice(0, localIndex),
                ...companys.slice(localIndex + 1, companys.length),
            ]
        }
        setCompanys((old) => list)
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

    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="1">Codigo</FormRowColumn>
                <FormRowColumn unit="3">Nome</FormRowColumn>
                <FormRowColumn unit="2">CNPJ</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: Company) => {
        return (
            <FormRow>
                <FormRowColumn unit="1">{element.clientCode?.length > 0 ? element.clientCode : "n/a"}</FormRowColumn>
                <FormRowColumn unit="3">{element.name}</FormRowColumn>
                <FormRowColumn unit="2">{handleMaskCNPJ(element.cnpj)}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/companies/").then((res) => res.json()).then((res) => {
                setCompanys(res.list ?? [])
                setIsFirst(old => false)
                setIsLoading(false)
            })
        }
    })

    return (
        <>
            <ActionBar className="flex flex-row justify-end">
                <Button
                    isLoading={isLoading}
                    isHidden={!props.canUpdate}
                    isDisabled={props.isDisabled}
                    onClick={() => {
                        setIndex(-1)
                        setIsFirst(true)
                        setIsLoading(true)
                        handleBackClick()
                    }}
                >
                    <RefreshIcon className="block h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                    isLoading={isLoading}
                    onClick={handleNewClick}
                    isHidden={!props.canSave}
                    isDisabled={props.isDisabled}
                >
                    <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                </Button>
            </ActionBar>
            <ListTable
                title="Empresas"
                isActive={index}
                list={companys}
                isLoading={isLoading}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                onShowClick={handleShowClick}
                onEditClick={handleEditClick}
                isDisabled={props.isDisabled}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />
            <WindowModal
                max
                title="Empresa"
                id="service-stage-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                headerBottom={(
                    <>
                        {isRegister && (
                            <div className="p-4 pb-0">
                                <CompanyActionBarForm
                                    company={company}
                                    onSet={setCompany}
                                    isLoading={isLoading}
                                    onSetIsLoading={setIsLoading}
                                    onAfterSave={handleAfterSave}
                                    onShowMessage={handleShowMessage}
                                />
                            </div>
                        )}
                        {isForShow && (
                            <ActionBar
                                className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"
                            >
                                <Button
                                    isLoading={isLoading}
                                    onClick={() => {
                                        handleEditClick(company)
                                    }}
                                >
                                    Editar
                                </Button>
                            </ActionBar>
                        )}
                    </>
                )}
            >
                <>
                    {isRegister && (
                        <CompanyDataForm
                            company={company}
                            onSet={setCompany}
                            isLoading={isLoading}
                        />
                    )}
                    {isForShow && (
                        <></>
                    )}
                </>
            </WindowModal>
        </>
    )
}
