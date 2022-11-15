import { useEffect, useState } from "react"
import SwiftInfoButton from "./switchInfoButton"
import { Service } from "../../interfaces/objectInterfaces"

interface ServiceStatusButtonProps {
    id?: string,
    value?: string,
    children?: any,
    isHidden?: boolean,
    isLoading?: boolean,
    isNotFloat?: boolean,
    isDisabled?: boolean,
    service?: Service,
    onClick?: (string) => void,
    onAfter?: (feedbackMessage, service, isForCloseModal) => void,
}

export default function ServiceStatusButton(props: ServiceStatusButtonProps) {
    const [isFirst, setIsFirst] = useState(props.service?.project?.id?.length > 0)
    const [value, setValue] = useState(props.value)

    useEffect(() => {
        if (isFirst) {
            fetch("api/checkServiceStatus", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", id: props.service.id }),
            }).then((res) => res.json()).then((res) => {
                setIsFirst(false)
                if (res.status === "SUCCESS" && res.data?.length > 0) {
                    setValue(res.data)
                    /*
                    const service = { ...props.service, status: res.data }
                    if (props.onAfter) {
                        props.onAfter(null, service, false)
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
                    value={value}
                    id={props.id + "-"}
                    isDisabled={props.isDisabled}
                    values={[
                        "EM ANDAMENTO",
                        "FINALIZADO",
                        "PARADO",
                        "PENDENTE",
                    ]}
                    onClick={props.onClick}
                />
            )}
        </>
    )
}
