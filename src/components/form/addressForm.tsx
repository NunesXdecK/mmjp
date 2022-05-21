import { useState } from "react"
import { PersonAddress } from "../../interfaces/objectInterfaces"
import InputText from "../inputText/inputText"
import Form from "./form"

interface AddressFormProps {
    title?: string,
    subtitle?: string,
    isForSelect?: boolean,
    address: PersonAddress,
    setAddress: any,
}

export default function AddressForm(props: AddressFormProps) {
    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>

                <div className="grid grid-cols-6 sm:gap-6">
                    <div className="p-2 col-span-6 sm:col-span-2">
                        <InputText
                            isDisabled={props.isForSelect}
                            value={props.address.cep}
                            onChange={(event) => { props.setAddress({...props.address, cep: event.target.value}) }}
                            id="cep"
                            title="CEP" />
                    </div>

                    <div className="p-2 col-span-6 sm:col-span-4">
                        <InputText
                            isDisabled={props.isForSelect}
                            value={props.address.publicPlace}
                            onChange={(event) => { props.setAddress({...props.address, publicPlace: event.target.value}) }}
                            id="public-place"
                            title="Logradouro" />
                    </div>
                </div>

                <div className="grid grid-cols-6 sm:gap-6">
                    <div className="p-2 col-span-6 sm:col-span-2">
                        <InputText
                            isDisabled={props.isForSelect}
                            value={props.address.number}
                            onChange={(event) => { props.setAddress({...props.address, number: event.target.value}) }}
                            id="number"
                            title="Número" />
                    </div>

                    <div className="p-2 col-span-6 sm:col-span-2">
                        <InputText
                            isDisabled={props.isForSelect}
                            value={props.address.district}
                            onChange={(event) => { props.setAddress({...props.address, district: event.target.value}) }}
                            id="district"
                            title="Bairro" />
                    </div>

                    <div className="p-2 col-span-6 sm:col-span-2">
                        <InputText
                            isDisabled={props.isForSelect}
                            value={props.address.county}
                            onChange={(event) => { props.setAddress({...props.address, county: event.target.value}) }}
                            id="county"
                            title="Cidade" />
                    </div>
                </div>
            </Form>
        </>
    )
}
