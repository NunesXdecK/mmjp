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
                    <InfoView title="CEP" info={handleMaskCEP(address.cep)} />
                    <InfoView title="Logradouro" info={address.publicPlace} />
                    <InfoView title="Número" info={address.number} />
                    <InfoView title="Bairro" info={address.district} />
                    <InfoView title="Cidade" info={address.county} />
                    <InfoView title="Complemento" info={address.complement} />
                </InfoHolderView>
            )}
        </>
    )
}
