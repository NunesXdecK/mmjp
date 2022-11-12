import { useEffect, useState } from "react"
import SwiftInfoButton from "./switchInfoButton"
import { Payment } from "../../interfaces/objectInterfaces"

interface PaymentStatusButtonProps {
    id?: string,
    value?: string,
    children?: any,
    isHidden?: boolean,
    isLoading?: boolean,
    isNotFloat?: boolean,
    isDisabled?: boolean,
    payment?: Payment,
    onClick?: (string) => void,
    onAfter?: (feedbackMessage, payment, isForCloseModal) => void,
}

export default function PaymentStatusButton(props: PaymentStatusButtonProps) {
    const [isFirst, setIsFirst] = useState(props.payment?.project?.id?.length > 0)
    const [value, setValue] = useState(props.value)

    useEffect(() => {
        if (isFirst) {
            fetch("api/checkPaymentStatus", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", id: props.payment.id }),
            }).then((res) => res.json()).then((res) => {
                setIsFirst(false)
                if (res.status === "SUCCESS" && res.data?.length > 0) {
                    setValue(res.data)
                    /*
                    const payment = { ...props.payment, status: res.data }
                    if (props.onAfter) {
                        props.onAfter(null, payment, false)
                    }
                    */
                }
            })
        }
    })

    return (
        <>
            {isFirst ? (
                <div className="animate-pulse p-2 w-full bg-gray-300 dark:bg-gray-700"></div>
            ) : (
                <SwiftInfoButton
                    id={props.id + "-"}
                    value={props.value}
                    isDisabled={props.isDisabled}
                    values={[
                        "EM ABERTO",
                        "PAGO",
                    ]}
                    onClick={props.onClick}
                />
            )}
        </>
    )
}
