import InfoView from "./infoView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import SwitchTextButton from "../button/switchTextButton"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { defaultImmobilePoint, ImmobilePoint } from "../../interfaces/objectInterfaces"

interface ImmobilePointViewProps {
    id?: string,
    title?: string,
    addressTitle?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    elementId?: number,
    hideData?: boolean,
    dataInside?: boolean,
    hideBorder?: boolean,
    canShowHideData?: boolean,
    hidePaddingMargin?: boolean,
    immobilePoint?: ImmobilePoint,
}

export default function ImmobilePointView(props: ImmobilePointViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [immobilePoint, setImmobilePoint] = useState<ImmobilePoint>(props.immobilePoint ?? defaultImmobilePoint)

    const hasHideData =
        immobilePoint.type?.length ||
        immobilePoint.epoch?.length ||
        immobilePoint.gnssType?.length ||
        immobilePoint.eastingX?.length ||
        immobilePoint.northingY?.length ||
        immobilePoint.frequency?.length ||
        immobilePoint.description?.length ||
        immobilePoint.posnQuality?.length ||
        immobilePoint.storedStatus?.length ||
        immobilePoint.solutionType?.length ||
        immobilePoint.elipseHeightZ?.length ||
        immobilePoint.heightQuality?.length ||
        immobilePoint.ambiguityStatus?.length ||
        immobilePoint.posnHeightQuality?.length

    const hasData =
        hasHideData ||
        immobilePoint.pointId?.length

    const handlePutData = () => {
        return (
            <></>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props.elementId > 0) {
                fetch("api/point/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setImmobilePoint(res.data)
                })
            }
        }
    })
    return (
        <>
            {immobilePoint?.id === 0 ? (
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
                                title={props.title ?? "Dados pessoais"}
                                classNameHolder={props.classNameHolder}
                                hidePaddingMargin={props.hidePaddingMargin}
                                classNameContentHolder={props.classNameContentHolder}
                            >
                                <InfoView title="ID do ponto">{immobilePoint.pointId}</InfoView>
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoView title="Epoch">{immobilePoint.epoch}</InfoView>
                                    <InfoView title="Easting X">{immobilePoint.eastingX}</InfoView>
                                    <InfoView title="Northing Y">{immobilePoint.northingY}</InfoView>
                                    <InfoView title="Elipse Height Z">{immobilePoint.elipseHeightZ}</InfoView>
                                    <InfoView title="Qualidade POSN">{immobilePoint.posnQuality}</InfoView>
                                    <InfoView title="Qualidade da altura">{immobilePoint.heightQuality}</InfoView>
                                    <InfoView title="Qualidade POSN+Altura">{immobilePoint.posnHeightQuality}</InfoView>
                                    <InfoView title="Frequencia">{immobilePoint.frequency}</InfoView>
                                    <InfoView title="Tipo">{immobilePoint.type}</InfoView>
                                    <InfoView title="Tipo do DNSS">{immobilePoint.gnssType}</InfoView>
                                    <InfoView title="Tipo de solução">{immobilePoint.solutionType}</InfoView>
                                    <InfoView title="Status do armazenamento">{immobilePoint.storedStatus}</InfoView>
                                    <InfoView title="Status de ambiguidade">{immobilePoint.ambiguityStatus}</InfoView>
                                    <InfoView title="Descrição">{immobilePoint.description}</InfoView>
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
