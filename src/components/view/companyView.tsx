import Button from "../button/button"
import PersonView from "./personView"
import AddressView from "./addressView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { handleMaskCPF, handleMaskTelephone } from "../../util/maskUtil"
import { defaultCompany, Company } from "../../interfaces/objectInterfaces"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"

interface CompanyViewProps {
    id?: string,
    title?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideData?: boolean,
    dataInside?: boolean,
    hideBorder?: boolean,
    canShowHideData?: boolean,
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
                        addressTitle={"Endereço do proprietário " + (index + 1)}
                    />
                ))}
                <AddressView
                    address={company.address}
                    classNameHolder={"w-full"}
                />
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.id && props.id.length !== 0 && company.id?.length === 0) {
                fetch("api/company/" + props.id).then((res) => res.json()).then((res) => {
                    setCompany(res.data)
                    setIsFirst(false)
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
                                title={props.title ?? "Dados empresariais"}
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
                                {company.clientCode && (<p><span className="font-semibold">Codigo de cliente:</span> {company.clientCode}</p>)}
                                {company.name && (<p><span className="font-semibold">Nome:</span> {company.name}</p>)}
                                {company.cnpj && (<p><span className="font-semibold">CPF:</span> {handleMaskCPF(company.cnpj)}</p>)}
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoHolderView
                                        hideBorder
                                        classNameHolder="pb-0 pt-0 px-0 mt-0"
                                        classNameContentHolder="py-0 px-0 mt-0"
                                    >
                                        {company.telephones?.length > 0 && (<p className="font-semibold">Telefones:</p>)}
                                        {company.telephones?.map((element, index) => (
                                            <p key={index + element}>{handleMaskTelephone(element)}</p>
                                        ))}
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