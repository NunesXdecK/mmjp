import { useState } from "react"
import InfoHolderView from "./infoHolderView"
import { handleMaskCEP } from "../../util/maskUtil"
import { defaultAddress, Address } from "../../interfaces/objectInterfaces"

interface AddressViewProps {
    id?: string,
    title?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideBorder?: boolean,
    address?: Address,
}

export default function AddressView(props: AddressViewProps) {
    const [address, setAddress] = useState<Address>(props.address ?? defaultAddress)
    return (
        <>
            {address?.cep?.length !== 0 && (
                <InfoHolderView
                    hideBorder={props.hideBorder}
                    title={props.title ?? "Endereço"}
                    classNameTitle={props.classNameTitle}
                    classNameHolder={props.classNameHolder}
                    classNameContentHolder={props.classNameContentHolder}
                >
                    {address.cep && (<p><span className="font-semibold">CEP:</span> {handleMaskCEP(address.cep)}</p>)}
                    {address.publicPlace && (<p><span className="font-semibold">Logradouro:</span> {address.publicPlace}</p>)}
                    {address.number && (<p><span className="font-semibold">Número:</span> {address.number}</p>)}
                    {address.district && (<p><span className="font-semibold">Bairro:</span> {address.district}</p>)}
                    {address.county && (<p><span className="font-semibold">Cidade:</span> {address.county}</p>)}
                    {address.complement && (<p><span className="font-semibold">Complemento:</span> {address.complement}</p>)}
                </InfoHolderView>
            )}
        </>
    )
}
