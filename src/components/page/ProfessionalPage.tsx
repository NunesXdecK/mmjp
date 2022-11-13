import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { handleMaskCNPJ } from "../../util/maskUtil"
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid"
import ProfessionalDataForm from "../form/professionalDataForm"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import ProfessionalActionBarForm from "../bar/professionalActionBar"
import { Professional, defaultProfessional } from "../../interfaces/objectInterfaces"
import PersonNameListItem from "../list/personNameListItem"

interface ProfessionalPageProps {
    id?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canUpdate?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    onSetPage?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProfessionalPage(props: ProfessionalPageProps) {
    const [professional, setProfessional] = useState<Professional>(defaultProfessional)
    const [professionals, setProfessionals] = useState<Professional[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
    const [isLoading, setIsLoading] = useState(props.getInfo)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setProfessional(defaultProfessional)
        setIndex(-1)
        setIsForShow(false)
        setIsRegister(false)
    }

    const handleDeleteClick = async (professional, index) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/professionalNew", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: professional.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const list = [
            ...professionals.slice(0, (index - 1)),
            ...professionals.slice(index, professionals.length),
        ]
        setProfessionals(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setProfessional({
            ...defaultProfessional,
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
        setProfessional({ ...defaultProfessional, ...project })
        setIsForShow(true)
        setIsLoading(false)
    }

    const handleEditClick = async (professional, index?) => {
        setIsLoading(true)
        setIsForShow(false)
        let localProfessional: Professional = await fetch("api/professional/" + professional?.id).then((res) => res.json()).then((res) => res.data)
        localProfessional = {
            ...localProfessional,
        }
        setIsLoading(false)
        setIsRegister(true)
        setProfessional(localProfessional)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, professional: Professional, isForCloseModal) => {
        let localIndex = -1
        professionals.map((element, index) => {
            if (element.id === professional.id) {
                localIndex = index
            }
        })
        let list: Professional[] = [
            professional,
            ...professionals,
        ]
        if (localIndex > -1) {
            list = [
                professional,
                ...professionals.slice(0, localIndex),
                ...professionals.slice(localIndex + 1, professionals.length),
            ]
        }
        setProfessionals((old) => list)
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
                <FormRowColumn unit="2">Nome</FormRowColumn>
                <FormRowColumn unit="2">Profissão</FormRowColumn>
                <FormRowColumn unit="2">CREA</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: Professional) => {
        return (
            <FormRow>
                <FormRowColumn unit="2"><PersonNameListItem id={element.person?.id} /></FormRowColumn>
                <FormRowColumn unit="2">{element.title}</FormRowColumn>
                <FormRowColumn unit="2">{element.creaNumber}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/professionals/").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setProfessionals(res.list)
                }
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
                title="Profissionais"
                isActive={index}
                list={professionals}
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
                title="Profissional"
                id="service-stage-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                headerBottom={(
                    <>
                        {isRegister && (
                            <div className="p-4 pb-0">
                                <ProfessionalActionBarForm
                                    professional={professional}
                                    onSet={setProfessional}
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
                                        handleEditClick(professional)
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
                        <ProfessionalDataForm
                            isLoading={isLoading}
                            onSet={setProfessional}
                            professional={professional}
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
