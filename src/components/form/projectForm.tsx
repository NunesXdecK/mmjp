import { useState } from "react";
import Button from "../button/button";
import InputText from "../inputText/inputText";
import ArrayTextForm from "./arrayTextForm";
import Form from "./form";
import PersonForm from "./personForm";
import PropertyForm from "./propertyForm";

export default function ProjectForm(props) {
    const [name, setName] = useState("")
    const [person, setPerson] = useState({})
    const [property, setProperty] = useState({})
    const [stages, setStages] = useState([])
    const [payments, setPayments] = useState([])

    function handleSelectProperty(propertySelected) {
        setProperty(propertySelected)
    }

    function handleSelectPerson(personSelected) {
        setPerson(personSelected)
    }

    function save() {
        console.log(JSON.stringify({
            "name": name,
            "person": person,
            "property": property,
            "stages": stages,
            "payment": payments,
        }))

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
                    <div className="py-1 px-2 col-span-6 sm:col-span-6">
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

            <PropertyForm
                onSelectPerson={handleSelectProperty}
                isForSelect={true}
                title="Propriedade do projeto"
                subtitle="Informações sobre a propriedade do projeto"
            />

            <ArrayTextForm
                texts={stages}
                onSetTexts={setStages}
                title="Etapas do projeto"
                subtitle="Corpo das etapas" />

            <ArrayTextForm
                texts={payments}
                onSetTexts={setPayments}
                title="Pagamento"
                subtitle="Informações sobre o pagamento" />

            <div className="py-1 px-2 flex justify-end">
                <Button
                    onClick={() => save()}
                    type="submit">
                    Salvar
                </Button>
            </div>

        </>
    )
}
