import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import { Company, defaultProject, Person, Project, Service } from "../../interfaces/objectInterfaces"
import { handleUTCToDateShow } from "../../util/dateUtils"
import { COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import PersonView from "./personView"
import ServicesView from "./servicesView"

interface ContractPrintViewProps {
    id?: string,
    dataInside?: boolean,
    client?: Person | Company,
    project?: Project,
    services?: Service[],
}

export default function ContractPrintView(props: ContractPrintViewProps) {
    const [project, setProject] = useState<Project>(props.project ?? defaultProject)
    const [services, setServices] = useState<Service[]>(props.services ?? [])
    const [client, setClient] = useState<Person | Company>(props.client ?? {})

    const classTitle = "text-center"

    return (
        <div className="p-2">
            <p className={classTitle}>MODELO BÁSICO DE CONTRATO SOCIAL</p>
            <p className={classTitle}>SOCIEDADE SIMPLES PURA OU LIMITADA</p>
            <p className={classTitle}>CONTRATO DE CONSTITUIÇÃO DE: _____________________</p>
            <br />
            <br />
            <div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                <br />
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                <br />
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                <br />
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                blablablablebleble blablablablebleble blablablablebleble blablablablebleble blablablablebleble
                <br />
            </div>

            <br />
            <br />
            <br />
            <p className={classTitle}>____________________________</p>
            <p className={classTitle}>HOMI QUE ASSINA</p>
        </div>
    )
}
