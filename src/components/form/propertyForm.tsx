import { useState } from "react";
import Button from "../button/button";
import InputText from "../inputText/inputText";
import PropertyList from "../list/propertyList";
import IOSModal from "../modal/iosModal";
import Form from "./form";

export default function PropertyForm(props) {
    const [name, setName] = useState("")
    const [area, setArea] = useState("")
    const [municipio, setMunicipio] = useState("")

    const [isOpen, setIsOpen] = useState(false)

    function handleListItemClick(person) {
        props.onSelectPerson(person)
        setName(person.name)
        setArea(person.area)
        setMunicipio(person.municipio)
        setIsOpen(false)
    }

    function save() {
        console.log("save()")
        console.log({
            name: name,
            area: area,
            municipio: municipio,
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
                                Pesquisar propriedade
                            </Button>
                        </div>
                    </div>
                ) : null}

                <div className="grid grid-cols-6 sm:gap-6">
                    <div className="p-2 col-span-6 sm:col-span-6">
                        <InputText
                            isDisabled={props.isForSelect}
                            value={name}
                            onChange={(event) => { setName(event.target.value) }}
                            id="name"
                            title="Nome" />
                    </div>
                </div>

                <div className="grid grid-cols-6 sm:gap-6 md:pt-2">
                    <div className="p-2 col-span-6 sm:col-span-3">
                        <InputText
                            isDisabled={props.isForSelect}
                            value={area}
                            onChange={(event) => { setArea(event.target.value) }}
                            id="area"
                            title="Área" />
                    </div>

                    <div className="p-2 sm:mt-0 col-span-6 sm:col-span-3">
                        <InputText
                            isDisabled={props.isForSelect}
                            value={municipio}
                            onChange={(event) => { setMunicipio(event.target.value) }}
                            id="municipio"
                            title="Municipio" />
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
                    <PropertyList
                        isForSelect={true}
                        onListItemClick={handleListItemClick} />
                </IOSModal>
            ) : null}
        </>

    )
}
