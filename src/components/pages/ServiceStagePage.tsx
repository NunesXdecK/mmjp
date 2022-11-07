import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { ServiceStage, defaultServiceStage } from "../../interfaces/objectInterfaces"
import { handleUTCToDateShow, handleNewDateToUTC } from "../../util/dateUtils"
import ServiceStageActionBarForm from "../bar/serviceStageActionBar"
import ServiceStageDataForm from "../form/serviceStageDataForm"
import ServiceNameListItem from "../list/serviceNameListItem"

interface ServiceStagePageProps {
    id?: string,
    serviceId?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canUpdate?: boolean,
    onSetPage?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceStagePage(props: ServiceStagePageProps) {
    const [serviceStage, setServiceStage] = useState<ServiceStage>(defaultServiceStage)
    const [serviceStages, setServiceStages] = useState<ServiceStage[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
    const [isLoading, setIsLoading] = useState(props.getInfo)
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
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setServiceStage({
            ...defaultServiceStage,
            status: "NORMAL",
            dateString: handleUTCToDateShow(handleNewDateToUTC().toString()),
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
        let localServiceStage: ServiceStage = await fetch("api/serviceStage/" + serviceStage?.id).then((res) => res.json()).then((res) => res.data)
        localServiceStage = {
            ...localServiceStage,
            dateString: handleUTCToDateShow(localServiceStage?.dateDue?.toString()),
        }
        setIsLoading(false)
        setIsRegister(true)
        setServiceStage(localServiceStage)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, serviceStage: ServiceStage, isForCloseModal) => {
        let list: ServiceStage[] = [
            serviceStage,
            ...serviceStages,
        ]
        if (index > -1) {
            list = [
                serviceStage,
                ...serviceStages.slice(0, (index - 1)),
                ...serviceStages.slice(index, serviceStages.length),
            ]
        }
        handleShowMessage(feedbackMessage)
        setServiceStages((old) => list)
        if (!isForCloseModal) {
            handleBackClick()
            setIndex((old) => -1)
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
                <FormRowColumn unit="2">Serviço</FormRowColumn>
                <FormRowColumn unit="2">Titulo</FormRowColumn>
                <FormRowColumn unit="1">Status</FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">Prazo</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: ServiceStage) => {
        return (
            <FormRow>
                <FormRowColumn unit="2"><ServiceNameListItem id={element.service.id} /></FormRowColumn>
                <FormRowColumn unit="2">{element.title}</FormRowColumn>
                <FormRowColumn unit="1">
                    {element.status === "NORMAL" && (
                        <span className="rounded text-slate-600 bg-slate-300 py-1 px-2 text-xs font-bold">
                            {element.status}
                        </span>
                    )}
                    {element.status === "ARQUIVADO" && (
                        <span className="rounded text-red-600 bg-red-300 py-1 px-2 text-xs font-bold">
                            {element.status}
                        </span>
                    )}
                    {element.status === "FINALIZADO" && (
                        <span className="rounded text-green-600 bg-green-300 py-1 px-2 text-xs font-bold">
                            {element.status}
                        </span>
                    )}
                </FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">{handleUTCToDateShow(element.dateDue.toString())}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.serviceId?.length > 0) {
                fetch("api/serviceStages/" + props.serviceId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    if (res.list.length) {
                        setServiceStages(res.list)
                    }
                    setIsLoading(false)
                })
            } else {
                fetch("api/serviceStages").then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    if (res.list.length) {
                        setServiceStages(res.list)
                    }
                    setIsLoading(false)
                })
            }
        }
    })

    return (
        <>
            <div className="p-4 pb-0">
                <ActionBar className="flex flex-row justify-end">
                    <Button
                        isLoading={isLoading}
                        isHidden={!props.canUpdate}
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
                    >
                        <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                    </Button>
                </ActionBar>
            </div>

            <ListTable
                title="Etapas"
                isActive={index}
                list={serviceStages}
                isLoading={isLoading}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                onShowClick={handleShowClick}
                onEditClick={handleEditClick}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />

            <WindowModal
                max
                title="Pagamento"
                id="serviceStage-register-modal"
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
                            <div className="p-4 pb-0">
                            </div>
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