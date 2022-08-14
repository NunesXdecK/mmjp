import InfoView from "./infoView"
import Button from "../button/button"
import PersonView from "./personView"
import AddressView from "./addressView"
import CompanyView from "./companyView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces"

interface ImmobileViewProps {
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
            return dateOne - dateTwo
        }) ?? []
        return (
            <div className="w-full">
                {list.map((owner, index) => (
                    <>
                        {owner && "cpf" in owner && (
                            <>
                                <PersonView
                                    hideData
                                    dataInside
                                    canShowHideData
                                    person={owner}
                                    addressTitle={"Endereço"}
                                    title={"Dados do proprietário " + (index + 1)}
                                />
                            </>
                        )}
                        {owner && "cnpj" in owner && (
                            <>
                                <CompanyView
                                    hideData
                                    dataInside
                                    canShowHideData
                                    id={owner.id}
                                    addressTitle={"Endereço"}
                                    title={"Dados do proprietário " + (index + 1)}
                                />
                            </>
                        )}
                    </>
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
            if (props.id && props.id.length !== 0 && immobile.id?.length === 0) {
                fetch("api/immobile/" + props.id).then((res) => res.json()).then((res) => {
                    setImmobile(res.data)
                    setIsFirst(false)
                })
            }
        }
    })

    return (
        <>
            {immobile.id?.length === 0 ? (
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
                                <InfoView title="Nome" info={immobile.name} />
                                <InfoView title="Status" info={immobile.status} />
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoHolderView
                                        hideBorder
                                        hidePaddingMargin
                                    >
                                        <InfoView title="Gleba" info={immobile.land} />
                                        <InfoView title="Município/UF" info={immobile.county} />
                                        <InfoView title="Área" info={handleMountNumberCurrency(immobile.area, ".", ",", 3, 2)} />
                                        <InfoView title="Perimetro" info={handleMountNumberCurrency(immobile.perimeter, ".", ",", 3, 4)} />
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
