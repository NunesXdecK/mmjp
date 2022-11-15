import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { handleMaskCNPJ } from "../../util/maskUtil"
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid"
import ImmobileDataForm from "../form/immobileDataForm"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import ImmobileActionBarForm from "../bar/immobileActionBar"
import { Immobile, defaultImmobile } from "../../interfaces/objectInterfaces"
import PersonNameListItem from "../list/personNameListItem"

interface ImmobilePageProps {
    id?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canUpdate?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    onSetPage?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ImmobilePage(props: ImmobilePageProps) {
    const [immobile, setImmobile] = useState<Immobile>(defaultImmobile)
    const [immobiles, setImmobiles] = useState<Immobile[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
    const [isLoading, setIsLoading] = useState(props.getInfo)
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

    const handleDeleteClick = async (immobile, index) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/immobileNew", {
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
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
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
        setIsLoading(true)
        setImmobile({ ...defaultImmobile, ...project })
        setIsForShow(true)
        setIsLoading(false)
    }

    const handleEditClick = async (immobile, index?) => {
        setIsLoading(true)
        setIsForShow(false)
        let localImmobile: Immobile = await fetch("api/immobile/" + immobile?.id).then((res) => res.json()).then((res) => res.data)
        localImmobile = {
            ...localImmobile,
        }
        setIsLoading(false)
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

    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="6">Nome</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: Immobile) => {
        return (
            <FormRow>
                <FormRowColumn unit="6">{element.name}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/immobiles/").then((res) => res.json()).then((res) => {
                setImmobiles(res.list ?? [])
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
                title="Imóveis"
                isActive={index}
                list={immobiles}
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
                title="Imovél"
                id="service-stage-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                headerBottom={(
                    <>
                        {isRegister && (
                            <div className="p-4 pb-0">
                                <ImmobileActionBarForm
                                    immobile={immobile}
                                    onSet={setImmobile}
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
                                        handleEditClick(immobile)
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
                        <ImmobileDataForm
                            isLoading={isLoading}
                            onSet={setImmobile}
                            immobile={immobile}
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
