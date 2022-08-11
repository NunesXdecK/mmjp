import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import { defaultProject, Project } from "../../interfaces/objectInterfaces"
import { handleUTCToDateShow } from "../../util/dateUtils"

interface BudgetPrintViewProps {
    id?: string,
    project?: Project,
    dataInside?: boolean,
}

export default function BudgetPrintView(props: BudgetPrintViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [project, setProject] = useState<Project>(props.project ?? defaultProject)

    const handlePutData = () => {
        return (
            <span>kaka</span>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.id && props.id?.length && project.id?.length === 0) {
                fetch("../api/project/" + props.id).then((res) => res.json()).then((res) => {
                    setProject(res.data)
                    setIsFirst(false)
                })
            }
        }
    })

    return (
        <div className="p-4">
            {project.id?.length === 0 ? (
                <div className="mt-6">
                    <PlaceholderItemList />
                </div>
            ) : (
                <>
                    <InfoHolderView
                        classNameTitle="bg-slate-50"
                        title="Dados básicos do projeto">
                        {project.number && (<p><span className="font-semibold">Codigo do projeto:</span> {project.number}</p>)}
                        {project.title && (<p><span className="font-semibold">Titulo:</span> {project.title}</p>)}
                        {project.date && (<p><span className="font-semibold">Data:</span> {handleUTCToDateShow(project.date.toString())}</p>)}
                        {props.dataInside && handlePutData()}
                    </InfoHolderView>
                    {!props.dataInside && handlePutData()}
                </>
            )}
        </div>
    )
}
