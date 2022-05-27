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
            const cep = value.replace(new RegExp(ONLY_NUMBERS_PATTERN_TWO), "")
            const url = `https://viacep.com.br/ws/${cep}/json/`
            setIsSearching(true)

            fetch(url).then(res => res.json()).then((data: AddressFromViaCEP) => {
                let county = ""
                if (data.localidade && data.uf) {
                    county = data.localidade + "/" + data.uf
                }

                const personAddress: PersonAddress = {
                    publicPlace: data.logradouro,
                    number: "",
                    district: data.bairro,
                    county: county,
                    cep: cep,
                }
                props.setAddress(personAddress)
                setIsSearching(false)
            })
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
                    {isSearching && (
                        <div
                            className="absolute w-full h-full inset-0 bg-gray-500 opacity-30 transition-opacity"></div>

                    )}
                    <div className="grid grid-cols-6 sm:gap-6">
                        <div className="p-2 col-span-6 sm:col-span-2">
                            <InputText
                                id="cep"
                                mask="cep"
                                title="CEP"
                                isDisabled={isSearching}
                                value={props.address.cep}
                                setText={handleOnChangeCep}
                            />
                        </div>

                        <div className="p-2 col-span-6 sm:col-span-4">
                            <InputText
                                id="public-place"
                                title="Logradouro"
                                isDisabled={isSearching}
                                value={props.address.publicPlace}
                                setText={handleOnChangePublicPlace}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-6 sm:gap-6">
                        <div className="p-2 col-span-6 sm:col-span-2">
                            <InputText
                                id="number"
                                title="Número"
                                value={props.address.number}
                                setText={handleOnChangeNumber}
                            />
                        </div>

                        <div className="p-2 col-span-6 sm:col-span-2">
                            <InputText
                                id="district"
                                title="Bairro"
                                isDisabled={isSearching}
                                value={props.address.district}
                                setText={handleOnChangeDistrict}
                            />
                        </div>

                        <div className="p-2 col-span-6 sm:col-span-2">
                            <InputText
                                id="county"
                                title="Cidade"
                                isDisabled={isSearching}
                                value={props.address.county}
                                setText={handleOnChangeCounty}
                            />
                        </div>
                    </div>
                </div>
            </Form>
        </>
    )
}
