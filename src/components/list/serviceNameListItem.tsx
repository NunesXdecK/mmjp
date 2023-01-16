import { useEffect, useState } from "react"

interface ServiceNameListItemProps {
    text?: string,
    elementId?: number,
}

export default function ServiceNameListItem(props: ServiceNameListItemProps) {
    const [lastId, setLastId] = useState(props.elementId)
    const [serviceName, setServiceName] = useState("")
    const [isFirst, setIsFirst] = useState(props?.elementId > 0)

    useEffect(() => {
        if (isFirst || props?.elementId !== lastId) {
            fetch("api/service/" + props.elementId).then((res) => res.json()).then((res) => {
                setIsFirst(false)
                setLastId(props.elementId ?? 0)
                setServiceName(res.data.name ?? "")
            })
        }
    })

    return (
        <>
            {isFirst ? (
                <div className="animate-pulse p-2 w-full bg-gray-300 dark:bg-gray-700"></div>
            ) : (
                <>
                    {serviceName + (props.text ? "/" + props.text : "")}
                </>
            )}
        </>
    )
}
