import { useEffect, useState } from "react";
import Button from "../button/button";
import InputText from "../inputText/inputText";
import PersonList from "../list/personList";
import IOSModal from "../modal/iosModal";
import Form from "./form";

export default function PersonForm(props) {
    const [name, setName] = useState("")
    const [cpf, setCpf] = useState("")
    const [rg, setRg] = useState("")

    const [isOpen, setIsOpen] = useState(false)

    function handleListItemClick(person) {
        props.onSelectPerson(person)
        setName(person.name)
        setCpf(person.cpf)
        setRg(person.rg)
        setIsOpen(false)
    }

    function save() {
        console.log("save()")
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
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>

                {props.isForSelect ? (
                    <div className="grid grid-cols-6 sm:gap-6">
                        <div className="p-2 col-span-6 sm:col-span-6 justify-self-end">
                            <Button
                                onClick={() => setIsOpen(true)}
                                type="button">
                                Pesquisar pessoa
                            </Button>
                        </div>
                    </div>
                ) : null}

                <div className="grid grid-cols-6 sm:gap-6">
                    <div className="p-2 col-span-6 sm:col-span-6">
                        <InputText
                            value={name}
                            onChange={(event) => { setName(event.target.value) }}
                            id="fullname"
                            title="Nome completo" />
                    </div>
                </div>

                <div className="grid grid-cols-6 sm:gap-6 md:pt-2">
                    <div className="p-2 col-span-6 sm:col-span-3">
                        <InputText
                            value={cpf}
                            onChange={(event) => { setCpf(event.target.value) }}
                            id="cpf"
                            title="CPF" />
                    </div>

                    <div className="p-2 sm:mt-0 col-span-6 sm:col-span-3">
                        <InputText
                            value={rg}
                            onChange={(event) => { setRg(event.target.value) }}
                            id="rg"
                            title="RG" />
                    </div>
                </div>

                {!props.isForSelect ? (
                    <div className="grid grid-cols-6 gap-6">
                        <div className="p-2 col-span-6 sm:col-span-6 justify-self-end">
                            <Button
                                onClick={save}
                                type="submit">
                                Salvar
                            </Button>
                        </div>
                    </div>
                ) : null}
            </Form>

            {props.isForSelect ? (
                <IOSModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}>
                    <PersonList
                        isForSelect={true}
                        onListItemClick={handleListItemClick} />
                </IOSModal>
            ) : null}
        </>

    )
}
