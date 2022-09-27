import InfoView from "./infoView"
import Button from "../button/button"
import PersonView from "./personView"
import CompanyView from "./companyView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { defaultProject, Project, Service } from "../../interfaces/objectInterfaces"
import { handleUTCToDateShow } from "../../util/dateUtils"
import ServiceView from "./serviceView"

interface ProjectViewProps {
    id?: string,
    title?: string,
    elementId?: string,
    addressTitle?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideData?: boolean,
    dataInside?: boolean,
    hideBorder?: boolean,
    showMoreInfo?: boolean,
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
        project.clients?.length > 0
    const hasData =
        hasHideData ||
        project?.date > 0 ||
        project?.number?.length ||
        project?.title?.length

    const handlePutOwner = (owner) => {
        return (
            <>
                {owner && "cpf" in owner && (
                    <PersonView
                        hideData
                        dataInside
                        addressTitle={"Endereço"}
                        elementId={owner.id ?? ""}
                        hideBorder={props.showMoreInfo}
                        canShowHideData={!props.showMoreInfo}
                        hidePaddingMargin={props.showMoreInfo}
                        title={props.showMoreInfo ? "" : "Cliente"}
                    />
                )}
                {owner && "cnpj" in owner && (
                    <CompanyView
                        hideData
                        dataInside
                        addressTitle={"Endereço"}
                        elementId={owner.id ?? ""}
                        hideBorder={props.showMoreInfo}
                        canShowHideData={!props.showMoreInfo}
                        hidePaddingMargin={props.showMoreInfo}
                        title={props.showMoreInfo ? "" : "Cliente"}
                    />
                )}
            </>
        )
    }
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
            return dateTwo - dateOne
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
            return dateTwo - dateOne
        }) ?? []
        return (
            <div className="w-full">
                {listClients?.map((owner, index) => (
                    <div key={index + owner}>
                        {/*
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
                        */}
                        {handlePutOwner(owner)}
                    </div>
                ))}


                {listServices?.map((service, index) => (
                    <ServiceView
                        hideData
                        dataInside
                        hideProject
                        canShowHideData
                        elementId={service.id}
                        key={index + service.id}
                        title={"Serviço " + (index + 1)}
                    />
                ))}
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props.elementId.length !== 0 && project.id?.length === 0) {
                fetch("api/projectview/" + props.elementId).then((res) => res.json()).then((res) => {
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
                <div className="mt-6 w-full">
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
                                {project.priorityView > 0 && (
                                    <InfoView classNameHolder="w-full" title="Lista de espera" info={project.priorityView + ""} />
                                )}
                                <InfoView title="Projeto" info={project.title} />
                                <InfoView title="Número" info={project.number} />
                                <InfoView title="Data" info={handleUTCToDateShow(project.date.toString())} />
                                {project.status === "FINALIZADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-green-100 bg-green-600 text-[0.8rem] font-bold" title="" info={project.status} />
                                )}
                                {project.status === "ARQUIVADO" && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-orange-100 bg-orange-600 text-[0.8rem] font-bold" title="" info={project.status} />
                                )}
                                {props.showMoreInfo && (
                                    handlePutOwner(project.clients[0])
                                )}
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoHolderView
                                        hideBorder
                                        hidePaddingMargin
                                    >
                                        <InfoView title="Data criação" info={handleUTCToDateShow(project.dateInsertUTC.toString())} />
                                        {project.dateLastUpdateUTC > 0 && <InfoView title="Data atualização" info={handleUTCToDateShow(project.dateLastUpdateUTC.toString())} />}
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
