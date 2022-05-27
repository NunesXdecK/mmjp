import Form from "./form";
import { useState } from "react";
import Button from "../button/button";
import InputText from "../inputText/inputText";
import { TrashIcon } from "@heroicons/react/outline";
import InputTextWithButton from "../inputText/inputTextWithButton";

interface ArrayTextFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    validationMessage?: string,
    mask?: "cpf" | "rg" | "cnpj" | "currency" | "telephone",
    texts?: string[],
    setTexts?: (array) => void,
}

export default function ArrayTextForm(props: ArrayTextFormProps) {
    const [isFormValid, setIsFormValid] = useState(false)
    const [text, setText] = useState("")

    const handleAddText = (event) => {
        event.preventDefault()
        console.log("add")
        if (isFormValid && text.trim() !== "") {
            let localTexts = [...props.texts]
            if (localTexts.indexOf(text) === -1) {
                console.log("valid")
                localTexts = [...localTexts, text]
                props.setTexts(localTexts)
                setText("")
            }
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleRemoveText = (event, text) => {
        event.preventDefault()
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

                <form
                    onSubmit={handleAddText}>
                    <div className="grid grid-cols-6 sm:gap-6">
                        <div className="p-2 col-span-6 sm:col-span-6">
                            <InputText
                                value={text}
                                id={props.id}
                                setText={setText}
                                mask={props.mask}
                                title={props.inputTitle}
                                validation={props.validation}
                                validationMessage={props.validationMessage}
                                onValidate={handleChangeFormValidation}
                            />
                        </div>
                    </div>


                    <div className="grid grid-cols-6 gap-6">
                        <div className="p-2 col-span-6 sm:col-span-6 justify-self-end">
                            <Button
                                isDisabled={!isFormValid}
                                type="submit">
                                Adicionar
                            </Button>
                        </div>
                    </div>
                </form>

                {props.texts.map((element, index) => (
                    <InputTextWithButton
                        index={index}
                        value={element}
                        isDisabled={true}
                        id={index + element}
                        key={index + element}
                        onClick={handleRemoveText}>
                        <TrashIcon className="text-red-600 block h-6 w-6" aria-hidden="true" />
                    </InputTextWithButton>
                ))}
            </Form>
        </>
    )
}
