import { useState } from "react"
import { handleValidationNotNull } from "../../util/validationUtil"
import { handleMaskCEP, handleMaskCPF, handleMaskTelephone, handleMountCCIRMask, handleMountCNPJMask, handleMountDateMask, handleMountMask, handleMountNumberCurrency, handleRemoveCEPMask, handleRemoveCNPJMask, handleRemoveCPFMask, handleRemoveDateMask } from "../../util/maskUtil"
import { CCIR_MARK, CCIR_PATTERN, CEP_MARK, CNPJ_MARK, CNPJ_PATTERN, CPF_MARK, CPF_PATTERN, DATE_MARK, DATE_PATTERN, EMAIL_MARK, EMAIL_PATTERN, NOT_NULL_MARK, NUMBER_MARK, ONLY_CHARACTERS_PATTERN, ONLY_CHARACTERS_PATTERN_TWO, ONLY_SPECIAL_FOR_NUMBER_PATTERN, STYLE_FOR_INPUT_LOADING, STYLE_FOR_INPUT_LOADING_TRANSPARENT, TELEPHONE_MARK, TEXT_NOT_NULL_MARK } from "../../util/patternValidationUtil"

interface InputTextProps {
    id?: string,
    type?: string,
    value?: string,
    title?: string,
    message?: string,
    validation?: string,
    classNameInput?: string,
    classNameLabel?: string,
    holderClassName?: string,
    validationMessage?: string,
    maxLength?: number,
    isInvalid?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isRequired?: boolean,
    isAutoFocus?: boolean,
    isForShowMessage?: boolean,
    children?: any,
    mask?: "cpf" | "rg" | "cnpj" | "currency" | "telephone" | "cep" | "perimeter" | "area" | "date" | "ccir",
    onBlur?: (any?) => void,
    onChange?: (any) => void,
    onSetText?: (string) => void,
    onValidate?: (boolean?) => void,
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

const handleMaskDate = (text: string) => {
    text = handleRemoveDateMask(text)
    return handleMountDateMask(text)
}

const handleMaskRG = (text) => {
    const dig1 = "-"
    const dig2 = "."
    const unMaskedText = text?.replaceAll(dig1, "").replaceAll(dig2, "")
    return handleMountRG(unMaskedText, dig1, dig2)
}

const handleMaskCNPJ = (text) => {
    return handleMountCNPJMask(text)
}

const handleMaskPerimeter = (text) => {
    return handleMountNumberCurrency(text, ".", ",", 3, 4)
}

const handleMaskCurrency = (text) => {
    return handleMountNumberCurrency(text, ".", ",", 3, 2)
}

export default function InputText(props: InputTextProps) {
    const [isValid, setIsValid] = useState(true)

    let classNameInputLocal = `
                            peer
                            p-2 mt-1 
                            block w-full 
                            shadow-sm sm:text-sm 
                            border-gray-300 rounded-md
                            focus:ring-indigo-500 focus:border-indigo-500 
                        `
    let classNameLabelLocal = "block text-sm font-medium text-gray-700"
    let classNameHolder = "w-full"

    if (props.isDisabled) {
        classNameInputLocal = classNameInputLocal + " opacity-60"
        classNameLabelLocal = classNameLabelLocal + " opacity-60"
    }

    if (props.isLoading) {
        classNameInputLocal = classNameInputLocal + STYLE_FOR_INPUT_LOADING
        classNameLabelLocal = classNameLabelLocal + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }

    if (props.classNameLabel) {
        classNameLabelLocal = classNameLabelLocal + " " + props.classNameLabel
    }

    if (props.classNameInput) {
        classNameInputLocal = classNameInputLocal + " " + props.classNameInput
    }

    if (props.holderClassName) {
        classNameHolder = classNameHolder + " " + props.holderClassName
    }

    if (props.isInvalid || !isValid) {
        classNameInputLocal = classNameInputLocal + " ring-red-600 border-red-600  focus:ring-red-600 focus:border-red-600"
    }

    const handleValidation = (text) => {
        let test = true
        switch (props.validation) {
            case NOT_NULL_MARK:
                test = handleValidationNotNull(text)
                break
            case TEXT_NOT_NULL_MARK:
                text = text?.replaceAll(ONLY_CHARACTERS_PATTERN_TWO, '')
                test = handleValidationNotNull(text)
                break
            case DATE_MARK:
                text = handleRemoveDateMask(text)
                if (text.length === 8) {
                    const day = text.substring(0, 2)
                    const month = text.substring(2, 4)
                    const year = text.substring(4, text.length)
                    test = new RegExp(DATE_PATTERN).test(day + "/" + month + "/" + year)
                } else {
                    test = false
                }
                break
            case CEP_MARK:
                text = handleRemoveCEPMask(text)
                test = handleValidationNotNull(text)
                break
            case CPF_MARK:
                text = text?.trim()
                text = handleRemoveCPFMask(text)
                text = text?.replace(new RegExp(ONLY_SPECIAL_FOR_NUMBER_PATTERN), "")
                text = text?.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
                test = new RegExp(CPF_PATTERN).test(text)
                break
            case CNPJ_MARK:
                text = text?.trim()
                text = handleRemoveCNPJMask(text)
                text = text?.replace(new RegExp(ONLY_SPECIAL_FOR_NUMBER_PATTERN), "")
                text = text?.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
                test = new RegExp(CNPJ_PATTERN).test(text)
                break
            case EMAIL_MARK:
                text = text?.trim()
                test = new RegExp(EMAIL_PATTERN).test(text)
                break
            case CCIR_MARK:
                text = text?.trim()
                text = handleRemoveCPFMask(text)
                text = text?.replace(new RegExp(ONLY_SPECIAL_FOR_NUMBER_PATTERN), "")
                text = text?.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
                test = new RegExp(CCIR_PATTERN).test(text)
                break
            case NUMBER_MARK:
                text = text?.trim()
                text = text?.replace(new RegExp(ONLY_SPECIAL_FOR_NUMBER_PATTERN), "")
                text = text?.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
                break
            case TELEPHONE_MARK:
                text = text?.trim()
                text = text?.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
                test = text?.length === 0 || (text.length > 13 && text.length < 16)
                break
        }
        setIsValid(test)

        if (props.onValidate) {
            props.onValidate(test)
        }

        return text
    }

    const handleMask = (text) => {
        let value = text
        switch (props.mask) {
            case "ccir":
                value = handleMountCCIRMask(value)
                break
            case "cpf":
                value = handleMaskCPF(value)
                break
            case "rg":
                value = handleMaskRG(value)
                break
            case "cnpj":
                value = handleMaskCNPJ(value)
                break
            case "date":
                value = handleMaskDate(value)
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
        <div className={classNameHolder}>
            <label htmlFor={props.id}
                className={classNameLabelLocal}>
                {props.title}
            </label>
            <input
                id={props.id}
                name={props.title}
                value={props.value}
                type={props.type ?? "text"}
                maxLength={props.maxLength}
                required={props.isRequired}
                autoFocus={props.isAutoFocus}
                className={classNameInputLocal}
                disabled={props.isDisabled || props.isLoading}
                onBlur={(event) => {
                    if (props.onBlur) {
                        props.onBlur(event)
                    }
                }}
                onChange={(event) => {
                    let text = event.target.value
                    text = handleValidation(text)
                    text = handleMask(text)
                    if (props.onSetText) {
                        props.onSetText(text)
                    }
                }}
            />
            {(props.isInvalid || !isValid) && (
                <p className="text-red-600">{props.validationMessage}</p>
            )}
            {(props.isForShowMessage) && (
                <p className="text-indigo-600">{props.message}</p>
            )}
        </div>
    )
}
