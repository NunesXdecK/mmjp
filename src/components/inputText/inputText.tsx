import { useState } from "react"
import { handleMountMask, handleRemoveTelephoneMask } from "../../util/MaskUtil"
import { CPF_MARK, CPF_PATTERN, NOT_NULL_MARK, NUMBER_MARK, ONLY_CHARACTERS_PATTERN, ONLY_NUMBERS_PATTERN, TELEPHONE_MARK } from "../../util/PatternValidationUtil"

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
    mask?: "cpf" | "rg" | "cnpj" | "currency" | "telephone" | "cep",
    onChange?: (any) => void,
    onSetText?: (string) => void,
    onValidate?: (boolean) => void,
}

const handleMountCPFCurrency = (text, dig1, dig2) => {
    let maskedText = ""
    const length = text.length
    for (let i = length; i > 0; i--) {
        const char = text.substring(i, i - 1)
        const iz = (length - i) + 1
        if (i === (length - 2)) {
            maskedText = dig1 + maskedText
        }

        if (
            i !== 0
            && iz > 3
            && iz % 3 === 0
        ) {
            maskedText = dig2 + maskedText
        }

        maskedText = char + maskedText
    }
    return maskedText
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
    text = handleRemoveTelephoneMask(text)
    return handleMountMask(text, "99.999-999")
}

const handleMaskTelephone = (text: string) => {
    text = text.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "")
    let mask = "(99) 99999-9999"
    if (text.length === 10) {
        mask = "(99) 9999-9999"
    }
    return handleMountMask(text, mask)
}

const handleMaskCPF = (text) => {
    const dig1 = "-"
    const dig2 = "."
    const unMaskedText = text.replaceAll(dig1, "").replaceAll(dig2, "")
    return handleMountCPFCurrency(unMaskedText, dig1, dig2)
}

const handleMaskRG = (text) => {
    const dig1 = "-"
    const dig2 = "."
    const unMaskedText = text.replaceAll(dig1, "").replaceAll(dig2, "")
    return handleMountRG(unMaskedText, dig1, dig2)
}

const handleMaskCurrency = (text) => {
    const dig1 = ","
    const dig2 = "."
    const unMaskedText = text.replaceAll(dig1, "").replaceAll(dig2, "")
    return handleMountCPFCurrency(unMaskedText, dig1, dig2)
}

export default function InputText(props: InputTextProps) {
    const [isValid, setIsValid] = useState(true)

    let value = props.value ?? ""

    let className = `
                        peer
                        p-2 mt-1 
                        block w-full 
                        shadow-sm sm:text-sm 
                        border-gray-300 rounded-md
                        focus:ring-indigo-500 focus:border-indigo-500 
                         
                    `
    if (props.isLoading) {
        className = className + " animate-pulse bg-gray-300"
    }

    if (!isValid) {
        className = className + " ring-red-600 border-red-600  focus:ring-red-600 focus:border-red-600"
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
                case "currency":
                    className = className + " text-right"
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

    const handleValidation = (event) => {
        let text = event.target.value
        let test = true
        switch (props.validation) {
            case NOT_NULL_MARK:
                text = text.replace(new RegExp(ONLY_NUMBERS_PATTERN), "")
                test = text.trim() !== ""
                setIsValid(test)
                break
            case CPF_MARK:
                text = text.trim()
                text = text.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
                test = text.length === 0 || new RegExp(CPF_PATTERN).test(text)
                setIsValid(test)
                break
            case NUMBER_MARK:
                text = text.trim()
                text = text.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
                setIsValid(test)
                break
            case TELEPHONE_MARK:
                text = text.trim()
                text = text.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
                test = text.length === 0 || (text.length > 13 && text.length < 16)
                setIsValid(test)
                break
        }

        if (props.onValidate) {
            props.onValidate(test)
        }

        event.target.value = text
    }

    const handleMask = (event) => {
        switch (props.mask) {
            case "cpf":
                event.target.value = handleMaskCPF(event.target.value)
                break
            case "rg":
                event.target.value = handleMaskRG(event.target.value)
                break
            case "cnpj":
                break
            case "currency":
                event.target.value = handleMaskCurrency(event.target.value)
                break
            case "telephone":
                event.target.value = handleMaskTelephone(event.target.value)
                break
            case "cep":
                event.target.value = handleMaskCEP(event.target.value)
                break
        }
    }

    return (
        <>
            <label htmlFor={props.id}
                className="block text-sm font-medium text-gray-700">
                {props.title}
            </label>
            <input
                id={props.id}
                value={value}
                name={props.title}
                className={className}
                type={props.type ?? "text"}
                maxLength={props.maxLength}
                disabled={props.isDisabled}
                required={props.isRequired}
                onChange={(event) => {
                    handleMask(event)
                    handleValidation(event)
                    props.onSetText(event.target.value)
                }}
            />
            {!isValid && (<p className="text-red-600">{props.validationMessage}</p>)}
        </>
    )
}
