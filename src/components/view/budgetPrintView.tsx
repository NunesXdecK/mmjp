import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import { Company, defaultProject, Person, Project, Service } from "../../interfaces/objectInterfaces"
import { handleUTCToDateShow } from "../../util/dateUtils"
import { COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import PersonView from "./personView"
import ServicesView from "./servicesView"

interface BudgetPrintViewProps {
    id?: string,
    dataInside?: boolean,
    client?: Person | Company,
    project?: Project,
    services?: Service[],
}

export default function BudgetPrintView(props: BudgetPrintViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [project, setProject] = useState<Project>(props.project ?? defaultProject)
    const [services, setServices] = useState<Service[]>(props.services ?? [])
    const [client, setClient] = useState<Person | Company>(props.client ?? {})


    const handlePutData = () => {
        return (
            <>
                {client && "cpf" in client && (
                    <PersonView
                        person={client}
                        title="Dados do cliente"
                        dataInside id={client.id}
                        classNameTitle="bg-slate-50"
                    />
                )}
                <ServicesView
                    classNameTitle="bg-slate-50"
                    services={services} />
            </>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.id && props.id?.length && project.id?.length === 0) {
                fetch("../api/projectview/" + props.id).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    let client = res.data?.clients[0] ?? {}
                    if (client && client.length) {
                        let array = client.split("/")
                        if (array && array.length > 0) {
                            if (array[0].includes(PERSON_COLLECTION_NAME)) {
                                fetch("../api/person/" + array[1]).then((res) => res.json())
                                    .then((res) => {
                                        setClient(res.data)
                                    })
                            } else if (array[0].includes(COMPANY_COLLECTION_NAME)) {
                                fetch("../api/company/" + array[1]).then((res) => res.json())
                                    .then((res) => {
                                        setClient(res.data)
                                    })
                            }
                        }
                    }
                    setProject(res.data)
                })
                fetch("../api/services/" + props.id).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setServices(res.list)
                })
            }
        }
    })

    return (
        <div className="p-2">
            {project.title?.length === 0 ? (
                <div className="mt-6">
                    <PlaceholderItemList />
                </div>
            ) : (
                <>
                    <InfoHolderView
                        classNameTitle="bg-slate-50"
                        title="Dados do orçamento">
                        {project.number && (<p><span className="font-semibold">Codigo:</span> {project.number}</p>)}
                        {project.title && (<p><span className="font-semibold">Titulo:</span> {project.title}</p>)}
                        {project.date === 0 && project.dateString?.length && (<p><span className="font-semibold">Data:</span> {project.dateString}</p>)}
                        {project.date > 0 && (<p><span className="font-semibold">Data:</span> {handleUTCToDateShow(project.date.toString())}</p>)}
                        {props.dataInside && handlePutData()}
                    </InfoHolderView>
                    {!props.dataInside && handlePutData()}

                </>
            )}
        </div>
    )
}
