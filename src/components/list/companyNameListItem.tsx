import { useEffect, useState } from "react"

interface CompanyNameListItemProps {
    id?: string,
}

export default function CompanyNameListItem(props: CompanyNameListItemProps) {
    const [name, setName] = useState("")
    const [isFirst, setIsFirst] = useState(props?.id?.length > 0)

    useEffect(() => {
        if (isFirst && props?.id?.length > 0) {
            fetch("api/companyNameForShow/" + props.id).then((res) => res.json()).then((res) => {
                setIsFirst(false)
                if (res?.data?.length > 0) {
                    setName(res.data)
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
                    {name}
                </>
            )}
        </>
    )
}
