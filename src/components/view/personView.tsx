import AddressView from "./addressView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import { handleMaskCPF, handleMaskTelephone } from "../../util/maskUtil"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"

interface PersonViewProps {
    id?: string,
    person?: Person,
    dataInside?: boolean,
}

export default function PersonView(props: PersonViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [person, setPerson] = useState<Person>(props.person ?? defaultPerson)

    const handlePutData = () => {
        return (<AddressView address={person.address} />)
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
                    <InfoHolderView title="Dados pessoais">
                        {person.clientCode && (<p><span className="font-semibold">Codigo do cliente:</span> {person.clientCode}</p>)}
                        {person.name && (<p><span className="font-semibold">Nome:</span> {person.name}</p>)}
                        {person.cpf && (<p><span className="font-semibold">CPF:</span> {handleMaskCPF(person.cpf)}</p>)}
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
                    {!props.dataInside && handlePutData()}
                </>
            )}
        </>
    )
}
