import InfoView from "./infoView"
import Button from "../button/button"
import PersonView from "./personView"
import AddressView from "./addressView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { handleMaskCNPJ, handleMaskTelephone } from "../../util/maskUtil"
import { defaultCompany, Company } from "../../interfaces/objectInterfaces"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"

interface CompanyViewProps {
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
    company?: Company,
}

export default function CompanyView(props: CompanyViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [company, setCompany] = useState<Company>(props.company ?? defaultCompany)

    const hasHideData = company.owners?.length > 0
    const hasData = hasHideData ||
        company.name?.length ||
        company.cnpj?.length ||
        company.clientCode?.length

    const handlePutData = () => {
        return (
            <div className="w-full">
                {company.owners?.map((owner, index) => (
                    <PersonView
                        hideData
                        dataInside
                        person={owner}
                        canShowHideData
                        key={index + owner.id}
                        title={"Dados do proprietário " + (index + 1)}
                        addressTitle={"Endereço"}
                    />
                ))}
                <AddressView
                    address={company.address}
                    title={props.addressTitle}
                />
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.id && props.id.length !== 0 && company.id?.length === 0) {
                fetch("api/company/" + props.id).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setCompany(res.data)
                })
            }
        }
    })

    return (
        <>
            {company.id?.length === 0 ? (
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
                                title={props.title ?? "Dados empresariais"}
                                hidePaddingMargin={props.hidePaddingMargin}
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
                                <InfoView title="Codigo de cliente" info={company.clientCode} />
                                <InfoView title="Nome" info={company.name} />
                                <InfoView title="CNPJ" info={handleMaskCNPJ(company.cnpj)} />
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoHolderView
                                        hideBorder
                                        hidePaddingMargin
                                    >
                                        {company.telephones?.length > 0 && (
                                            <>
                                                <InfoView title="Telefones" info=" " />
                                                {company.telephones?.map((element, index) => (
                                                    <InfoView key={index + element} title="" info={handleMaskTelephone(element)} />
                                                ))}
                                            </>
                                        )}
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
