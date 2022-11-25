import { useEffect, useState } from "react"

interface ProjectNumberListItemProps {
    id?: string,
}

export default function ProjectNumberListItem(props: ProjectNumberListItemProps) {
    const [lastId, setLastId] = useState(props.id)
    const [projectNumber, setProjectNumber] = useState("")
    const [isFirst, setIsFirst] = useState(props?.id?.length > 0)

    useEffect(() => {
        if (isFirst || props?.id !== lastId) {
            fetch("api/projectNumberForShow/" + props.id).then((res) => res.json()).then((res) => {
                setIsFirst(false)
                if (res?.data?.length > 0) {
                    setLastId(props.id)
                    setProjectNumber(res.data)
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
                    {projectNumber}
                </>
            )}
        </>
    )
}
