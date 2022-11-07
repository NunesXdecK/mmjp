import { useEffect, useState } from "react"

interface UserNameListItemProps {
    id?: string,
}

export default function UserNameListItem(props: UserNameListItemProps) {
    const [userName, serUserName] = useState("")
    const [isFirst, setIsFirst] = useState(props?.id?.length > 0)

    useEffect(() => {
        if (isFirst && props?.id?.length > 0) {
            fetch("api/userNameForShow/" + props.id).then((res) => res.json()).then((res) => {
                setIsFirst(false)
                serUserName(res.data)
            })
        }
    })

    return (
        <>
            {isFirst ? (
                <div className="animate-pulse p-2 w-full bg-gray-300 dark:bg-gray-700"></div>
            ) : (
                <>
                    {userName}
                </>
            )}
        </>
    )
}
