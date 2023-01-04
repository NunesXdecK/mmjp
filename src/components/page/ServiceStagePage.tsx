import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import { PlusIcon } from "@heroicons/react/solid"
import FormRowColumn from "../form/formRowColumn"
import UserNameListItem from "../list/userNameListItem"
import SwiftInfoButton from "../button/switchInfoButton"
import { handleUTCToDateShow } from "../../util/dateUtils"
import ServiceNameListItem from "../list/serviceNameListItem"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import ServiceStageDataForm from "../form/serviceStageDataForm"
import { ServiceStage, defaultServiceStage } from "../../interfaces/objectInterfaces"
import ServiceStageActionBarForm, { handleSaveServiceStageInner } from "../bar/serviceStageActionBar"
import NavBar, { NavBarPath } from "../bar/navBar"
import ServiceStageView from "../view/serviceStageView"

interface ServiceStagePageProps {
    id?: string,
    userId?: string,
    serviceId?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canDelete?: boolean,
    canUpdate?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    prevPath?: NavBarPath[],
    onSetPage?: (any) => void,
    onSetCheck?: (any) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

const handleSortByPriority = (list) => {
    return list?.sort((elementOne, elementTwo) => {
        let priorityOne = 0
        let priorityTwo = 0
        if ("priority" in elementOne) {
            priorityOne = elementOne.index
        }
        if ("priority" in elementTwo) {
            priorityTwo = elementTwo.index
        }
        return priorityOne - priorityTwo
    })
}

const handleFilterListLocal = (list, value) => {
    return list.filter((element, index) => {
        let name = ""
        let title = ""
        let date = ""
        let status = ""
        if (element) {
            if (typeof element === "string") {
                name = element
            } else if (typeof element === "object") {
                if ("name" in element) {
                    name = element.name.toString()
                }
                if ("title" in element) {
                    title = element.title.toString()
                }
                if ("status" in element) {
                    status = element.status.toString()
                }
                if ("date" in element) {
                    date = handleUTCToDateShow(element.date)
                }
            }
        }
        return name.toLowerCase().includes(value.toLowerCase())
            || date.toLowerCase().includes(value.toLowerCase())
            || title.toLowerCase().includes(value.toLowerCase())
            || status.toLowerCase().includes(value.toLowerCase())
    })
}

export default function ServiceStagePage(props: ServiceStagePageProps) {
    const [serviceStage, setServiceStage] = useState<ServiceStage>(defaultServiceStage)
    const [serviceStages, setServiceStages] = useState<ServiceStage[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo || props.serviceId === undefined)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setServiceStage(defaultServiceStage)
        setIndex(-1)
        setIsForShow(false)
        setIsRegister(false)
    }

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleSetCheck = (value) => {
        if (props.onSetCheck) {
            props.onSetCheck(value)
        }
    }

    const handleDeleteClick = async (serviceStage, index) => {
        handleSetIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/serviceStage", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: serviceStage.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const list = [
            ...serviceStages.slice(0, (index - 1)),
            ...serviceStages.slice(index, serviceStages.length),
        ]
        setServiceStages(list)
        handleSetIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleStatusClick = async (element, value) => {
        const serviceStage = {
            ...element,
            status: value,
            dateString: handleUTCToDateShow(element.dateDue),
        }
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
        handleSetIsLoading(true)
        const res = await handleSaveServiceStageInner(serviceStage, true)
        handleSetIsLoading(false)
        if (res.status === "ERROR") {
            handleShowMessage(feedbackMessage)
            return
        }
        feedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleAfterSave(feedbackMessage, serviceStage, true)
    }

