import { useState } from "react"
import { defaultAddress, Address } from "../../interfaces/objectInterfaces"
import { handleMaskCEP, handleMaskCPF, handleMaskTelephone } from "../../util/maskUtil"

interface AddressViewProps {
    id?: string,
    address?: Address,
}

export default function AddressView(props: AddressViewProps) {
    const [address, setAddress] = useState<Address>(props.address ?? defaultAddress)
    return (
        <>
            {address?.cep?.length !== 0 && (
                <div className="mt-6 px-4 pt-2 pb-4 border-2 border-indigo-200 rounded-lg">
                    <span className="text-lg font-semibold absolute bg-indigo-50 px-2 -mt-6">Endereço</span>
                    <div className="mt-6">
                        {address.cep && (<p><span className="font-semibold">CEP:</span> {handleMaskCEP(address.cep)}</p>)}
                        {address.publicPlace && (<p><span className="font-semibold">Logradouro:</span> {address.publicPlace}</p>)}
                        {address.number && (<p><span className="font-semibold">Número:</span> {address.number}</p>)}
                        {address.district && (<p><span className="font-semibold">Bairro:</span> {address.district}</p>)}
                        {address.county && (<p><span className="font-semibold">Cidade:</span> {address.county}</p>)}
                        {address.complement && (<p><span className="font-semibold">Complemento:</span> {address.complement}</p>)}
                    </div>
                </div>
            )}
        </>
    )
}
