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
    const [lastValue, setLastValue] = useState(props.value)
    const [isFirst, setIsFirst] = useState(props.value === "EM ABERTO")

    useEffect(() => {
        if (isFirst || props?.value !== lastValue) {
                fetch("api/checkPaymentStatus", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", id: props?.payment?.id }),
                }).then((res) => res.json()).then((res) => {
                    setIsFirst(false)
                    if (res.status === "SUCCESS" && res.data?.length > 0) {
                        setLastValue(res.data)
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
    let values = ["EM ABERTO", "PAGO", "ATRASADO"]
    if (props.value === "ATRASADO") {
        values = ["PAGO", "ATRASADO"]
    }

    return (
        <>
            {isFirst ? (
                <div className="animate-pulse p-2 w-full bg-gray-300 dark:bg-gray-700"></div>
            ) : (
                <SwiftInfoButton
                    values={values}
                    value={props.value}
                    id={props.id + "-"}
                    onClick={props.onClick}
                    isDisabled={props.isDisabled}
                />
            )}
        </>
    )
}
