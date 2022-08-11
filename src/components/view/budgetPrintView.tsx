import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import { Company, defaultProject, Person, Project, Service } from "../../interfaces/objectInterfaces"
import { handleUTCToDateShow } from "../../util/dateUtils"
import { COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import PersonView from "./personView"

interface BudgetPrintViewProps {
    id?: string,
    project?: Project,
    dataInside?: boolean,
}

export default function BudgetPrintView(props: BudgetPrintViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [project, setProject] = useState<Project>(props.project ?? defaultProject)
    const [services, setServices] = useState<Service[]>([])
    const [client, setClient] = useState<Person | Company>({})

    const handlePutData = () => {
        return (
            <span>kaka</span>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.id && props.id?.length && project.id?.length === 0) {
                fetch("../api/projectview/" + props.id).then((res) => res.json()).then((res) => {
                    let client = res.data?.clients[0] ?? {}
                    if (client && client.length) {
                        let array = client.split("/")
                        if (array && array.length > 0) {
                            if (array[0].includes(PERSON_COLLECTION_NAME)) {
                                fetch("../api/person/" + array[1]).then((res) => res.json())
                                    .then((res) => setClient(res.data))
                            } else if (array[0].includes(COMPANY_COLLECTION_NAME)) {
                                fetch("../api/company/" + array[1]).then((res) => res.json())
                                    .then((res) => setClient(res.data))
                            }
                        }
                    }
                    setProject(res.data)
                    setIsFirst(false)
                })
                fetch("../api/services/" + props.id).then((res) => res.json()).then((res) => {
                    setServices(res.list)
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
                    {services.map((element, index) => (
                        <>{element.title}</>
                    ))}
                    {client && "cpf" in client && (
                        <PersonView dataInside id={client.id} person={client} />
                    )}
                </>
            )}
        </div>
    )
}
