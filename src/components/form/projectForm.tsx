import { useState } from "react";
import Button from "../button/button";
import InputText from "../inputText/inputText";
import Form from "./form";
import PersonForm from "./personForm";

export default function ProjectForm(props) {
    const [name, setName] = useState("")

    function handleSelectPerson(person) {
        console.log("handleSelectPerson()")
        console.log(person)
    }

    function save() {
        console.log({
            name: name,
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
                <div className="grid grid-cols-6 sm:gap-6">
                    <div className="p-2 col-span-6 sm:col-span-6">
                        <InputText
                            value={name}
                            onChange={(event) => { setName(event.target.value) }}
                            id="projectname"
                            title="Nome do projeto" />
                    </div>
                </div>

            </Form>

            <PersonForm
                onSelectPerson={handleSelectPerson}
                isForSelect={true}
                title="Titular do projeto"
                subtitle="Informações sobre o titular do projeto"
            />

            <div className="p-2 flex justify-end">
                <Button
                    onClick={save}
                    type="submit">
                    Salvar
                </Button>
            </div>

        </>
    )
}
