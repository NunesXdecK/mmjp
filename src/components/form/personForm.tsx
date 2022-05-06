import { useState } from "react";
import Button from "../button/button";
import InputText from "../inputText/inputText";

export default function PersonForm(props) {
    const [name, setName] = useState("")
    const [cpf, setCpf] = useState("")
    const [rg, setRg] = useState("")

    const save = () => {
        console.log({
            name: name,
            cpf: cpf,
            rg: rg,
        })

        if (props.afterSave) {
            props.afterSave()
        }
    }

    return (
        <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:cols-span-1">
                <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{props.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{props.subtitle}</p>
                </div>
            </div>

            <div className="mt-5 md:mt-0 md:col-span-2 ">
                <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="bg-white sm:py-1 px-4">

                        <div className="grid grid-cols-6 sm:gap-6">
                            <div className="col-span-6 sm:col-span-6">
                                <InputText
                                    blocked={props.isForSelect}
                                    onChange={(event) => { setName(event.target.value) }}
                                    id="fullname"
                                    title="Nome completo" />
                            </div>
                        </div>
                        <div className="mt-2 grid grid-cols-6 sm:gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <InputText
                                    blocked={props.isForSelect}
                                    onChange={(event) => { setCpf(event.target.value) }}
                                    id="cpf"
                                    title="CPF" />
                            </div>

                            <div className="mt-2 sm:mt-0 col-span-6 sm:col-span-3">
                                <InputText
                                    blocked={props.isForSelect}
                                    onChange={(event) => { setRg(event.target.value) }}
                                    id="rg"
                                    title="RG" />
                            </div>
                        </div>

                        <div className="py-2 grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-6 justify-self-end">
                                <Button
                                    onClick={save}
                                    type="submit">
                                    Salvar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
