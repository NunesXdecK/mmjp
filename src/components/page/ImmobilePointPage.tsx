import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import { PlusIcon } from "@heroicons/react/solid"
import FormRowColumn from "../form/formRowColumn"
import NavBar, { NavBarPath } from "../bar/navBar"
import ImmobilePointView from "../view/immobilePointView"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import ImmobilePointDataForm from "../form/immobilePointDataForm"
import ImmobilePointActionBarForm from "../bar/immobilePointActionBar"
import { ImmobilePoint, defaultImmobilePoint } from "../../interfaces/objectInterfaces"

interface ImmobilePointPageProps {
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

export default function ImmobilePointPage(props: ImmobilePointPageProps) {
    const [immobilePoint, setImmobilePoint] = useState<ImmobilePoint>(defaultImmobilePoint)
    const [immobilePoints, setImmobilePoints] = useState<ImmobilePoint[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setImmobilePoint(defaultImmobilePoint)
        setIndex(-1)
        setIsForShow(false)
        setIsRegister(false)
    }

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleDeleteClick = async (immobilePoint, index) => {
        handleSetIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/point", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: immobilePoint.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const list = [
            ...immobilePoints.slice(0, (index - 1)),
            ...immobilePoints.slice(index, immobilePoints.length),
        ]
        setImmobilePoints(list)
        handleSetIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setImmobilePoint({
            ...defaultImmobilePoint,
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
        setImmobilePoint({ ...defaultImmobilePoint, ...project })
        setIsForShow(true)
        handleSetIsLoading(false)
    }

    const handleEditClick = async (immobilePoint, index?) => {
        handleSetIsLoading(true)
        setIsForShow(false)
        let localImmobilePoint: ImmobilePoint = await fetch("api/point/" + immobilePoint?.id).then((res) => res.json()).then((res) => res.data)
        localImmobilePoint = {
            ...localImmobilePoint,
        }
        handleSetIsLoading(false)
        setIsRegister(true)
        setImmobilePoint(localImmobilePoint)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, immobilePoint: ImmobilePoint, isForCloseModal) => {
        let localIndex = -1
        immobilePoints.map((element, index) => {
            if (element.id === immobilePoint.id) {
                localIndex = index
            }
        })
        let list: ImmobilePoint[] = [
            immobilePoint,
            ...immobilePoints,
        ]
        if (localIndex > -1) {
            list = [
                immobilePoint,
                ...immobilePoints.slice(0, localIndex),
                ...immobilePoints.slice(localIndex + 1, immobilePoints.length),
            ]
        }
        setImmobilePoints((old) => list)
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
        let path: NavBarPath = { path: "Novo ponto", onClick: null }
        if (short) {
            //path = { ...path, path: "S" }
        }
        if (immobilePoint?.id > 0) {
            path = { ...path, path: "Ponto-" + immobilePoint.pointId, onClick: null }
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
                <FormRowColumn unit="3">ID e Epoch</FormRowColumn>
                <FormRowColumn unit="1">X</FormRowColumn>
                <FormRowColumn unit="1">Y</FormRowColumn>
                <FormRowColumn unit="1">Z</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: ImmobilePoint) => {
        return (
            <FormRow>
                <FormRowColumn unit="3" unitM="6">{element.pointId + " " + element.epoch}</FormRowColumn>
                <FormRowColumn unit="1" className="hidden sm:block">{element.eastingX}</FormRowColumn>
                <FormRowColumn unit="1" className="hidden sm:block">{element.northingY}</FormRowColumn>
                <FormRowColumn unit="1" className="hidden sm:block">{element.elipseHeightZ}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            handleSetIsLoading(true)
            fetch("api/points/").then((res) => res.json()).then((res) => {
                setImmobilePoints(res.list ?? [])
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
                isActive={index}
                list={immobilePoints}
                onSetIsActive={setIndex}
                title="Pontos dos imóveis"
                onTableRow={handlePutRows}
                canDelete={props.canDelete}
                isLoading={props.isLoading}
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
                            <ImmobilePointActionBarForm
                                immobilePoint={immobilePoint}
                                onSet={setImmobilePoint}
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
                                        handleEditClick(immobilePoint)
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
                        <ImmobilePointDataForm
                            immobilePoint={immobilePoint}
                            onSet={setImmobilePoint}
                            isLoading={props.isLoading}
                            prevPath={(handlePutModalTitle(true))}
                        />
                    )}
                    {isForShow && (
                        <ImmobilePointView elementId={immobilePoint.id} />
                    )}
                </>
            </WindowModal>
        </>
    )
}
