import { useEffect, useState } from "react"
import SwiftInfoButton from "./switchInfoButton"
import { User } from "../../interfaces/objectInterfaces"

interface UserStatusButtonProps {
    value?: string,
    id?: number,
    isHidden?: boolean,
    isLoading?: boolean,
    isNotFloat?: boolean,
    isDisabled?: boolean,
    children?: any,
    user?: User,
    onClick?: (string) => void,
    onAfter?: (feedbackMessage, user, isForCloseModal) => void,
}

export default function UserStatusButton(props: UserStatusButtonProps) {
    const [isFirst, setIsFirst] = useState(false)
    /*
    const [value, setValue] = useState(props.user?.status ?? props.value)
useEffect(() => {
    if (isFirst) {
            fetch("api/checkUserStatus", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", id: props.user.id }),
            }).then((res) => res.json()).then((res) => {
                setIsFirst(false)
                if (res.status === "SUCCESS" && res.data?.length > 0) {
                    setValue(res.data)
                    const user = { ...props.user, status: res.data }
                    if (props.onAfter) {
                        props.onAfter(null, user, false)
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
                    values={["BLOQUEADO", "ATIVO"]}
                />
            )}
        </>
    )
}
