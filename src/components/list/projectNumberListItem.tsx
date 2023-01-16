import { useEffect, useState } from "react"

interface ProjectNumberListItemProps {
    text?: string,
    elementId?: number,
}

export default function ProjectNumberListItem(props: ProjectNumberListItemProps) {
    const [lastId, setLastId] = useState(props.elementId)
    const [projectNumber, setProjectNumber] = useState("")
    const [isFirst, setIsFirst] = useState(props?.elementId > 0)

    useEffect(() => {
        if (isFirst || props?.elementId !== lastId) {
            fetch("api/project/" + props.elementId).then((res) => res.json()).then((res) => {
                console.log(res)
                setIsFirst(false)
                setLastId(props.elementId ?? 0)
                setProjectNumber(res.data.number ?? "")
            })
        }
    })

    return (
        <>
            {isFirst ? (
                <div className="animate-pulse p-2 w-full bg-gray-300 dark:bg-gray-700"></div>
            ) : (
                <>
                    {projectNumber + (props.text ? "/" + props.text : "")}
                </>
            )}
        </>
    )
}
