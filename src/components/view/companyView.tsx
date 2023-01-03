import InfoView from "./infoView"
import PersonView from "./personView"
import AddressView from "./addressView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import SwitchTextButton from "../button/switchTextButton"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { handleMaskCNPJ, handleMaskTelephone } from "../../util/maskUtil"
import { defaultCompany, Company, Telephone } from "../../interfaces/objectInterfaces"

interface CompanyViewProps {
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
        company.clientCode > 0

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
                        title={"Representante"}
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
            if (props.elementId && props.elementId > 0) {
                fetch("api/company/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setCompany(res.data)
                })
            }
        }
    })

    return (
        <>
            {company?.id === 0 ? (
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
                                title={props.title ?? "Dados empresariais"}
                                hidePaddingMargin={props.hidePaddingMargin}
                                classNameContentHolder={props.classNameContentHolder}
                            >
                                <InfoView title="Codigo de cliente">{company.clientCode}</InfoView>
                                <InfoView title="Nome da empresa">{company.name}</InfoView>
                                <InfoView title="CNPJ">{handleMaskCNPJ(company.cnpj)}</InfoView>
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    {company.telephones?.length > 0 && (
                                        <InfoView title="Telefones">
                                            {company.telephones?.map((element: Telephone, index) => (
                                                <span key={index + element.type + element.value}>{(element.type.substring(0, 1).toUpperCase() + element.type.substring(1, element.type.length)) + ", " + handleMaskTelephone(element.value) + (index === company.telephones.length - 1 ? "" : ", ")}</span>
                                            ))}
                                        </InfoView>
                                    )}
                                    {/*
                                    <InfoView title="Data criação">{handleUTCToDateShow(company.dateInsertUTC.toString())}</InfoView>
                                    {company.dateLastUpdateUTC > 0 && <InfoView title="Data atualização">{handleUTCToDateShow(company.dateLastUpdateUTC.toString())}</InfoView>}
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
