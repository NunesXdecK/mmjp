import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { PlusIcon } from "@heroicons/react/solid"
import ServiceDataForm from "../form/serviceDataForm"
import { handleDateToShow, handleUTCToDateShow } from "../../util/dateUtils"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import ServiceStatusButton from "../button/serviceStatusButton"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import ProjectNumberListItem from "../list/projectNumberListItem"
import { Service, defaultService } from "../../interfaces/objectInterfaces"
import ServiceActionBarForm, { handleSaveServiceInner } from "../bar/serviceActionBar"
import NavBar, { NavBarPath } from "../bar/navBar"
import ServiceView from "../view/serviceView"
import { handleMaskCurrency } from "../inputText/inputText"

interface ServicePageProps {
    id?: string,
    userId?: number,
    projectId?: number,
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

export default function ServicePage(props: ServicePageProps) {
    const [service, setService] = useState<Service>(defaultService)
    const [services, setServices] = useState<Service[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo || props.projectId === undefined)
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

    const handleDeleteClick = async (service, index) => {
        handleSetIsLoading(true)
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
        handleSetIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleStatusClick = async (element, value) => {
        const service = {
            ...element,
            status: value,
            dateString: handleUTCToDateShow(element.dateDue)
        }
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
        handleSetIsLoading(true)
        const res = await handleSaveServiceInner(service, true)
        handleSetIsLoading(false)
        if (res.status === "ERROR") {
            handleShowMessage(feedbackMessage)
            return
        }
        feedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleAfterSave(feedbackMessage, service, true)
    }

    const handleNewClick = async () => {
        setService({
            ...defaultService,
            status: "PARADO",
            dateString: ""
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
        setService({ ...defaultService, ...project })
        setIsForShow(true)
        handleSetIsLoading(false)
    }

    const handleEditClick = async (service, index?) => {
        handleSetIsLoading(true)
        setIsForShow(false)
        let localService: Service = await fetch("api/service/" + service?.id).then((res) => res.json()).then((res) => res.data)
        localService = {
            ...defaultService,
            ...localService,
            index: services.length,
            dateString: handleUTCToDateShow(localService?.dateDue?.toString()),
            value: handleMountNumberCurrency(localService?.value?.toString(), ".", ",", 3, 2),
            total: handleMountNumberCurrency(localService?.total?.toString(), ".", ",", 3, 2),
        }
        handleSetIsLoading(false)
        setIsRegister(true)
        setService(localService)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, service: Service, isForCloseModal) => {
        let localIndex = -1
        services.map((element, index) => {
            if (element.id === service.id) {
                localIndex = index
            }
        })
        let list: Service[] = [
            service,
            ...services,
        ]
        if (localIndex > -1) {
            list = [
                service,
                ...services.slice(0, localIndex),
                ...services.slice(localIndex + 1, services.length),
            ]
        }
        setServices((old) => list)
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
        let path: NavBarPath = { path: "Novo serviço", onClick: null }
        if (short) {
            //path = { ...path, path: "S" }
        }
        if (service.id > 0) {
            path = { ...path, path: "Serviço-" + service.title, onClick: null }
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
                <FormRowColumn unit="2" unitM="3">Titulo</FormRowColumn>
                <FormRowColumn unit="2" unitM="3">Status</FormRowColumn>
                {!props.userId && (
                    <>
                        <FormRowColumn unit="1">Valor</FormRowColumn>
                        <FormRowColumn className="hidden sm:block" unit="1">Prazo</FormRowColumn>
                    </>
                )}
            </FormRow>
        )
    }

    const handlePutRows = (element: Service) => {
        return (
            <FormRow>
                <FormRowColumn className="break-words" unit="2" unitM="3">
                    {element?.project?.title ? element?.project?.title + "/" : ""}
                    {element.title}
                    {/*
                    <ProjectNumberListItem
                        text={element.title}
                        elementId={element.projectId}
                    />
                    */}
                </FormRowColumn>
                <FormRowColumn unit="2" unitM="3">
                    <ServiceStatusButton
                        service={element}
                        value={element.status}
                        onAfter={handleAfterSave}
                        id={element?.id?.toString()}
                        isDisabled={props.isDisabled || props.isStatusDisabled}
                        onClick={async (value) => {
                            handleStatusClick(element, value)
                        }}
                    />
                </FormRowColumn>
                {!props.userId && (
                    <>
                        <FormRowColumn className="hidden sm:block" unit="1">{handleMaskCurrency(((parseInt(element.value) ?? 0) * (parseInt(element.quantity) ?? 0)).toString())}</FormRowColumn>
                        <FormRowColumn className="hidden sm:block" unit="1">{element?.dateDue ? handleDateToShow(element?.dateDue) : "n/a"}</FormRowColumn>
                    </>
                )}
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.projectId > 0) {
                fetch("api/services/" + props.projectId).then((res) => res.json()).then((res) => {
                    setServices(res.list ?? [])
                    setIsFirst(old => false)
                    handleSetIsLoading(false)
                })
            } else if (props.projectId === undefined) {
                handleSetIsLoading(true)
                fetch("api/services").then((res) => res.json()).then((res) => {
                    setServices(res.list ?? [])
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
                list={services}
                isActive={index}
                title="Serviços"
                onSetIsActive={setIndex}
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
                id="service-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                title={(handlePutModalTitle(false))}
                headerBottom={(
                    <div className="p-4 pb-0">
                        {isRegister && (
                            <ServiceActionBarForm
                                service={service}
                                onSet={setService}
                                isLoading={props.isLoading}
                                projectId={props.projectId}
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
                                        handleEditClick(service)
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
                        <ServiceDataForm
                            service={service}
                            onSet={setService}
                            isLoading={props.isLoading}
                            onShowMessage={handleShowMessage}
                            onSetIsLoading={props.onSetIsLoading}
                            prevPath={(handlePutModalTitle(true))}
                            isDisabled={service.status === "FINALIZADO"}
                        />
                    )}
                    {isForShow && (
                        <ServiceView elementId={service.id} />
                    )}
                </>
            </WindowModal>
        </>
    )
}
