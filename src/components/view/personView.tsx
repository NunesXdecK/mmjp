import InfoView from "./infoView"
import Button from "../button/button"
import AddressView from "./addressView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { handleMaskCPF, handleMaskTelephone } from "../../util/maskUtil"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { handleUTCToDateShow } from "../../util/dateUtils"

interface PersonViewProps {
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
    canShowHideData?: boolean,
    hidePaddingMargin?: boolean,
    person?: Person,
}

export default function PersonView(props: PersonViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [person, setPerson] = useState<Person>(props.person ?? defaultPerson)

    const hasHideData =
        person.rg?.length ||
        person.rgIssuer?.length ||
        person.naturalness?.length ||
        person.profession?.length ||
        person.nationality?.length ||
        person.maritalStatus?.length ||
        person.telephones?.length > 0

    const hasData =
        hasHideData ||
        person.cpf?.length ||
        person.name?.length ||
        person.clientCode?.length

    const handlePutData = () => {
        return (
            <AddressView
                address={person.address}
                title={props.addressTitle}
            />
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props.elementId.length !== 0 && person.id?.length === 0) {
                fetch("api/person/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setPerson(res.data)
                })
            }
        }
    })
    return (
        <>
            {person.id?.length === 0 ? (
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
                                <InfoView title="Codigo de cliente">{person.clientCode}</InfoView>
                                <InfoView title="Nome da pessoa">{person.name}</InfoView>
                                <InfoView title="CPF">{handleMaskCPF(person.cpf)}</InfoView>
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    {person.rg?.length > 0 && (
                                        <InfoView title="RG">{person.rg + " " + (person.rgIssuer && " " + person.rgIssuer)}</InfoView>
                                    )}
                                    <InfoView title="Naturalidade">{person.naturalness}</InfoView>
                                    <InfoView title="Nacionalidade">{person.nationality}</InfoView>
                                    <InfoView title="Estado civil">{person.maritalStatus}</InfoView>
                                    <InfoView title="Profissão">{person.profession}</InfoView>
                                    {person.telephones?.length > 0 && (
                                        <>
                                            <InfoView title="Telefones"></InfoView>
                                            {person.telephones?.map((element, index) => (
                                                <InfoView key={index + element} title="">{handleMaskTelephone(element)}</InfoView>
                                            ))}
                                        </>
                                    )}
                                    <InfoView title="Data criação">{handleUTCToDateShow(person.dateInsertUTC.toString())}</InfoView>
                                    {person.dateLastUpdateUTC > 0 && <InfoView title="Data atualização">{handleUTCToDateShow(person.dateLastUpdateUTC.toString())}</InfoView>}
                                    {props.dataInside && handlePutData()}
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
