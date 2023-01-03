import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import InputSelect from "../inputText/inputSelect";
import { TrashIcon } from "@heroicons/react/outline";
import { TELEPHONE_MARK } from "../../util/patternValidationUtil";
import InputTextWithButton from "../inputText/inputTextWithButton";
import { Telephone, defaultTelephone } from "../../interfaces/objectInterfaces";
import { handleMaskTelephone, handleRemoveTelephoneMask } from "../../util/maskUtil";

interface TelephoneFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    validationMessage?: string,
    personId?: number,
    companyId?: number,
    maxLength?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    mask?: "cpf" | "rg" | "cnpj" | "currency" | "telephone",
    texts?: Telephone[],
    onSetTexts?: (array) => void,
}

export default function TelephoneForm(props: TelephoneFormProps) {
    const [isFormValid, setIsFormValid] = useState(false)
    const [telephone, setTelephone] = useState<Telephone>(defaultTelephone)
    const handleSetType = (value) => { setTelephone({ ...telephone, type: value }) }
    const handleSetValue = (value) => { setTelephone({ ...telephone, value: value }) }
    const handleChangeFormValidation = (isValid) => { setIsFormValid(isValid) }
    const handleAddTextInner = () => {
        let localTexts: Telephone[] = [...props.texts]
        if (localTexts.indexOf(telephone) === -1) {
            localTexts = [...localTexts, { ...telephone }]
            props.onSetTexts(localTexts)
            setTelephone(defaultTelephone)
        }
    }
    const handleAddText = (event) => {
        event.preventDefault()
        if (isFormValid && telephone.value.trim() !== "") {
            /*
            if ((props.personId && props.personId > 0) || (props.companyId && props.companyId > 0)) {
                fetch("api/telephone", {
                    method: "POST",
                    body: JSON.stringify({
                        token: "tokenbemseguro",
                        data: telephone,
                        personId: props.personId,
                        companyId: props.companyId,
                    }),
                })
            }
            */
            handleAddTextInner()
        }
    }
    const handleMaskInner = (text) => {
        text = handleRemoveTelephoneMask(text)
        text = handleMaskTelephone(text)
        return text
    }
    const handleIsValid = () => {
        let hasIn = false
        props?.texts?.map((element, index) => {
            if (handleRemoveTelephoneMask(telephone.value) === handleRemoveTelephoneMask(element.value)
                && telephone.type?.toLocaleLowerCase() === element.type?.toLocaleLowerCase()) {
                hasIn = true
            }
        })
        return telephone.value.length < 14 || telephone.type.length === 0 || hasIn
    }
    const handleRemoveText = async (event, telephone) => {
        event.preventDefault()
        if (telephone.id > 0) {
            fetch("api/telephone", {
                method: "DELETE",
                body: JSON.stringify({ token: "tokenbemseguro", id: telephone.id }),
            })
        }
        let localTexts = [...props.texts]
        if (localTexts?.length > -1) {
            const index = localTexts.indexOf(telephone)
            localTexts.splice(index, 1)
            if (props.onSetTexts) {
                props.onSetTexts(localTexts)
            }
        }
    }
    return (
        <Form
            title={props.title}
            subtitle={props.subtitle}>
            <form
                onSubmit={handleAddText}>
                <FormRow>
                    <FormRowColumn unit="2">
                        <InputSelect
                            title="Tipo"
                            value={telephone.type}
                            onSetText={handleSetType}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            id={props.id + "-type-select"}
                            options={["comercial", "pessoal", "outro", "whatsapp"]}
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="4" className="flex flex-row gap-2 items-end">
                        <InputText
                            maxLength={15}
                            title="Telefone"
                            mask="telephone"
                            value={telephone.value}
                            onSetText={handleSetValue}
                            isLoading={props.isLoading}
                            validation={TELEPHONE_MARK}
                            isDisabled={props.isDisabled}
                            id={props.id + "-telephone-input"}
                            onValidate={handleChangeFormValidation}
                            validationMessage={props.validationMessage}
                        />
                        <Button
                            type="submit"
                            isDisabled={props.isDisabled || handleIsValid()}
                            isLoading={props.isLoading}
                        >
                            Adicionar
                        </Button>
                    </FormRowColumn>
                </FormRow>
            </form>
            {props.texts?.map((element: Telephone, index) => (
                <InputTextWithButton
                    index={index}
                    isDisabled={true}
                    onClick={(event) => handleRemoveText(event, element)}
                    isLoading={props.isLoading}
                    id={index + element.type + "-" + element.value}
                    key={index + element.type + "-" + element.value}
                    value={(element.type.substring(0, 1).toUpperCase() + element.type.substring(1, element.type.length)) + ", " + handleMaskInner(element.value)}
                >
                    <TrashIcon className="text-red-600 block h-6 w-6" aria-hidden="true" />
                </InputTextWithButton>
            ))}
        </Form>
    )
}
