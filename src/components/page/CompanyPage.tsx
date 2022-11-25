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
import CompanyView from "../view/companyView"
import NavBar, { NavBarPath } from "../bar/navBar"

interface CompanyPageProps {
    id?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canDelete?: boolean,
    canUpdate?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    prevPath?: NavBarPath[],
    onSetPage?: (any) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function CompanyPage(props: CompanyPageProps) {
    const [company, setCompany] = useState<Company>(defaultCompany)
    const [companys, setCompanys] = useState<Company[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
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

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleDeleteClick = async (company, index) => {
        handleSetIsLoading(true)
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
        handleSetIsLoading(false)
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
        handleSetIsLoading(true)
        setCompany({ ...defaultCompany, ...project })
        setIsForShow(true)
        handleSetIsLoading(false)
    }

    const handleEditClick = async (company, index?) => {
        handleSetIsLoading(true)
        setIsForShow(false)
        let localCompany: Company = await fetch("api/company/" + company?.id).then((res) => res.json()).then((res) => res.data)
        localCompany = {
            ...localCompany,
        }
        handleSetIsLoading(false)
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

    const handlePutModalTitle = (short: boolean) => {
        let paths = []
        let path: NavBarPath = { path: "Nova empresa", onClick: null }
        if (short) {
            //path = { ...path, path: "S" }
        }
        if (company.id?.length > 0) {
            path = { ...path, path: "Empresa-" + company.name, onClick: null }
        }
        try {
            if (props.prevPath?.length > 0) {
                let prevPath: NavBarPath = {
                    ...props.prevPath[props.prevPath?.length - 1],
                    onClick: handleBackClick,
                    path: props.prevPath[props.prevPath?.length - 1]?.path + "/",
                }
                paths = [...props.prevPath.slice(0, props.prevPath?.length - 1), prevPath,]
            }
            paths = [...paths, path]
        } catch (err) {
            console.error(err)
        }
        if (short) {
            return paths
        } else {
            return (
                <>
                    {paths?.length > 0 ? (<NavBar pathList={paths} />) : path.path}
                </>
            )
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
                handleSetIsLoading(false)
            })
        }
    })

    return (
        <>
            <ActionBar
                isHidden={!props.canSave}
                className="flex flex-row justify-end"
            >
                <Button
                    isLoading={props.isLoading}
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
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                isLoading={props.isLoading}
                canDelete={props.canDelete}
                onShowClick={handleShowClick}
                onEditClick={handleEditClick}
                isDisabled={props.isDisabled}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />
            <WindowModal
                max
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                id="service-stage-register-modal"
                title={(handlePutModalTitle(false))}
                headerBottom={(
                    <div className="p-4 pb-0">
                        {isRegister && (
                            <CompanyActionBarForm
                                company={company}
                                onSet={setCompany}
                                isLoading={props.isLoading}
                                onSetIsLoading={handleSetIsLoading}
                                onAfterSave={handleAfterSave}
                                onShowMessage={handleShowMessage}
                            />
                        )}
                        {isForShow && (
                            <ActionBar
                                className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"
                            >
                                <Button
                                    isLoading={props.isLoading}
                                    onClick={() => {
                                        handleEditClick(company)
                                    }}
                                >
                                    Editar
                                </Button>
                            </ActionBar>
                        )}
                    </div>
                )}
            >
                <>
                    {isRegister && (
                        <CompanyDataForm
                            company={company}
                            onSet={setCompany}
                            isLoading={props.isLoading}
                            prevPath={(handlePutModalTitle(true))}
                        />
                    )}
                    {isForShow && (
                        <CompanyView elementId={company.id} />
                    )}
                </>
            </WindowModal>
        </>
    )
}
