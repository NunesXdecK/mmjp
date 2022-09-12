import InfoView from "./infoView"
import Button from "../button/button"
import ServiceView from "./serviceView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import { handleUTCToDateShow } from "../../util/dateUtils"
import PlaceholderItemList from "../list/placeholderItemList"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { defaultServicePayment, ServicePayment } from "../../interfaces/objectInterfaces"

interface ServicePaymentViewProps {
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
    canShowHideData?: boolean,
    hidePaddingMargin?: boolean,
    servicePayment?: ServicePayment,
}

export default function ServicePaymentView(props: ServicePaymentViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [servicePayment, setServicePayment] = useState<ServicePayment>(props.servicePayment ?? defaultServicePayment)

    const hasHideData =
        servicePayment.service?.id > 0

    const hasData =
        hasHideData ||
        servicePayment?.dateDue > 0 ||
        servicePayment?.description?.length

    const handlePutData = () => {
        return (
            <div className="w-full">
                {!props.hideService && servicePayment?.service?.id?.length && (
                    <ServiceView
                        hideData
                        dataInside
                        canShowHideData
                        title="Serviço"
                        elementId={servicePayment.service.id}
                    />
                )}
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props.elementId.length !== 0 && servicePayment.id?.length === 0) {
                fetch("api/servicePayment/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setServicePayment(res.data)
                })
            }
        }
    })

    return (
        <>
            {servicePayment.id?.length === 0 ? (
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
                                {servicePayment.status === "FINALIZADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-md px-3 py-1 bg-green-600 text-white" title="Status" info={servicePayment.status} />
                                )}
                                {servicePayment.status === "ARQUIVADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-md px-3 py-1 bg-orange-600 text-white" title="Status" info={servicePayment.status} />
                                )}
                                {servicePayment.status === "PENDENTE" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-md px-3 py-1 bg-red-600 text-white" title="Status" info={servicePayment.status} />
                                )}
                                <InfoView title="Descrição" info={servicePayment.description} />
                                <InfoView title="Valor" info={handleMountNumberCurrency(servicePayment.value.toString(), ".", ",", 3, 2)} />
                                <InfoView title="Data" info={handleUTCToDateShow(servicePayment.dateDue.toString())} />
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoHolderView
                                        hideBorder
                                        hidePaddingMargin
                                    >
                                        <InfoView title="Data criação" info={handleUTCToDateShow(servicePayment.dateInsertUTC.toString())} />
                                        {servicePayment.dateLastUpdateUTC > 0 && <InfoView title="Data atualização" info={handleUTCToDateShow(servicePayment.dateLastUpdateUTC.toString())} />}
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