    const handleNewClick = async () => {
        setServiceStage({
            ...defaultServiceStage,
            status: "PARADO",
            index: serviceStages.length,
            dateString: "",
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
        setServiceStage({ ...defaultServiceStage, ...project })
        setIsForShow(true)
        handleSetIsLoading(false)
    }

    const handleFilterList = (value) => {
        let listNormal = []
        let listPendency = []
        let listFinished = []
        let sortedList = handleSortByPriority(serviceStages)
        let priority = 0
        sortedList?.map((element, index) => {
            if (element.status === "PENDENTE") {
                listPendency = [...listPendency, element]
            }
            if (element.status === "FINALIZADO") {
                listFinished = [...listFinished, element]
            }
            if (element.status === "EM ANDAMENTO" || element.status === "PARADO") {
                priority = priority + 1
                listNormal = [...listNormal, { ...element, priorityView: priority }]
            }
        })
        return [
            ...handleFilterListLocal(listPendency, value),
            ...handleFilterListLocal(listNormal, value),
            ...handleFilterListLocal(listFinished, value),
        ]
    }

    const handleEditClick = async (serviceStage, index?) => {
        handleSetIsLoading(true)
        setIsForShow(false)
        let localServiceStage: ServiceStage = await fetch("api/serviceStage/" + serviceStage?.id).then((res) => res.json()).then((res) => res.data)
        localServiceStage = {
            ...localServiceStage,
            dateString: handleUTCToDateShow(localServiceStage?.dateDue?.toString()),
        }
        handleSetIsLoading(false)
        setIsRegister(true)
        setServiceStage(localServiceStage)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, serviceStage: ServiceStage, isForCloseModal) => {
        let localIndex = -1
        serviceStages.map((element, index) => {
            if (element.id === serviceStage.id) {
                localIndex = index
            }
        })
        let list: ServiceStage[] = [
            serviceStage,
            ...serviceStages,
        ]
        if (localIndex > -1) {
            list = [
                serviceStage,
                ...serviceStages.slice(0, localIndex),
                ...serviceStages.slice(localIndex + 1, serviceStages.length),
            ]
        }
        setServiceStages((old) => list)
        handleShowMessage(feedbackMessage)
        if (!isForCloseModal) {
            handleBackClick()
            setIndex((old) => -1)
        } else {
            setIndex((old) => 1)
        }
        handleSetCheck(true)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handlePutModalTitle = (short: boolean) => {
        let paths = []
        let path: NavBarPath = { path: "Nova etapa", onClick: null }
        if (short) {
            //path = { ...path, path: "E" }
        }
        if (serviceStage.id?.length > 0) {
            path = { ...path, path: "Etapa-" + serviceStage.title, onClick: null }
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
                {/*
                <FormRowColumn unit="1"></FormRowColumn>
                */}
                <FormRowColumn unit={!props.userId ? "2" : "2"}>Titulo</FormRowColumn>
                <FormRowColumn unit={!props.userId ? "1" : "2"}>Serviço</FormRowColumn>
                {!props.userId && (
                    <FormRowColumn unit="1">Responsável</FormRowColumn>
                )}
                <FormRowColumn unit={!props.userId ? "1" : "2"}>Status</FormRowColumn>
                {!props.userId && (
                    <FormRowColumn className="hidden sm:block" unit="1">Prazo</FormRowColumn>
                )}
            </FormRow>
        )
    }

    const handlePutRows = (element: ServiceStage) => {
        return (
            <FormRow>
                {/*
                <FormRowColumn unit="1">{(element.status === "PARADO" || element.status === "EM ANDAMENTO") ?
                    (
                        <PriorityButton
                            list={serviceStages}
                            priority={element.priority}
                            title={element.priorityView.toString()}
                        />
                    )
                    : ""}
                </FormRowColumn>
                    */}
                <FormRowColumn unit={!props.userId ? "2" : "2"}>{element.title}</FormRowColumn>
                <FormRowColumn unit={!props.userId ? "1" : "2"}><ServiceNameListItem id={element.service.id} /></FormRowColumn>
                {!props.userId && (
                    <FormRowColumn unit="1"><UserNameListItem id={element.responsible?.id} /></FormRowColumn>
                )}
                <FormRowColumn unit={!props.userId ? "1" : "2"}>
                    <SwiftInfoButton
                        id={element.id + "-"}
                        value={element.status}
                        isDisabled={props.isDisabled || props.isStatusDisabled}
                        values={[
                            "EM ANDAMENTO",
                            "FINALIZADO",
                            "PARADO",
                            "PENDENTE",
                        ]}
                        onClick={async (value) => {
                            handleStatusClick(element, value)
                        }}
                    />
                </FormRowColumn>
                {!props.userId && (
                    <FormRowColumn className="hidden sm:block" unit="1">{handleUTCToDateShow(element.dateDue?.toString())}</FormRowColumn>
                )}
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.userId?.length > 0) {
                handleSetIsLoading(true)
                fetch("api/serviceStagesByUser/" + props.userId).then((res) => res.json()).then((res) => {
                    setServiceStages(res.list ?? [])
                    setIsFirst(old => false)
                    handleSetIsLoading(false)
                })
            } else if (props.serviceId?.length > 0) {
                handleSetIsLoading(true)
                fetch("api/serviceStages/" + props.serviceId).then((res) => res.json()).then((res) => {
                    setServiceStages(res.list ?? [])
                    setIsFirst(old => false)
                    handleSetIsLoading(false)
                })
            } else if (props.serviceId === undefined) {
                handleSetIsLoading(true)
                fetch("api/serviceStages").then((res) => res.json()).then((res) => {
                    setServiceStages(res.list ?? [])
                    setIsFirst(old => false)
                    handleSetIsLoading(false)
                })
            }
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
                title="Etapas"
                isActive={index}
                list={serviceStages}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                isLoading={props.isLoading}
                canDelete={props.canDelete}
                onFilter={handleFilterList}
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
                            <ServiceStageActionBarForm
                                onSet={setServiceStage}
                                isLoading={props.isLoading}
                                serviceId={props.serviceId}
                                serviceStage={serviceStage}
                                onAfterSave={handleAfterSave}
                                onShowMessage={handleShowMessage}
                                onSetIsLoading={props.onSetIsLoading}
                            />
                        )}
                        {isForShow && (
                            <ActionBar
                                className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"
                            >
                                <Button
                                    isLoading={props.isLoading}
                                    onClick={() => {
                                        handleEditClick(serviceStage)
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
                        <ServiceStageDataForm
                            onSet={setServiceStage}
                            isLoading={props.isLoading}
                            serviceStage={serviceStage}
                            prevPath={(handlePutModalTitle(true))}
                            onSetIsLoading={props.onSetIsLoading}
                            isDisabled={serviceStage.status === "FINALIZADO"}
                        />
                    )}
                    {isForShow && (
                        <ServiceStageView elementId={serviceStage.id} />
                    )}
                </>
            </WindowModal>
        </>
    )
}
