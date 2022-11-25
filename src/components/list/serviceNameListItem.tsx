import { useEffect, useState } from "react"

interface ServiceNameListItemProps {
    id?: string,
}

export default function ServiceNameListItem(props: ServiceNameListItemProps) {
    const [lastId, setLastId] = useState(props.id)
    const [serviceName, serServiceName] = useState("")
    const [isFirst, setIsFirst] = useState(props?.id?.length > 0)

    useEffect(() => {
        if (isFirst || props?.id !== lastId) {
            fetch("api/serviceNameForShow/" + props.id).then((res) => res.json()).then((res) => {
                setIsFirst(false)
                if (res?.data?.length > 0) {
                    setLastId(props.id)
                    serServiceName(res.data)
                }
            })
        }
    })

    return (
        <>
            {isFirst ? (
                <div className="animate-pulse p-2 w-full bg-gray-300 dark:bg-gray-700"></div>
            ) : (
                <>
                    {serviceName}
                </>
            )}
        </>
    )
}
