import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { TrashIcon } from "@heroicons/react/outline";
import InputTextWithButton from "../inputText/inputTextWithButton";
import { handleMaskTelephone, handleRemoveTelephoneMask } from "../../util/maskUtil";

interface ArrayTextFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    validationMessage?: string,
    isLoading?: boolean,
    mask?: "cpf" | "rg" | "cnpj" | "currency" | "telephone",
    texts?: string[],
    onSetTexts?: (array) => void,
}

export default function ArrayTextForm(props: ArrayTextFormProps) {
    const [isFormValid, setIsFormValid] = useState(false)
    const [text, setText] = useState("")

    const handleAddText = (event) => {
        event.preventDefault()
        if (isFormValid && text.trim() !== "") {
            let localTexts = [...props.texts]
            if (localTexts.indexOf(text) === -1) {
                localTexts = [...localTexts, text]
                if (props.mask)
                    props.onSetTexts(localTexts)
                setText("")
            }
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleMask = (text) => {
        switch (props.mask) {
            case "telephone":
                text = handleRemoveTelephoneMask(text)
                text = handleMaskTelephone(text)
                break
        }
        return text
    }

    const handleRemoveText = (event, text) => {
        event.preventDefault()
        let localTexts = [...props.texts]
        if (localTexts?.length > -1) {
            const index = localTexts.indexOf(text)
            localTexts.splice(index, 1)
            if (props.onSetTexts) {
                props.onSetTexts(localTexts)
            }
        }
    }

    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>
                <form
                    onSubmit={handleAddText}>
                    <FormRow>
                        <FormRowColumn unit="6">
                            <InputText
                                value={text}
                                id={props.id}
                                mask={props.mask}
                                onSetText={setText}
                                title={props.inputTitle}
                                isLoading={props.isLoading}
                                validation={props.validation}
                                validationMessage={props.validationMessage}
                                onValidate={handleChangeFormValidation}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="6">
                            <Button
                                type="submit"
                                isDisabled={!isFormValid}
                                isLoading={props.isLoading}
                            >
                                Adicionar
                            </Button>
                        </FormRowColumn>
                    </FormRow>
                </form>

                {props.texts.map((element, index) => (
                    <InputTextWithButton
                        index={index}
                        isDisabled={true}
                        id={index + element}
                        key={index + element}
                        onClick={handleRemoveText}
                        value={handleMask(element)}
                        isLoading={props.isLoading}
                    >
                        <TrashIcon className="text-red-600 block h-6 w-6" aria-hidden="true" />
                    </InputTextWithButton>
                ))}
            </Form>
        </>
    )
}
