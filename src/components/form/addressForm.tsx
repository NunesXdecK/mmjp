import Form from "./form"
import InputText from "../inputText/inputText"
import { PersonAddress } from "../../interfaces/objectInterfaces"
import { useState } from "react"
import { handleRemoveCEPMask } from "../../util/maskUtil"

interface AddressFromViaCEP {
    uf?: string,
    cep?: string,
    ddd?: string,
    gia?: string,
    ibge?: string,
    siafi?: string,
    bairro?: string,
    localidade?: string,
    logradouro?: string,
    complemento?: string,
}

interface AddressFormProps {
    title?: string,
    subtitle?: string,
    isLoading?: boolean,
    isForSelect?: boolean,
    setAddress?: any,
    address?: PersonAddress,
}

export default function AddressForm(props: AddressFormProps) {

    const [isSearching, setIsSearching] = useState(false)

    const handleOnChangeCep = (value: string) => {
        if (value && value.length === 9) {
            let cep = handleRemoveCEPMask(value)
            const url = `https://viacep.com.br/ws/${cep}/json/`
            setIsSearching(true)

            try {
                fetch(url).then(res => res.json()).then((data: AddressFromViaCEP) => {
                    let county = props.address.county
                    let district = props.address.district
                    let complement = props.address.complement
                    let publicPlace = props.address.publicPlace
                    
                    if (data.complemento && data.complemento.length > 0) {
                        complement = data.complemento
                    }

                    if (data.logradouro && data.logradouro.length > 0) {
                        publicPlace = data.logradouro
                    }

                    if (data.bairro && data.bairro.length > 0) {
                        district = data.bairro
                    }

                    if (data.localidade && data.uf) {
                        county = data.localidade + "/" + data.uf
                    }

                    props.setAddress({
                        ...props.address,
                        cep: value,
                        county: county,
                        district: district,
                        complement: complement,
                        publicPlace: publicPlace,
                    })

                    setIsSearching(false)
                })
            } catch (error) {
                console.error(error)
                setIsSearching(false)
            }

        }
        props.setAddress({ ...props.address, cep: value })
    }

    const handleOnChangePublicPlace = (value: string) => {
        props.setAddress({ ...props.address, publicPlace: value })
    }

    const handleOnChangeNumber = (value: string) => {
        props.setAddress({ ...props.address, number: value })
    }

    const handleOnChangeDistrict = (value: string) => {
        props.setAddress({ ...props.address, district: value })
    }

    const handleOnChangeCounty = (value: string) => {
        props.setAddress({ ...props.address, county: value })
    }

    const handleOnChangeComplement = (value: string) => {
        props.setAddress({ ...props.address, complement: value })
    }

    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>
                <div className="relative">
                    <div className="grid grid-cols-6 sm:gap-6">
                        <div className="py-1 px-2 col-span-6 sm:col-span-2">
                            <InputText
                                id="cep"
                                mask="cep"
                                title="CEP"
                                validation="cep"
                                isLoading={isSearching || props.isLoading}
                                isDisabled={isSearching || props.isLoading}
                                value={props.address.cep}
                                onSetText={handleOnChangeCep}
                            />
                        </div>

                        <div className="py-1 px-2 col-span-6 sm:col-span-4">
                            <InputText
                                id="public-place"
                                title="Logradouro"
                                isLoading={isSearching || props.isLoading}
                                isDisabled={isSearching || props.isLoading}
                                value={props.address.publicPlace}
                                onSetText={handleOnChangePublicPlace}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-6 sm:gap-6">
                        <div className="py-1 px-2 col-span-6 sm:col-span-2">
                            <InputText
                                id="number"
                                title="Número"
                                isLoading={props.isLoading}
                                isDisabled={props.isLoading}
                                value={props.address.number}
                                onSetText={handleOnChangeNumber}
                            />
                        </div>

                        <div className="py-1 px-2 col-span-6 sm:col-span-2">
                            <InputText
                                id="district"
                                title="Bairro"
                                isLoading={isSearching || props.isLoading}
                                isDisabled={isSearching || props.isLoading}
                                value={props.address.district}
                                onSetText={handleOnChangeDistrict}
                            />
                        </div>

                        <div className="py-1 px-2 col-span-6 sm:col-span-2">
                            <InputText
                                id="county"
                                title="Cidade"
                                isLoading={isSearching || props.isLoading}
                                isDisabled={isSearching || props.isLoading}
                                value={props.address.county}
                                onSetText={handleOnChangeCounty}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-6 sm:gap-6">
                        <div className="py-1 px-2 col-span-6 sm:col-span-6">
                            <InputText
                                id="complement"
                                title="Complemento"
                                isLoading={isSearching || props.isLoading}
                                isDisabled={isSearching || props.isLoading}
                                value={props.address.complement}
                                onSetText={handleOnChangeComplement}
                            />
                        </div>
                    </div>
                </div>
            </Form>
        </>
    )
}
