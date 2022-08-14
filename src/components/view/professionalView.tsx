import Button from "../button/button"
import PersonView from "./personView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { defaultProfessional, Professional } from "../../interfaces/objectInterfaces"

interface ProfessionalViewProps {
    id?: string,
    title?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideData?: boolean,
    dataInside?: boolean,
    hideBorder?: boolean,
    canShowHideData?: boolean,
    professional?: Professional,
}

export default function ProfessionalView(props: ProfessionalViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [professional, setProfessional] = useState<Professional>(props.professional ?? defaultProfessional)

    const hasHideData = professional.person?.id?.length
    const hasData = hasHideData || professional?.title?.length

    const handlePutData = () => {
        return (
            <div className="w-full">
                <PersonView
                    hideData
                    dataInside
                    canShowHideData
                    person={professional.person}
                    title={"Dados pessoais"}
                    addressTitle={"Endereço"}
                />
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.id && props.id.length !== 0 && professional.id?.length === 0) {
                fetch("api/professional/" + props.id).then((res) => res.json()).then((res) => {
                    setProfessional(res.data)
                    setIsFirst(false)
                })
            }
        }
    })

    return (
        <>
            {professional.id?.length === 0 ? (
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
                                title={props.title ?? "Dados profissionais"}
                                classNameHolder={props.classNameHolder}
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
                                {professional.title && (<p><span className="font-semibold">Titulo:</span> {professional.title}</p>)}
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoHolderView
                                        classNameHolder="pb-0 pt-0 px-0 mt-0"
                                        classNameContentHolder="py-0 px-0 mt-0"
                                        hideBorder={true}
                                    >
                                        {professional.creaNumber && (<p><span className="font-semibold">CREA:</span> {professional.creaNumber}</p>)}
                                        {professional.credentialCode && (<p><span className="font-semibold">Código credencial:</span> {professional.credentialCode}</p>)}
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
