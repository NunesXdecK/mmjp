import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import ProjectNumberListItem from "../list/projectNumberListItem"
import { Service, defaultService } from "../../interfaces/objectInterfaces"
import { handleUTCToDateShow, handleNewDateToUTC } from "../../util/dateUtils"
import ServiceActionBarForm from "../bar/serviceActionBar"
import ServiceDataForm from "../form/serviceDataForm"
import { handleMountNumberCurrency } from "../../util/maskUtil"

interface ServicePageProps {
    id?: string,
    projectId?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canUpdate?: boolean,
    onSetPage?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServicePage(props: ServicePageProps) {
    const [service, setService] = useState<Service>(defaultService)
    const [services, setServices] = useState<Service[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
    const [isLoading, setIsLoading] = useState(props.getInfo)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setService(defaultService)
        setIndex(-1)
        setIsForShow(false)
        setIsRegister(false)
    }

    const handleDeleteClick = async (service, index) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/service", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: service.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const list = [
            ...services.slice(0, (index - 1)),
            ...services.slice(index, services.length),
        ]
        setServices(list)
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setService({ ...defaultService, dateString: handleUTCToDateShow(handleNewDateToUTC().toString()) })
        setIsRegister(true)
        setIndex(-1)
    }

    const handleCloseModal = (value) => {
        setIsRegister(value)
        setIsForShow(value)
    }

    const handleShowClick = (project) => {
        setIsLoading(true)
        setService({ ...defaultService, ...project })
        setIsForShow(true)
        setIsLoading(false)
    }

    const handleEditClick = async (service, index?) => {
        setIsLoading(true)
        setIsForShow(false)
        let localService: Service = await fetch("api/serviceNew/" + service?.id).then((res) => res.json()).then((res) => res.data)
        localService = {
            ...localService,
            index: services.length,
            dateString: handleUTCToDateShow(localService?.dateDue?.toString()),
            value: handleMountNumberCurrency(localService?.value?.toString(), ".", ",", 3, 2),
            total: handleMountNumberCurrency(localService?.total?.toString(), ".", ",", 3, 2),
        }
        setIsLoading(false)
        setIsRegister(true)
        setService(localService)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, service: Service, isForCloseModal) => {
        let list: Service[] = [
            service,
            ...services,
        ]
        if (index > -1) {
            list = [
                service,
                ...services.slice(0, (index - 1)),
                ...services.slice(index, services.length),
            ]
        }
        handleShowMessage(feedbackMessage)
        setServices((old) => list)
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
                <FormRowColumn unit="2">Projeto</FormRowColumn>
                <FormRowColumn unit="1">Titulo</FormRowColumn>
                <FormRowColumn unit="1">Valor</FormRowColumn>
                <FormRowColumn unit="1">Status</FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">Prazo</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: Service) => {
        return (
            <FormRow>
                <FormRowColumn unit="2"><ProjectNumberListItem id={element.project.id} /></FormRowColumn>
                <FormRowColumn unit="1">{element.title}</FormRowColumn>
                <FormRowColumn unit="1">{handleMountNumberCurrency(element.total.toString(), ".", ",", 3, 2)}</FormRowColumn>
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
            if (props.projectId?.length > 0) {
                fetch("api/services/" + props.projectId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    if (res.list.length) {
                        setServices(res.list)
                    }
                    setIsLoading(false)
                })
            } else {
                fetch("api/services").then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    if (res.list.length) {
                        setServices(res.list)
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
                list={services}
                isActive={index}
                title="Serviços"
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
                title="Serviços"
                id="service-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                headerBottom={(
                    <>
                        {isRegister && (
                            <div className="p-4 pb-0">
                                <ServiceActionBarForm
                                    service={service}
                                    onSet={setService}
                                    isLoading={isLoading}
                                    projectId={props.projectId}
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
                        <ServiceDataForm
                            service={service}
                            onSet={setService}
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
