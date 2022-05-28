import Form from "./form"
import InputText from "../inputText/inputText"
import { PersonAddress } from "../../interfaces/objectInterfaces"
import { ONLY_NUMBERS_PATTERN_TWO } from "../../util/PatternValidationUtil"
import { useState } from "react"

interface AddressFormProps {
    title?: string,
    subtitle?: string,
    isForSelect?: boolean,
    address?: PersonAddress,
    setAddress?: any,
}

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

export default function AddressForm(props: AddressFormProps) {

    const [isSearching, setIsSearching] = useState(false)

    const handleOnChangeCep = (value: string) => {
        if (value && value.length === 10) {
            let cep = value.replaceAll(" ", "").replaceAll("-", "")
            cep = value.replace(new RegExp(ONLY_NUMBERS_PATTERN_TWO), "")
            const url = `https://viacep.com.br/ws/${cep}/json/`
            setIsSearching(true)

            try {
                fetch(url).then(res => res.json()).then((data: AddressFromViaCEP) => {
                    if (data.cep && data.cep.length > 0) {
                        props.setAddress({...props.address, publicPlace: data.logradouro})
                    }
                    
                    if (data.logradouro && data.logradouro.length > 0) {
                        props.setAddress({...props.address, publicPlace: data.logradouro})
                    }
                    
                    if (data.bairro && data.bairro.length > 0) {
                        props.setAddress({...props.address, district: data.bairro})
                    }
                    
                    if (data.localidade && data.uf) {
                        props.setAddress({...props.address, county: data.localidade + "/" + data.uf})
                    }
                    
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

    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>
                <div className="relative">
                    <div className="grid grid-cols-6 sm:gap-6">
                        <div className="p-2 col-span-6 sm:col-span-2">
                            <InputText
                                id="cep"
                                mask="cep"
                                title="CEP"
                                validation="number"
                                isLoading={isSearching}
                                isDisabled={isSearching}
                                value={props.address.cep}
                                onSetText={handleOnChangeCep}
                                />
                        </div>

                        <div className="p-2 col-span-6 sm:col-span-4">
                            <InputText
                                id="public-place"
                                title="Logradouro"
                                isLoading={isSearching}
                                isDisabled={isSearching}
                                value={props.address.publicPlace}
                                onSetText={handleOnChangePublicPlace}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-6 sm:gap-6">
                        <div className="p-2 col-span-6 sm:col-span-2">
                            <InputText
                                id="number"
                                title="Número"
                                value={props.address.number}
                                onSetText={handleOnChangeNumber}
                            />
                        </div>

                        <div className="p-2 col-span-6 sm:col-span-2">
                            <InputText
                                id="district"
                                title="Bairro"
                                isLoading={isSearching}
                                isDisabled={isSearching}
                                value={props.address.district}
                                onSetText={handleOnChangeDistrict}
                            />
                        </div>

                        <div className="p-2 col-span-6 sm:col-span-2">
                            <InputText
                                id="county"
                                title="Cidade"
                                isLoading={isSearching}
                                isDisabled={isSearching}
                                value={props.address.county}
                                onSetText={handleOnChangeCounty}
                            />
                        </div>
                    </div>
                </div>
            </Form>
        </>
    )
}
