import { useState } from "react"
import { CPF_MARK, CPF_PATTERN, NOT_NULL_MARK, ONLY_CHARACTERS_PATTERN, ONLY_NUMBERS_PATTERN, ONLY_WHITESPACES_PATTERN } from "../../util/PatternValidationUtil"

interface InputTextProps {
    id?: string,
    maxLength?: number,
    type?: string,
    mask?: string,
    validation?: string,
    validationMessage?: string,
    value?: string,
    title?: string,
    children?: any,
    isDisabled?: boolean,
    isRequired?: boolean,
    onValidate?: (boolean) => void,
    setText?: (string) => void,
}

const mountTextCPFCurrency = (text, dig1, dig2) => {
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

const mountTextRG = (text, dig1, dig2) => {
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

const maskCPF = (text) => {
    const dig1 = "-"
    const dig2 = "."
    const unMaskedText = text.replaceAll(dig1, "").replaceAll(dig2, "")
    return mountTextCPFCurrency(unMaskedText, dig1, dig2)
}

const maskRG = (text) => {
    const dig1 = "-"
    const dig2 = "."
    const unMaskedText = text.replaceAll(dig1, "").replaceAll(dig2, "")
    return mountTextRG(unMaskedText, dig1, dig2)
}

const maskCurrency = (text) => {
    const dig1 = ","
    const dig2 = "."
    const unMaskedText = text.replaceAll(dig1, "").replaceAll(dig2, "")
    return mountTextCPFCurrency(unMaskedText, dig1, dig2)
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
    if (!isValid) {
        className = className + " ring-red-600 border-red-600  focus:ring-red-600 focus:border-red-600"
    }

    if (props.mask) {
        className = className + " text-right"
        if (value) {
            switch (props.mask) {
                case "cpf":
                    value = maskCPF(value)
                    break
                case "rg":
                    value = maskRG(value)
                    break
                case "cnpj":
                    break
                case "currency":
                    value = maskCurrency(value)
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
                test = !(text.trim() === "")
                setIsValid(test)
                break
            case CPF_MARK:
                text = text.trim()
                text = text.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
                test = new RegExp(CPF_PATTERN).test(text)
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
                event.target.value = maskCPF(event.target.value)
                break
            case "rg":
                event.target.value = maskRG(event.target.value)
                break
            case "cnpj":
                break
            case "currency":
                event.target.value = maskCurrency(event.target.value)
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
                type={props.type ?? "text"}
                id={props.id}
                name={props.title}
                maxLength={props.maxLength}
                value={value}
                disabled={props.isDisabled}
                required={props.isRequired}
                onChange={(event) => {
                    handleMask(event)
                    handleValidation(event)
                    props.setText(event.target.value)
                }}
                className={className}
            />
            {!isValid && (<p className="text-red-600">{props.validationMessage}</p>)}
        </>
    )
}
