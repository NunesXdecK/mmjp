import InfoView from "./infoView"
import UserView from "./userView"
import Button from "../button/button"
import ServiceView from "./serviceView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import { handleUTCToDateShow } from "../../util/dateUtils"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { defaultServiceStage, ServiceStage } from "../../interfaces/objectInterfaces"

interface ServiceStageViewProps {
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
    hideService?: boolean,
    showMoreInfo?: boolean,
    canShowHideData?: boolean,
    hidePaddingMargin?: boolean,
    serviceStage?: ServiceStage,
}

export default function ServiceStageView(props: ServiceStageViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [serviceStage, setServiceStage] = useState<ServiceStage>(props.serviceStage ?? defaultServiceStage)

    const hasHideData =
        serviceStage.responsible?.id?.length ||
        serviceStage.description?.length ||
        serviceStage.service?.id > 0

    const hasData =
        hasHideData ||
        serviceStage?.dateDue > 0 ||
        serviceStage?.title?.length

    const handlePutService = () => {
        return (
            <>
                {serviceStage?.service?.id?.length && (
                    <ServiceView
                        hideData
                        dataInside
                        hideBorder={props.showMoreInfo}
                        elementId={serviceStage.service.id}
                        canShowHideData={!props.showMoreInfo}
                        hidePaddingMargin={props.showMoreInfo}
                        title={props.showMoreInfo ? "" : "Serviço"}
                        id={serviceStage.id + "-" + serviceStage.service.id}
                    />
                )}
            </>
        )
    }
    const handlePutData = () => {
        return (
            <div className="w-full">
                {!props.hideService && handlePutService()}

                {serviceStage?.responsible?.id?.length && (
                    <UserView
                        hideData
                        dataInside
                        canShowHideData
                        title="Responsável"
                        elementId={serviceStage.responsible.id}
                        id={serviceStage.id + "-" + serviceStage.responsible.id}
                    />
                )}
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props.elementId.length !== 0 && serviceStage.id?.length === 0) {
                fetch("api/serviceStage/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setServiceStage(res.data)
                })
            }
        }
    })

    return (
        <>
            {serviceStage.id?.length === 0 ? (
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
                                {serviceStage.priorityView > 0 && (
                                    <InfoView classNameHolder="w-full" title="Lista de espera">{serviceStage.priorityView + ""}</InfoView>
                                )}
                                <InfoView title="Etapa">{serviceStage.title}</InfoView>
                                <InfoView title="Data">{handleUTCToDateShow(serviceStage.dateDue.toString())}</InfoView>
                                {serviceStage.status === "FINALIZADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-green-100 bg-green-600 text-[0.8rem] font-bold" title="">{serviceStage.status}</InfoView>
                                )}
                                {serviceStage.status === "ARQUIVADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-orange-100 bg-orange-600 text-[0.8rem] font-bold" title="">{serviceStage.status}</InfoView>
                                )}
                                {serviceStage.status === "PENDENTE" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-red-100 bg-red-600 text-[0.8rem] font-bold" title="">{serviceStage.status}</InfoView>
                                )}
                                {props.showMoreInfo && (
                                    handlePutService()
                                )}
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoView title="Descrição">{serviceStage.description}</InfoView>
                                    <InfoView title="Data criação">{handleUTCToDateShow(serviceStage.dateInsertUTC.toString())}</InfoView>
                                    {serviceStage.dateLastUpdateUTC > 0 && <InfoView title="Data atualização">{handleUTCToDateShow(serviceStage.dateLastUpdateUTC.toString())}</InfoView>}
                                    {props.dataInside && handlePutData()}
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
