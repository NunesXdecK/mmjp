import InfoView from "./infoView"
import Button from "../button/button"
import ServiceView from "./serviceView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import ProfessionalView from "./professionalView"
import { handleUTCToDateShow } from "../../util/dateUtils"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { defaultServiceStage, ServiceStage } from "../../interfaces/objectInterfaces"

interface ServiceStageViewProps {
    id?: string,
    title?: string,
    addressTitle?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideData?: boolean,
    dataInside?: boolean,
    hideBorder?: boolean,
    hideService?: boolean,
    canShowHideData?: boolean,
    hidePaddingMargin?: boolean,
    serviceStage?: ServiceStage,
}

export default function ServiceStageView(props: ServiceStageViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [serviceStage, setServiceStage] = useState<ServiceStage>(props.serviceStage ?? defaultServiceStage)

    const hasHideData =
        serviceStage.description?.length ||
        serviceStage.service?.id > 0 ||
        serviceStage.responsible?.id > 0

    const hasData =
        hasHideData ||
        serviceStage?.dateDue > 0 ||
        serviceStage?.title?.length

    const handlePutData = () => {
        return (
            <div className="w-full">
                {!props.hideService && serviceStage?.service?.id?.length && (
                    <ServiceView
                        hideData
                        dataInside
                        canShowHideData
                        id={serviceStage.service.id}
                    />
                )}

                {serviceStage?.responsible?.id?.length && (
                    <ProfessionalView
                        hideData
                        dataInside
                        canShowHideData
                        id={serviceStage.responsible.id}
                    />
                )}
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.id && props.id.length !== 0 && serviceStage.id?.length === 0) {
                fetch("api/serviceStage/" + props.id).then((res) => res.json()).then((res) => {
                    console.log(res.data)
                    setIsFirst(old => false)
                    setServiceStage(res.data)
                })
            }
        }
    })

    return (
        <>
            {serviceStage.id?.length === 0 ? (
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
                                <InfoView title="Titulo" info={serviceStage.title} />
                                <InfoView title="Status" info={serviceStage.status} />
                                <InfoView title="Data" info={handleUTCToDateShow(serviceStage.dateDue.toString())} />
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoHolderView
                                        hideBorder
                                        hidePaddingMargin
                                    >
                                        <InfoView title="Descrição" info={serviceStage.description} />
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
