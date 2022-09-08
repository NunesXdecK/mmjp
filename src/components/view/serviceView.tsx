import InfoView from "./infoView"
import Button from "../button/button"
import ProjectView from "./projectView"
import ImmobileView from "./immobileView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import ProfessionalView from "./professionalView"
import ServiceStageView from "./serviceStageView"
import ServicePaymentView from "./servicePaymentView"
import { handleUTCToDateShow } from "../../util/dateUtils"
import PlaceholderItemList from "../list/placeholderItemList"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { defaultService, Service } from "../../interfaces/objectInterfaces"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"

interface ServiceViewProps {
    id?: string,
    title?: string,
    addressTitle?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideData?: boolean,
    dataInside?: boolean,
    hideBorder?: boolean,
    hideProject?: boolean,
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
        service?.date > 0 ||
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
        let dateOne = 0
        let dateTwo = 0
        if ("index" in elementOne) {
            dateOne = elementOne.index
        }
        if ("index" in elementTwo) {
            dateTwo = elementTwo.index
        }
        return dateTwo - dateOne
    }

    const handlePutData = () => {
        let listServiceStage = service?.serviceStages?.sort(handleSortByIndex) ?? []
        let listServicePayment = service?.servicePayments?.sort(handleSortByIndex) ?? []
        let listTarget = service?.immobilesTarget?.sort(handleSortByData) ?? []
        let listOrigin = service?.immobilesOrigin?.sort(handleSortByData) ?? []
        return (
            <div className="w-full">
                {!props.hideProject && service?.project?.id?.length && (
                    <ProjectView
                        hideData
                        dataInside
                        canShowHideData
                        title="Projeto"
                        id={service.project.id}
                    />
                )}

                {service?.professional?.id?.length && (
                    <ProfessionalView
                        hideData
                        dataInside
                        canShowHideData
                        title="Profissional"
                        id={service.professional.id}
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

                {listServicePayment?.map((servicePayment, index) => (
                    <ServicePaymentView
                        hideData
                        dataInside
                        hideService
                        canShowHideData
                        servicePayment={servicePayment}
                        title={"Pagamento " + (index + 1)}
                        key={index + servicePayment.id}
                    />
                ))}

                {listTarget?.map((immobile, index) => (
                    <ImmobileView
                        hideData
                        dataInside
                        canShowHideData
                        id={immobile.id}
                        title={"Imóvel alvo " + (index + 1)}
                        key={"target-" + index + immobile + service.id}
                    />
                ))}

                {listOrigin?.map((immobile, index) => (
                    <ImmobileView
                        hideData
                        dataInside
                        canShowHideData
                        id={immobile.id}
                        title={"Imóvel de origem " + (index + 1)}
                        key={"origin-" + index + immobile + service.id}
                    />
                ))}
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.id && props.id.length !== 0 && service.id?.length === 0) {
                fetch("api/service/" + props.id).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setService(res.data)
                })
            }
        }
    })

    return (
        <>
            {service.id?.length === 0 ? (
                <div className="mt-6">
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
                                {props.canShowHideData && props.hideData && hasHideData && (
                                    <Button
                                        isLight
                                        className="bg-transparent mr-2 sm:mt-auto"
                                        onClick={() => {
                                            setIsShowInfo(!isShowInfo)
                                        }}
                                    >
                                        {isShowInfo ? (
                                            <ChevronDownIcon className="text-gray-600 block h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <ChevronRightIcon className="text-gray-600 block h-5 w-5" aria-hidden="true" />
                                        )}
                                    </Button>
                                )}
                                {service.status === "FINALIZADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-md px-3 py-1 bg-green-600 text-white" title="Status" info={service.status} />
                                )}
                                {service.status === "ARQUIVADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-md px-3 py-1 bg-orange-600 text-white" title="Status" info={service.status} />
                                )}
                                {service.status === "PENDENTE" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-md px-3 py-1 bg-red-600 text-white" title="Status" info={service.status} />
                                )}
                                <InfoView title="Titulo" info={service.title} />
                                <InfoView title="Valor" info={handleMountNumberCurrency(service.value.toString(), ".", ",", 3, 2)} />
                                <InfoView title="Quantidade" info={service.quantity} />
                                <InfoView title="Total" info={handleMountNumberCurrency(service.total.toString(), ".", ",", 3, 2)} />
                                <InfoView title="Data" info={handleUTCToDateShow(service.date.toString())} />
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoHolderView
                                        hideBorder
                                        hidePaddingMargin
                                    >
                                        <InfoView title="Data criação" info={handleUTCToDateShow(service.dateInsertUTC.toString())} />
                                        {service.dateLastUpdateUTC > 0 && <InfoView title="Data atualização" info={handleUTCToDateShow(service.dateLastUpdateUTC.toString())} />}
                                        {props.dataInside && handlePutData()}
                                    </InfoHolderView>
                                </ScrollDownTransition>
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
