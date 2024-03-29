import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import ImmobileDataForm from "../form/immobileDataForm"
import ImmobileActionBarForm, { handleSaveImmobileInner } from "../bar/immobileActionBar"
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { Immobile, defaultImmobile } from "../../interfaces/objectInterfaces"
import ImmobileView from "../view/immobileView"
import ImmobileStatusButton from "../button/immobileStatusButton"
import NavBar, { NavBarPath } from "../bar/navBar"

interface ImmobilePageProps {
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

export default function ImmobilePage(props: ImmobilePageProps) {
    const [immobile, setImmobile] = useState<Immobile>(defaultImmobile)
    const [immobiles, setImmobiles] = useState<Immobile[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setImmobile(defaultImmobile)
        setIndex(-1)
        setIsForShow(false)
        setIsRegister(false)
    }

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleDeleteClick = async (immobile, index) => {
        handleSetIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/immobile", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: immobile.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const list = [
            ...immobiles.slice(0, (index - 1)),
            ...immobiles.slice(index, immobiles.length),
        ]
        setImmobiles(list)
        handleSetIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleStatusClick = async (element, value) => {
        const immobile: Immobile = {
            ...element,
            status: value,
        }
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
        handleSetIsLoading(true)
        const res = await handleSaveImmobileInner(immobile, true)
        handleSetIsLoading(false)
        if (res.status === "ERROR") {
            handleShowMessage(feedbackMessage)
            return
        }
        feedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleAfterSave(feedbackMessage, immobile, true)
    }

    const handleNewClick = async () => {
        setImmobile({
            ...defaultImmobile,
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
        setImmobile({ ...defaultImmobile, ...project })
        setIsForShow(true)
        handleSetIsLoading(false)
    }

    const handleEditClick = async (immobile, index?) => {
        handleSetIsLoading(true)
        setIsForShow(false)
        let localImmobile: Immobile = await fetch("api/immobile/" + immobile?.id).then((res) => res.json()).then((res) => res.data)
        localImmobile = {
            ...localImmobile,
        }
        handleSetIsLoading(false)
        setIsRegister(true)
        setImmobile(localImmobile)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, immobile: Immobile, isForCloseModal) => {
        let localIndex = -1
        immobiles.map((element, index) => {
            if (element.id === immobile.id) {
                localIndex = index
            }
        })
        let list: Immobile[] = [
            immobile,
            ...immobiles,
        ]
        if (localIndex > -1) {
            list = [
                immobile,
                ...immobiles.slice(0, localIndex),
                ...immobiles.slice(localIndex + 1, immobiles.length),
            ]
        }
        setImmobiles((old) => list)
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
        let path: NavBarPath = { path: "Novo imóvel", onClick: null }
        if (short) {
            //path = { ...path, path: "S" }
        }
        if (immobile.id > 0) {
            path = { ...path, path: "Imóvel-" + immobile.name, onClick: null }
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
                <FormRowColumn unit="1">Status</FormRowColumn>
                <FormRowColumn unit="1">Municipio/UF</FormRowColumn>
                <FormRowColumn unit="2">Gleba</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: Immobile) => {
        return (
            <FormRow>
                <FormRowColumn unit="2" unitM="3">{element.name}</FormRowColumn>
                <FormRowColumn unit="1" unitM="3" className="justify-self-center sm:justify-self-start">
                    <ImmobileStatusButton
                        id={element.id + ""}
                        immobile={element}
                        value={element.status}
                        onAfter={handleAfterSave}
                        isDisabled={props.isDisabled}
                        onClick={async (value) => {
                            handleStatusClick(element, value)
                        }}
                    />
                </FormRowColumn>
                <FormRowColumn unit="1" className="hidden sm:block">{element.county}</FormRowColumn>
                <FormRowColumn unit="2" className="hidden sm:block">{element.land}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            handleSetIsLoading(true)
            fetch("api/immobiles/").then((res) => res.json()).then((res) => {
                setImmobiles(res.list ?? [])
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
                title="Imóveis"
                isActive={index}
                list={immobiles}
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
                            <ImmobileActionBarForm
                                immobile={immobile}
                                onSet={setImmobile}
                                isLoading={props.isLoading}
                                onAfterSave={handleAfterSave}
                                onShowMessage={handleShowMessage}
                                onSetIsLoading={handleSetIsLoading}
                            />
                        )}
                        {isForShow && (
                            <ActionBar
                                className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"
                            >
                                <Button
                                    isLoading={props.isLoading}
                                    onClick={() => {
                                        handleEditClick(immobile)
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
                        <ImmobileDataForm
                            onSet={setImmobile}
                            immobile={immobile}
                            isLoading={props.isLoading}
                            onShowMessage={handleShowMessage}
                            onSetIsLoading={handleSetIsLoading}
                            prevPath={(handlePutModalTitle(true))}
                        />
                    )}
                    {isForShow && (
                        <ImmobileView elementId={immobile.id} />
                    )}
                </>
            </WindowModal>
        </>
    )
}
