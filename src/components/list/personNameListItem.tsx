import { useEffect, useState } from "react"

interface PersonNameListItemProps {
    id?: string,
}

export default function PersonNameListItem(props: PersonNameListItemProps) {
    const [personName, setPersonName] = useState("")
    const [isFirst, setIsFirst] = useState(props?.id?.length > 0)

    useEffect(() => {
        if (isFirst && props?.id?.length > 0) {
            fetch("api/personNameForShow/" + props.id).then((res) => res.json()).then((res) => {
                setIsFirst(false)
                if (res?.data?.length > 0) {
                    setPersonName(res.data)
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
                    {personName}
                </>
            )}
        </>
    )
}
