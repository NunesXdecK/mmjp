import { useState } from "react";
import Button from "../button/button";
import InputText from "../inputText/inputText";
import PersonForm from "./personForm";

export default function ProjectForm(props) {
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
        <div>
            <PersonForm 
                isForSelect={true}
                title="Titular do projeto"
                subtitle="Informações sobre o titular do projeto"
                />
        </div>
    )
}
