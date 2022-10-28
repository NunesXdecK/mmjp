import { useState } from "react"
import InfoView from "./infoView"
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
                    <InfoView title="CEP">{handleMaskCEP(address.cep)}</InfoView>
                    <InfoView title="Logradouro">{address.publicPlace} </InfoView>
                    <InfoView title="Número">{address.number}</InfoView>
                    <InfoView title="Bairro">{address.district}</InfoView>
                    <InfoView title="Cidade">{address.county}</InfoView>
                    <InfoView title="Complemento">{address.complement}</InfoView>
                </InfoHolderView>
            )}
        </>
    )
}
