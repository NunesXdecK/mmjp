import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import UserNameListItem from "../list/userNameListItem"
import ServiceNameListItem from "../list/serviceNameListItem"
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import ServiceStageDataForm from "../form/serviceStageDataForm"
import ServiceStageActionBarForm, { handleSaveServiceStageInner } from "../bar/serviceStageActionBar"
import { handleUTCToDateShow, handleNewDateToUTC } from "../../util/dateUtils"
import { ServiceStage, defaultServiceStage } from "../../interfaces/objectInterfaces"
import SwiftInfoButton from "../button/switchInfoButton"

interface ServiceStagePageProps {
    id?: string,
    serviceId?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canUpdate?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    onSetPage?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceStagePage(props: ServiceStagePageProps) {
    const [serviceStage, setServiceStage] = useState<ServiceStage>(defaultServiceStage)
    const [serviceStages, setServiceStages] = useState<ServiceStage[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo || props.serviceId === undefined)
    const [isLoading, setIsLoading] = useState(props.getInfo || props.serviceId === undefined)
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

    const handleDeleteClick = async (serviceStage, index) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/serviceStageNew", {
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
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
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
        setIsLoading(true)
        setServiceStage({ ...defaultServiceStage, ...project })
        setIsForShow(true)
        setIsLoading(false)
    }

    const handleEditClick = async (serviceStage, index?) => {
        setIsLoading(true)
        setIsForShow(false)
        let localServiceStage: ServiceStage = await fetch("api/serviceStageNew/" + serviceStage?.id).then((res) => res.json()).then((res) => res.data)
        localServiceStage = {
            ...localServiceStage,
            dateString: handleUTCToDateShow(localServiceStage?.dateDue?.toString()),
        }
        setIsLoading(false)
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
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="1">Titulo</FormRowColumn>
                <FormRowColumn unit="2">Serviço</FormRowColumn>
                <FormRowColumn unit="1">Responsável</FormRowColumn>
                <FormRowColumn unit="1">Status</FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">Prazo</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: ServiceStage) => {
        return (
            <FormRow>
                <FormRowColumn unit="1">{element.title}</FormRowColumn>
                <FormRowColumn unit="2"><ServiceNameListItem id={element.service.id} /></FormRowColumn>
                <FormRowColumn unit="1"><UserNameListItem id={element.responsible.id} /></FormRowColumn>
                <FormRowColumn unit="1">
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
                            const serviceStage = { ...element, status: value }
                            let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
                            setIsLoading(true)
                            const res = await handleSaveServiceStageInner(serviceStage, true)
                            setIsLoading(false)
                            if (res.status === "ERROR") {
                                handleShowMessage(feedbackMessage)
                                return
                            }
                            feedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
                            handleAfterSave(feedbackMessage, serviceStage, true)
                        }}
                    />
                </FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">{handleUTCToDateShow(element.dateDue?.toString())}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.serviceId?.length > 0) {
                fetch("api/serviceStages/" + props.serviceId).then((res) => res.json()).then((res) => {
                    setServiceStages(res.list ?? [])
                    setIsFirst(old => false)
                    setIsLoading(false)
                })
            } else if (props.serviceId === undefined) {
                fetch("api/serviceStages").then((res) => res.json()).then((res) => {
                    setServiceStages(res.list ?? [])
                    setIsFirst(old => false)
                    setIsLoading(false)
                })
            }
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
                title="Etapas"
                isActive={index}
                list={serviceStages}
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
                title="Etapa"
                id="service-stage-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                headerBottom={(
                    <>
                        {isRegister && (
                            <div className="p-4 pb-0">
                                <ServiceStageActionBarForm
                                    isLoading={isLoading}
                                    onSet={setServiceStage}
                                    serviceId={props.serviceId}
                                    serviceStage={serviceStage}
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
                                        handleEditClick(serviceStage)
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
                        <ServiceStageDataForm
                            isLoading={isLoading}
                            onSet={setServiceStage}
                            serviceStage={serviceStage}
                            isDisabled={serviceStage.status === "FINALIZADO"}
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
