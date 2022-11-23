import InfoView from "./infoView"
import ProjectView from "./projectView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import SwitchTextButton from "../button/switchTextButton"
import { handleUTCToDateShow } from "../../util/dateUtils"
import PlaceholderItemList from "../list/placeholderItemList"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { defaultPayment, Payment } from "../../interfaces/objectInterfaces"
import PaymentStatusButton from "../button/paymentStatusButton"

interface PaymentViewProps {
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
    payment?: Payment,
}

export default function PaymentView(props: PaymentViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [payment, setPayment] = useState<Payment>(props.payment ?? defaultPayment)

    const hasHideData =
        payment.project?.id > 0

    const hasData =
        hasHideData ||
        payment?.dateDue > 0 ||
        payment?.title?.length

    const handlePutProject = () => {
        return (
            <>
                {payment?.project?.id?.length && (
                    <ProjectView
                        hideData
                        dataInside
                        classNameHolder="min-w-full"
                        hideBorder={props.showMoreInfo}
                        classNameContentHolder="min-w-full"
                        elementId={payment.project.id}
                        canShowHideData={!props.showMoreInfo}
                        hidePaddingMargin={props.showMoreInfo}
                        title={props.showMoreInfo ? "" : "Projeto"}
                        id={payment.id + "-" + payment.project.id}
                    />
                )}
            </>
        )
    }

    const handlePutData = () => {
        return (
            <div className="w-full">
                {!props.hideProject && handlePutProject()}
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props.elementId.length !== 0 && payment.id?.length === 0) {
                fetch("api/payment/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setPayment(res.data)
                })
            }
        }
    })

    return (
        <>
            {payment.id?.length === 0 ? (
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
                                <InfoView title="Pagamento">{payment.title}</InfoView>
                                <InfoView title="Valor">{handleMountNumberCurrency(payment.value.toString(), ".", ",", 3, 2)}</InfoView>
                                <InfoView title="Data">{handleUTCToDateShow(payment.dateDue?.toString())}</InfoView>
                                <InfoView title="Status">
                                    <PaymentStatusButton
                                        isDisabled={true}
                                        value={payment.status}
                                    />
                                </InfoView>
                                {/*
                                {payment.status === "FINALIZADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-green-100 bg-green-600 text-[0.8rem] font-bold" title="">{payment.status}</InfoView>
                                )}
                                {payment.status === "ARQUIVADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-orange-100 bg-orange-600 text-[0.8rem] font-bold" title="">{payment.status}</InfoView>
                                )}
                                {payment.status === "PENDENTE" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-red-100 bg-red-600 text-[0.8rem] font-bold" title="">{payment.status}</InfoView>
                                )}
                                        <InfoView title="Data criação">{handleUTCToDateShow(payment.dateInsertUTC.toString())}</InfoView>
                                        {payment.dateLastUpdateUTC > 0 && <InfoView title="Data atualização">{handleUTCToDateShow(payment.dateLastUpdateUTC.toString())}</InfoView>}
                                    */}
                                {props.showMoreInfo && (
                                    <>
                                        {handlePutProject()}
                                    </>
                                )}
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoView title="Descrição">{payment.description}</InfoView>
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
