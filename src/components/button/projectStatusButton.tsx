import { useEffect, useState } from "react"
import SwiftInfoButton from "./switchInfoButton"
import { Project } from "../../interfaces/objectInterfaces"

interface ProjectStatusButtonProps {
    id?: string,
    value?: string,
    children?: any,
    isHidden?: boolean,
    isLoading?: boolean,
    isNotFloat?: boolean,
    isDisabled?: boolean,
    project?: Project,
    onClick?: (string) => void,
    onAfter?: (feedbackMessage, project, isForCloseModal) => void,
}

export default function ProjectStatusButton(props: ProjectStatusButtonProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [value, setValue] = useState(props.value)

    useEffect(() => {
        if (isFirst) {
            fetch("api/checkProjectStatus", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", id: props.project.id }),
            }).then((res) => res.json()).then((res) => {
                setIsFirst(false)
                if (res.status === "SUCCESS" && res.data?.length > 0) {
                    setValue(res.data)
                    /*
                    const project = { ...props.project, status: res.data }
                    if (props.onAfter) {
                        props.onAfter(null, project, false)
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
                    isDisabled={true}
                    id={props.id + "-"}
                    value={props.value}
                />
            )}
        </>
    )
}
