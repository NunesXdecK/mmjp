import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import InputTextWithButton from "../inputText/inputTextWithButton";
import Form from "./form";

interface ArrayTextFormProps {
    title?: string,
    subtitle?: string,
    texts?: string[],
    setTexts?: (array) => void,
}

export default function ArrayTextForm(props: ArrayTextFormProps) {
    const addText = (event, text, cleanFunction) => {
        event.preventDefault()
        let localTexts = [...props.texts]
        if (localTexts.indexOf(text) === -1) {
            localTexts = [...localTexts, text]
            props.setTexts(localTexts)
            cleanFunction("")
        }
    }

    const handleRemoveText = (text) => {
        let localTexts = [...props.texts]
        if (localTexts.length > -1) {
            const index = localTexts.indexOf(text)
            localTexts.splice(index, 1)
            props.setTexts(localTexts)
        }
    }

    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>

                <InputTextWithButton
                    onClick={addText}>
                    <PlusIcon className="text-green-600 block h-6 w-6" aria-hidden="true" />
                </InputTextWithButton>

                {props.texts.map((element, index) => (
                    <InputTextWithButton
                        index={index}
                        value={element}
                        disabled={true}
                        key={index + element}
                        onClick={handleRemoveText}>
                        <TrashIcon className="text-red-600 block h-6 w-6" aria-hidden="true" />
                    </InputTextWithButton>
                ))}
            </Form>
        </>
    )
}
