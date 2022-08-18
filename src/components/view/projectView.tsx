import InfoView from "./infoView"
import Button from "../button/button"
import PersonView from "./personView"
import CompanyView from "./companyView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { defaultProject, Project, Service } from "../../interfaces/objectInterfaces"
import { handleUTCToDateShow } from "../../util/dateUtils"
import { COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import ProfessionalView from "./professionalView"
import ServiceView from "./serviceView"

interface ProjectViewProps {
    id?: string,
    title?: string,
    addressTitle?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideData?: boolean,
    dataInside?: boolean,
    hideBorder?: boolean,
    canShowHideData?: boolean,
    hidePaddingMargin?: boolean,
    project?: Project,
}

export default function ProjectView(props: ProjectViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [project, setProject] = useState<Project>(props.project ?? defaultProject)
    const [services, setServices] = useState<Service[]>([])

    const hasHideData =
        project.professional?.id > 0 ||
        project.clients?.length > 0
    const hasData =
        hasHideData ||
        project?.date > 0 ||
        project?.number?.length ||
        project?.title?.length

    const handlePutData = () => {
        let listClients = project?.clients?.sort((elementOne, elementTwo) => {
            let dateOne = 0
            let dateTwo = 0
            if ("dateInsertUTC" in elementOne) {
                dateOne = elementOne.dateInsertUTC
            }
            if ("dateInsertUTC" in elementTwo) {
                dateTwo = elementTwo.dateInsertUTC
            }
            return dateOne - dateTwo
        }) ?? []
        let listServices = services?.sort((elementOne, elementTwo) => {
            let dateOne = 0
            let dateTwo = 0
            if ("index" in elementOne) {
                dateOne = elementOne.index
            }
            if ("index" in elementTwo) {
                dateTwo = elementTwo.index
            }
            return dateOne - dateTwo
        }) ?? []
        return (
            <div className="w-full">
                {listClients?.map((owner, index) => (
                    <div key={index + owner}>
                        {owner?.length && owner.includes(PERSON_COLLECTION_NAME) && (
                            <PersonView
                                hideData
                                dataInside
                                canShowHideData
                                addressTitle={"Endereço"}
                                title={"Cliente"}
                                id={owner.split("/")[1] ?? ""}
                            />
                        )}
                        {owner?.length && owner.includes(COMPANY_COLLECTION_NAME) && (
                            <CompanyView
                                hideData
                                dataInside
                                canShowHideData
                                addressTitle={"Endereço"}
                                title={"Cliente"}
                                id={owner.split("/")[1] ?? ""}
                            />
                        )}
                    </div>
                ))}

                {project.professional?.length && (
                    <ProfessionalView
                        hideData
                        dataInside
                        canShowHideData
                        title="Profissional"
                        id={project.professional}
                    />
                )}

                {listServices?.map((service, index) => (
                    <ServiceView
                        hideData
                        dataInside
                        hideProject
                        canShowHideData
                        id={service.id}
                        key={index + service.id}
                        title={"Serviço " + (index + 1)}
                    />
                ))}
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.id && props.id.length !== 0 && project.id?.length === 0) {
                fetch("api/projectview/" + props.id).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setProject(res.data)
                    fetch("api/services/" + res.data.id).then((res) => res.json()).then((res) => {
                        setServices(res.list)
                    })
                })
            }
        }
    })

    return (
        <>
            {project.id?.length === 0 ? (
                <div className="mt-6">
                    <PlaceholderItemList />
                </div>
            ) : (
                <>
                    {hasData && (
                        <>
                            <InfoHolderView
                                hideBorder={props.hideBorder}
                                classNameTitle={props.classNameTitle}
                                classNameHolder={props.classNameHolder}
                                hidePaddingMargin={props.hidePaddingMargin}
                                title={props.title ?? "Dados básicos"}
                                classNameContentHolder={props.classNameContentHolder}
                            >
                                {props.canShowHideData && props.hideData && hasHideData && (
                                    <Button
                                        isLight
                                        className="bg-transparent mr-2 sm:mt-auto"
                                        onClick={() => {
                                            setIsShowInfo(!isShowInfo)
                                        }}
                                    >
                                        {isShowInfo ? (
                                            <ChevronDownIcon className="text-gray-600 block h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <ChevronRightIcon className="text-gray-600 block h-5 w-5" aria-hidden="true" />
                                        )}
                                    </Button>
                                )}
                                {project.status === "FINALIZADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-md px-3 py-1 bg-green-600 text-white" title="Status" info={project.status} />
                                )}
                                {project.status === "ARQUIVADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-md px-3 py-1 bg-orange-600 text-white" title="Status" info={project.status} />
                                )}
                                <InfoView title="Titulo" info={project.title} />
                                <InfoView title="Número" info={project.number} />
                                <InfoView title="Data" info={handleUTCToDateShow(project.date.toString())} />
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoHolderView
                                        hideBorder
                                        hidePaddingMargin
                                    >
                                        {props.dataInside && handlePutData()}
                                    </InfoHolderView>
                                </ScrollDownTransition>
                            </InfoHolderView>
                            <ScrollDownTransition isOpen={isShowInfo}>
                                {!props.dataInside && handlePutData()}
                            </ScrollDownTransition>
                        </>
                    )}
                </>
            )}
        </>
    )
}
