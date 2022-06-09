import { useState } from "react"
import { handleMaskCPF, handleMaskTelephone, handleMountCPFCurrency, handleMountMask, handleMountPerimeter, handleRemoveCEPMask } from "../../util/maskUtil"
import { CEP_MARK, CPF_MARK, CPF_PATTERN, NOT_NULL_MARK, NUMBER_MARK, ONLY_CHARACTERS_PATTERN, ONLY_CHARACTERS_PATTERN_TWO, ONLY_SPECIAL_FOR_NUMBER_PATTERN, STYLE_FOR_INPUT_LOADING, TELEPHONE_MARK, TEXT_NOT_NULL_MARK } from "../../util/patternValidationUtil"
import { handleValidationNotNull } from "../../util/validationUtil"

interface InputTextProps {
    id?: string,
    type?: string,
    value?: string,
    title?: string,
    validation?: string,
    validationMessage?: string,
    maxLength?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    isRequired?: boolean,
    children?: any,
    mask?: "cpf" | "rg" | "cnpj" | "currency" | "telephone" | "cep" | "perimeter" | "area",
    onChange?: (any) => void,
    onSetText?: (string) => void,
    onValidate?: (boolean) => void,
}

const handleMountRG = (text, dig1, dig2) => {
    let maskedText = ""
    const length = text.length

    for (let i = length; i > 0; i--) {
        const char = text.substring(i, i - 1)
        const iz = length - i
        if (i === (length - 1)) {
            maskedText = dig1 + maskedText
        }

        maskedText = char + maskedText

        if (
            i !== 1
            && iz > 0
            && (length > 4)
            && iz % 3 === 0
        ) {
            maskedText = dig2 + maskedText
        }
    }
    return maskedText
}

const handleMaskCEP = (text: string) => {
    text = handleRemoveCEPMask(text)
    return handleMountMask(text, "99999-999")
}

const handleMaskRG = (text) => {
    const dig1 = "-"
    const dig2 = "."
    const unMaskedText = text?.toString().replaceAll(dig1, "").replaceAll(dig2, "")
    return handleMountRG(unMaskedText, dig1, dig2)
}

const handleMaskPerimeter = (text) => {
    const dig1 = ","
    const dig2 = "."
    const unMaskedText = text?.toString().replaceAll(dig1, "").replaceAll(dig2, "")
    return handleMountPerimeter(unMaskedText)
}

const handleMaskCurrency = (text) => {
    const dig1 = ","
    const dig2 = "."
    const unMaskedText = text?.toString().replaceAll(dig1, "").replaceAll(dig2, "")
    return handleMountCPFCurrency(unMaskedText, dig1, dig2)
}

export default function InputText(props: InputTextProps) {
    const [isValid, setIsValid] = useState(true)

    let value = props.value ?? ""

    let classNameInput = `
                            peer
                            p-2 mt-1 
                            block w-full 
                            shadow-sm sm:text-sm 
                            border-gray-300 rounded-md
                            focus:ring-indigo-500 focus:border-indigo-500 
                        `
    let classNameLabel = "block text-sm font-medium text-gray-700"

    if (props.isLoading) {
        classNameInput = classNameInput + STYLE_FOR_INPUT_LOADING
        classNameLabel = classNameLabel + STYLE_FOR_INPUT_LOADING
    }

    if (!isValid) {
        classNameInput = classNameInput + " ring-red-600 border-red-600  focus:ring-red-600 focus:border-red-600"
    }

    if (props.mask) {
        if (value) {
            switch (props.mask) {
                case "cpf":
                    value = handleMaskCPF(value)
                    break
                case "rg":
                    value = handleMaskRG(value)
                    break
                case "cnpj":
                    break
                case "perimeter":
                    value = handleMaskPerimeter(value)
                    break
                case "area":
                    value = handleMaskCurrency(value)
                    break
                case "currency":
                    classNameInput = classNameInput + " text-right"
                    value = handleMaskCurrency(value)
                    break
                case "telephone":
                    value = handleMaskTelephone(value)
                    break
                case "cep":
                    value = handleMaskCEP(value)
                    break
            }
        }
    }

    const handleValidation = (text) => {
        let test = true
        switch (props.validation) {
            case NOT_NULL_MARK:
                test = handleValidationNotNull(text)
                setIsValid(test)
                break
            case TEXT_NOT_NULL_MARK:
                text = text?.replaceAll(ONLY_CHARACTERS_PATTERN_TWO, '')
                test = handleValidationNotNull(text)
                setIsValid(test)
                break
            case CEP_MARK:
                text = handleRemoveCEPMask(text)
                test = handleValidationNotNull(text)
                setIsValid(test)
                break
            case CPF_MARK:
                text = text?.trim()
                text = text?.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
                test = new RegExp(CPF_PATTERN).test(text)
                setIsValid(test)
                break
            case NUMBER_MARK:
                text = text?.trim()
                text = text?.replace(new RegExp(ONLY_SPECIAL_FOR_NUMBER_PATTERN), "")
                text = text?.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
                setIsValid(test)
                break
            case TELEPHONE_MARK:
                text = text?.trim()
                text = text?.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
                test = text?.length === 0 || (text.length > 13 && text.length < 16)
                setIsValid(test)
                break
        }

        if (props.onValidate) {
            props.onValidate(test)
        }
        return text
    }

    const handleMask = (text) => {
        let value = text
        switch (props.mask) {
            case "cpf":
                value = handleMaskCPF(value)
                break
            case "rg":
                value = handleMaskRG(value)
                break
            case "cnpj":
                break
            case "perimeter":
                value = handleMaskPerimeter(value)
                break
            case "area":
                value = handleMaskCurrency(value)
            case "currency":
                value = handleMaskCurrency(value)
                break
            case "telephone":
                value = handleMaskTelephone(value)
                break
            case "cep":
                value = handleMaskCEP(value)
                break
        }
        return value
    }

    return (
        <>
            <label htmlFor={props.id}
                className={classNameLabel}>
                {props.title}
            </label>
            <input
                id={props.id}
                value={value}
                name={props.title}
                className={classNameInput}
                type={props.type ?? "text"}
                maxLength={props.maxLength}
                disabled={props.isDisabled || props.isLoading}
                required={props.isRequired}
                onChange={(event) => {
                    let text = event.target.value
                    text = handleMask(text)
                    text = handleValidation(text)
                    props.onSetText(text)
                }}
            />
            {!isValid && (<p className="text-red-600">{props.validationMessage}</p>)}
        </>
    )
}
