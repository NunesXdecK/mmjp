import { useEffect, useState } from "react"
import SwiftInfoButton from "./switchInfoButton"
import { Immobile } from "../../interfaces/objectInterfaces"

interface ImmobileStatusButtonProps {
    id?: string,
    value?: string,
    children?: any,
    isHidden?: boolean,
    isLoading?: boolean,
    isNotFloat?: boolean,
    isDisabled?: boolean,
    immobile?: Immobile,
    onClick?: (string) => void,
    onAfter?: (feedbackMessage, immobile, isForCloseModal) => void,
}

export default function ImmobileStatusButton(props: ImmobileStatusButtonProps) {
    const [isFirst, setIsFirst] = useState(false)
    /*
    const [value, setValue] = useState(props.immobile?.status ?? props.value)
useEffect(() => {
    if (isFirst) {
            fetch("api/checkImmobileStatus", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", id: props.immobile.id }),
            }).then((res) => res.json()).then((res) => {
                setIsFirst(false)
                if (res.status === "SUCCESS" && res.data?.length > 0) {
                    setValue(res.data)
                    const immobile = { ...props.immobile, status: res.data }
                    if (props.onAfter) {
                        props.onAfter(null, immobile, false)
                    }
                }
            })
        }
    })
    */

    return (
        <>
            {isFirst ? (
                <div className="animate-pulse p-2 w-full bg-gray-300 dark:bg-gray-700"></div>
            ) : (
                <SwiftInfoButton
                    value={props.value}
                    id={props.id + "-"}
                    onClick={props.onClick}
                    isDisabled={props.isDisabled}
                    values={["NORMAL", "DESMEMBRADO", "UNIFICADO"]}
                />
            )}
        </>
    )
}
