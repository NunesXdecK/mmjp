import InfoView from "./infoView"
import Button from "../button/button"
import ProjectView from "./projectView"
import ImmobileView from "./immobileView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import ProfessionalView from "./professionalView"
import ServiceStageView from "./serviceStageView"
import { handleUTCToDateShow } from "../../util/dateUtils"
import PlaceholderItemList from "../list/placeholderItemList"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { defaultService, Service } from "../../interfaces/objectInterfaces"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"
import SwitchTextButton from "../button/switchTextButton"
import ServiceStatusButton from "../button/serviceStatusButton"

interface ServiceViewProps {
    id?: string,
    title?: string,
    elementId?: string,
    addressTitle?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideData?: boolean,
    dataInside?: boolean,
    hideBorder?: boolean,
    hideProject?: boolean,
    showMoreInfo?: boolean,
    canShowHideData?: boolean,
    hidePaddingMargin?: boolean,
    service?: Service,
}

export default function ServiceView(props: ServiceViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [service, setService] = useState<Service>(props.service ?? defaultService)

    const hasHideData =
        service.project?.id > 0 ||
        service.professional?.id > 0 ||
        service.serviceStages?.length > 0 ||
        service.servicePayments?.length > 0 ||
        service.immobilesTarget?.length > 0 ||
        service.immobilesOrigin?.length > 0
    const hasData =
        hasHideData ||
        service?.dateDue > 0 ||
        service?.value?.length ||
        service?.total?.length ||
        service?.title?.length ||
        service?.quantity?.length

    const handleSortByData = (elementOne, elementTwo) => {
        let dateOne = 0
        let dateTwo = 0
        if ("dateInsertUTC" in elementOne) {
            dateOne = elementOne.dateInsertUTC
        }
        if ("dateInsertUTC" in elementTwo) {
            dateTwo = elementTwo.dateInsertUTC
        }
        return dateTwo - dateOne

    }

    const handleSortByIndex = (elementOne, elementTwo) => {
        let indexOne = 0
        let indexTwo = 0
        if ("index" in elementOne) {
            indexOne = elementOne.index
        }
        if ("index" in elementTwo) {
            indexTwo = elementTwo.index
        }
        return indexOne - indexTwo
    }

    const handlePutProject = () => {
        return (
            <>
                {service?.project?.id?.length && (
                    <ProjectView
                        hideData
                        dataInside
                        addressTitle={"Endereço"}
                        elementId={service.project.id ?? ""}
                        hideBorder={props.showMoreInfo}
                        canShowHideData={!props.showMoreInfo}
                        hidePaddingMargin={props.showMoreInfo}
                        id={service.id + "-" + service.project.id}
                        title={props.showMoreInfo ? "" : "Projeto"}
                    />
                )}
            </>
        )
    }
    const handlePutData = () => {
        let listServiceStage = service?.serviceStages?.sort(handleSortByIndex) ?? []
        let listServicePayment = service?.servicePayments?.sort(handleSortByIndex) ?? []
        let listTarget = service?.immobilesTarget?.sort(handleSortByData) ?? []
        let listOrigin = service?.immobilesOrigin?.sort(handleSortByData) ?? []
        return (
            <div className="w-full">
                {!props.hideProject && handlePutProject()}

                {service?.professional?.id?.length && (
                    <ProfessionalView
                        hideData
                        dataInside
                        canShowHideData
                        title="Profissional"
                        elementId={service.professional.id}
                    />
                )}

                {listServiceStage?.map((serviceStage, index) => (
                    <ServiceStageView
                        hideData
                        dataInside
                        hideService
                        canShowHideData
                        serviceStage={serviceStage}
                        key={index + serviceStage.id}
                        title={"Etapa " + (index + 1)}
                    />
                ))}
                {/*
                {listServicePayment?.map((servicePayment, index) => (
                    <ServicePaymentView
                        hideData
                        dataInside
                        hideService
                        canShowHideData
                        servicePayment={servicePayment}
                        key={index + servicePayment.id}
                        title={"Pagamento " + (index + 1)}
                    />
                ))}
            */}

                {listTarget?.map((immobile, index) => (
                    <ImmobileView
                        hideData
                        dataInside
                        canShowHideData
                        elementId={immobile.id}
                        title={"Imóvel alvo " + (index + 1)}
                        key={"target-" + index + immobile + service.id}
                    />
                ))}

                {listOrigin?.map((immobile, index) => (
                    <ImmobileView
                        hideData
                        dataInside
                        canShowHideData
                        elementId={immobile.id}
                        title={"Imóvel de origem " + (index + 1)}
                        key={"origin-" + index + immobile + service.id}
                    />
                ))}
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props.elementId.length !== 0 && service.id?.length === 0) {
                fetch("api/service/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setService(res.data)
                })
            }
        }
    })

    return (
        <>
            {service.id?.length === 0 ? (
                <div className="mt-6 w-full">
                    <PlaceholderItemList />
                </div>
            ) : (
                <>
                    {hasData && (
                        <>
                            <InfoHolderView
                                hideBorder={props.hideBorder}
                                classNameTitle={props.classNameTitle}
                                classNameHolder={props.classNameHolder}
                                hidePaddingMargin={props.hidePaddingMargin}
                                title={props.title ?? "Dados básicos"}
                                classNameContentHolder={props.classNameContentHolder}
                            >
                                <InfoView title="Serviço">{service.title}</InfoView>
                                <InfoView title="Valor">{handleMountNumberCurrency(service.value.toString(), ".", ",", 3, 2)}</InfoView>
                                <InfoView title="Quantidade">{service.quantity}</InfoView>
                                <InfoView title="Total">{handleMountNumberCurrency(service.total.toString(), ".", ",", 3, 2)}</InfoView>
                                <InfoView title="Data">{handleUTCToDateShow(service.dateDue?.toString())}</InfoView>
                                <InfoView title="Status">
                                    <ServiceStatusButton
                                        isDisabled={true}
                                        value={service.status}
                                    />
                                </InfoView>
                                {/*
                                        {service.priorityView > 0 && (
                                            <InfoView classNameHolder="w-full" title="Lista de espera">{service.priorityView + ""}</InfoView>
                                        )}
                                {service.status === "FINALIZADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-green-100 bg-green-600 text-[0.8rem] font-bold" title="">{service.status}</InfoView>
                                )}
                                {service.status === "PENDENTE" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-red-100 bg-red-600 text-[0.8rem] font-bold" title="">{service.status}</InfoView>
                                )}
                                {props.showMoreInfo && (
                                    handlePutProject()
                                    )}
                                    <InfoView title="Data criação">{handleUTCToDateShow(service.dateInsertUTC.toString())}</InfoView>
                                    {service.dateLastUpdateUTC > 0 && <InfoView title="Data atualização">{handleUTCToDateShow(service.dateLastUpdateUTC.toString())}</InfoView>}
                                */}
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    {props.dataInside && handlePutData()}
                                </ScrollDownTransition>
                                {props.canShowHideData && props.hideData && hasHideData && (
                                    <SwitchTextButton
                                        isSwitched={isShowInfo}
                                        onClick={() => {
                                            setIsShowInfo(!isShowInfo)
                                        }}
                                    >
                                    </SwitchTextButton>
                                )}
                            </InfoHolderView>
                            <ScrollDownTransition isOpen={isShowInfo}>
                                {!props.dataInside && handlePutData()}
                            </ScrollDownTransition>
                        </>
                    )}
                </>
            )}
        </>
    )
}
