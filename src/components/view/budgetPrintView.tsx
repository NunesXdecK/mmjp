import PersonView from "./personView"
import ServicesView from "./servicesView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import { handleUTCToDateShow } from "../../util/dateUtils"
import PlaceholderItemList from "../list/placeholderItemList"
import { Company, defaultProject, Person, Project, Service } from "../../interfaces/objectInterfaces"

interface BudgetPrintViewProps {
    id?: string,
    elementId?: string,
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
                        dataInside
                        person={client}
                        elementId={client.id}
                        title="Dados do cliente"
                        classNameTitle="bg-slate-50"
                    />
                )}
                <ServicesView
                    services={services}
                    classNameTitle="bg-slate-50"
                />
            </>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props.elementId?.length && project.id?.length === 0) {
                fetch("../api/projectview/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    let client = res.data?.clients[0] ?? {}
                    if (client) {
                        if ("cpf" in client) {
                            fetch("../api/person/" + client.id).then((res) => res.json())
                                .then((res) => {
                                    setClient(res.data)
                                })
                        } else if ("cnpj" in client) {
                            fetch("../api/company/" + client.id).then((res) => res.json())
                                .then((res) => {
                                    setClient(res.data)
                                })
                        }
                    }
                    setProject(res.data)
                    /*
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
                        */
                })
                fetch("../api/services/" + props.elementId).then((res) => res.json()).then((res) => {
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
