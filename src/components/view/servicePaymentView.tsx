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
import SwitchTextButton from "../button/switchTextButton"

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
    showMoreInfo?: boolean,
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

    const handlePutService = () => {
        return (
            <>
                {servicePayment?.service?.id?.length && (
                    <ServiceView
                        hideData
                        dataInside
                        classNameHolder="min-w-full"
                        hideBorder={props.showMoreInfo}
                        classNameContentHolder="min-w-full"
                        elementId={servicePayment.service.id}
                        canShowHideData={!props.showMoreInfo}
                        hidePaddingMargin={props.showMoreInfo}
                        title={props.showMoreInfo ? "" : "Serviço"}
                        id={servicePayment.id + "-" + servicePayment.service.id}
                    />
                )}
            </>
        )
    }

    const handlePutData = () => {
        return (
            <div className="w-full">
                {!props.hideService && handlePutService()}
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
                                <InfoView title="Pagamento">{servicePayment.description}</InfoView>
                                <InfoView title="Valor">{handleMountNumberCurrency(servicePayment.value.toString(), ".", ",", 3, 2)}</InfoView>
                                <InfoView title="Data">{handleUTCToDateShow(servicePayment.dateDue?.toString())}</InfoView>
                                {servicePayment.status === "FINALIZADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-green-100 bg-green-600 text-[0.8rem] font-bold" title="">{servicePayment.status}</InfoView>
                                )}
                                {servicePayment.status === "ARQUIVADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-orange-100 bg-orange-600 text-[0.8rem] font-bold" title="">{servicePayment.status}</InfoView>
                                )}
                                {servicePayment.status === "PENDENTE" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-red-100 bg-red-600 text-[0.8rem] font-bold" title="">{servicePayment.status}</InfoView>
                                )}
                                {props.showMoreInfo && (
                                    <>
                                        {handlePutService()}
                                    </>
                                )}
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoView title="Data criação">{handleUTCToDateShow(servicePayment.dateInsertUTC.toString())}</InfoView>
                                    {servicePayment.dateLastUpdateUTC > 0 && <InfoView title="Data atualização">{handleUTCToDateShow(servicePayment.dateLastUpdateUTC.toString())}</InfoView>}
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
