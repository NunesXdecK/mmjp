import InfoView from "./infoView"
import PersonView from "./personView"
import AddressView from "./addressView"
import CompanyView from "./companyView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import SwitchTextButton from "../button/switchTextButton"
import PlaceholderItemList from "../list/placeholderItemList"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import ImmobileStatusButton from "../button/immobileStatusButton"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces"

interface ImmobileViewProps {
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
    immobile?: Immobile,
}

export default function ImmobileView(props: ImmobileViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [immobile, setImmobile] = useState<Immobile>(props.immobile ?? defaultImmobile)

    const hasHideData = immobile.owners?.length > 0
    const hasData = hasHideData || immobile?.name?.length

    const handlePutData = () => {
        let list = immobile?.owners?.sort((elementOne, elementTwo) => {
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
        return (
            <div className="w-full">
                {list.map((owner, index) => (
                    <div
                        key={"" + index + owner.id + immobile.id}>
                        {owner && "cpf" in owner && (
                            <PersonView
                                hideData
                                dataInside
                                canShowHideData
                                person={owner}
                                addressTitle={"Endereço"}
                                title={"Proprietário " + (index + 1)}
                            />
                        )}
                        {owner && "cnpj" in owner && (
                            <CompanyView
                                hideData
                                dataInside
                                canShowHideData
                                elementId={owner.id}
                                addressTitle={"Endereço"}
                                title={"Proprietário " + (index + 1)}
                            />
                        )}
                    </div>
                ))}
                <AddressView
                    address={immobile.address}
                    title={props.addressTitle}
                />
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props?.elementId !== 0 && immobile?.id === 0) {
                fetch("api/immobile/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setImmobile(res.data)
                })
            }
        }
    })

    return (
        <>
            {immobile?.id === 0 ? (
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
                                {/*props.canShowHideData && props.hideData && hasHideData && (
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
                                    {(immobile.status === "DESMEMBRADO" || immobile.status === "UNIFICADO") && (
                                        <InfoView classNameHolder="w-full" classNameInfo="rounded-sm px-2 py-1 text-green-100 bg-green-600 text-[0.8rem] font-bold" title="">{immobile.status}</InfoView>
                                    )}
                                        )*/}
                                <InfoView title="Nome do imóvel">{immobile.name}</InfoView>
                                <InfoView title="Status">
                                    <ImmobileStatusButton
                                        isDisabled={true}
                                        value={immobile.status}
                                    />
                                </InfoView>
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoView title="Gleba">{immobile.land}</InfoView>
                                    <InfoView title="Município/UF">{immobile.county}</InfoView>
                                    <InfoView title="Área">{handleMountNumberCurrency(immobile.area, ".", ",", 3, 2)}</InfoView>
                                    <InfoView title="Perimetro">{handleMountNumberCurrency(immobile.perimeter, ".", ",", 3, 4)}</InfoView>
                                    <InfoView title="CCIR">{immobile.ccirNumber}</InfoView>
                                    <InfoView title="Processo">{immobile.process}</InfoView>
                                    <InfoView title="Comarca">{immobile.comarca}</InfoView>
                                    <InfoView title="Codigo da comarca">{immobile.comarcaCode}</InfoView>
                                    <InfoView title="Matricula">{immobile.registration}</InfoView>
                                    {/*
                                    <InfoView title="Data criação">{handleUTCToDateShow(immobile.dateInsertUTC.toString())}</InfoView>
                                    {immobile.dateLastUpdateUTC > 0 && <InfoView title="Data atualização">{handleUTCToDateShow(immobile.dateLastUpdateUTC.toString())}</InfoView>}
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
