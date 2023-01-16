import InfoView from "./infoView"
import Button from "../button/button"
import PersonView from "./personView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { defaultProfessional, Professional } from "../../interfaces/objectInterfaces"
import { handleUTCToDateShow } from "../../util/dateUtils"
import SwitchTextButton from "../button/switchTextButton"

interface ProfessionalViewProps {
    id?: string,
    title?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    elementId?: number,
    hideData?: boolean,
    dataInside?: boolean,
    hideBorder?: boolean,
    canShowHideData?: boolean,
    hidePaddingMargin?: boolean,
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
                    title={"Dados pessoais"}
                    addressTitle={"Endereço"}
                    person={professional.person}
                />
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props?.elementId > 0 && professional?.id === 0) {
                fetch("api/professional/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setProfessional(res.data)
                })
            }
        }
    })

    return (
        <>
            {professional?.id === 0 ? (
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
                                title={props.title ?? "Dados profissionais"}
                                classNameContentHolder={props.classNameContentHolder}
                            >
                                <InfoView title="Titulo do profissional">{professional.title}</InfoView>
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoView title="CREA">{professional.creaNumber}</InfoView>
                                    <InfoView title="Código credencial">{professional.credentialCode}</InfoView>
                                    {/*
                                    <InfoView title="Data criação">{handleUTCToDateShow(professional.dateInsertUTC.toString())}</InfoView>
                                    {professional.dateLastUpdateUTC > 0 && <InfoView title="Data atualização">{handleUTCToDateShow(professional.dateLastUpdateUTC.toString())}</InfoView>}
                                    */}
                                    {props.dataInside && handlePutData()}
                                </ScrollDownTransition>
                                {props.canShowHideData && props.hideData && hasHideData && (
                                    <SwitchTextButton
                                        isSwitched={isShowInfo}
                                        onClick={() => {
                                            setIsShowInfo(!isShowInfo)
                                        }}
                                    >
                                    </SwitchTextButton>
                                )}
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
