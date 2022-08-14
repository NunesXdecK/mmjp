import Button from "../button/button"
import AddressView from "./addressView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { handleMaskCPF, handleMaskTelephone } from "../../util/maskUtil"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"

interface PersonViewProps {
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
            if (props.id && props.id.length !== 0 && person.id?.length === 0) {
                fetch("api/person/" + props.id).then((res) => res.json()).then((res) => {
                    setPerson(res.data)
                    setIsFirst(false)
                })
            }
        }
    })
    return (
        <>
            {person.id?.length === 0 ? (
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
                                {person.clientCode && (<p><span className="font-semibold">Codigo de cliente:</span> {person.clientCode}</p>)}
                                {person.name && (<p><span className="font-semibold">Nome:</span> {person.name}</p>)}
                                {person.cpf && (<p><span className="font-semibold">CPF:</span> {handleMaskCPF(person.cpf)}</p>)}
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoHolderView
                                        hideBorder
                                        hidePaddingMargin
                                    >
                                        {person.rg && (<p><span className="font-semibold">RG:</span> {person.rg} {person.rgIssuer && " " + person.rgIssuer}</p>)}
                                        {person.naturalness && (<p><span className="font-semibold">Naturalidade:</span> {person.naturalness}</p>)}
                                        {person.nationality && (<p><span className="font-semibold">Nacionalidade:</span> {person.nationality}</p>)}
                                        {person.maritalStatus && (<p><span className="font-semibold">Estado civil:</span> {person.maritalStatus}</p>)}
                                        {person.profession && (<p><span className="font-semibold">Profissão:</span> {person.profession}</p>)}
                                        {person.telephones?.length > 0 && (<p className="font-semibold">Telefones:</p>)}
                                        {person.telephones?.map((element, index) => (
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
