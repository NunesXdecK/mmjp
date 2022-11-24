import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import PersonNameListItem from "../list/personNameListItem"
import { PlusIcon } from "@heroicons/react/solid"
import ProfessionalDataForm from "../form/professionalDataForm"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import ProfessionalActionBarForm from "../bar/professionalActionBar"
import { Professional, defaultProfessional } from "../../interfaces/objectInterfaces"
import ProfessionalView from "../view/professionalView"
import NavBar, { NavBarPath } from "../bar/navBar"

interface ProfessionalPageProps {
    id?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canUpdate?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    prevPath?: NavBarPath[],
    onSetPage?: (any) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProfessionalPage(props: ProfessionalPageProps) {
    const [professional, setProfessional] = useState<Professional>(defaultProfessional)
    const [professionals, setProfessionals] = useState<Professional[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
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

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleDeleteClick = async (professional, index) => {
        handleSetIsLoading(true)
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
        const list = [
            ...professionals.slice(0, (index - 1)),
            ...professionals.slice(index, professionals.length),
        ]
        setProfessionals(list)
        handleSetIsLoading(false)
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
        handleSetIsLoading(true)
        setProfessional({ ...defaultProfessional, ...project })
        setIsForShow(true)
        handleSetIsLoading(false)
    }

    const handleEditClick = async (professional, index?) => {
        handleSetIsLoading(true)
        setIsForShow(false)
        let localProfessional: Professional = await fetch("api/professional/" + professional?.id).then((res) => res.json()).then((res) => res.data)
        localProfessional = {
            ...localProfessional,
        }
        handleSetIsLoading(false)
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

    const handlePutModalTitle = (short: boolean) => {
        let paths = []
        let path: NavBarPath = { path: "Novo profissional", onClick: null }
        if (short) {
            //path = { ...path, path: "S" }
        }
        if (professional.id?.length > 0) {
            path = { ...path, path: "Profissional-" + professional.title, onClick: null }
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
                setProfessionals(res.list ?? [])
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
                title="Profissionais"
                isActive={index}
                list={professionals}
                isLoading={props.isLoading}
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
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                id="service-stage-register-modal"
                title={(handlePutModalTitle(false))}
                headerBottom={(
                    <div className="p-4 pb-0">
                        {isRegister && (
                            <ProfessionalActionBarForm
                                professional={professional}
                                onSet={setProfessional}
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
                                        handleEditClick(professional)
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
                        <ProfessionalDataForm
                            onSet={setProfessional}
                            isLoading={props.isLoading}
                            professional={professional}
                            prevPath={(handlePutModalTitle(true))}
                        />
                    )}
                    {isForShow && (
                        <ProfessionalView elementId={professional.id} />
                    )}
                </>
            </WindowModal>
        </>
    )
}
