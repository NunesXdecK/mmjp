import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import InputTextStage from "../inputText/inputTextStage";
import Form from "./form";

export default function ProjectStageForm(props) {

    function addStage(text, cleanFunction) {
        let localStages = [...props.stages]
        if (localStages.indexOf(text) === -1) {
            localStages.push(text)
            props.setStages(localStages)
            cleanFunction("")
        }
    }

    function handleRemoveStage(text) {
        let localStages = [...props.stages]
        if (localStages.length > -1) {
            const index = localStages.indexOf(text)
            localStages.splice(index, 1)
            props.setStages(localStages)
        }
    }

    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>

                <InputTextStage
                    onClick={addStage}>
                    <PlusIcon className="text-green-600 block h-6 w-6" aria-hidden="true" />
                </InputTextStage>

                {props.stages.map((element, index) => (
                    <InputTextStage
                        index={index}
                        value={element}
                        disabled={true}
                        key={index + element}
                        onClick={handleRemoveStage}>
                        <TrashIcon className="text-red-600 block h-6 w-6" aria-hidden="true" />
                    </InputTextStage>
                ))}
            </Form>
        </>
    )
}
