import { useState } from "react"
import { handleJSONcheck, handleValidationNotNull } from "../../util/validationUtil"
import { JSON_MARK, NOT_NULL_MARK, STYLE_FOR_INPUT_LOADING, STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil"

interface InputTextAreaProps {
    id?: string,
    type?: string,
    value?: string,
    title?: string,
    validation?: string,
    placeholder?: string,
    holderClassName?: string,
    validationMessage?: string,
    maxLength?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    isRequired?: boolean,
    isAutoFocus?: boolean,
    children?: any,
    mask?: "cpf" | "rg" | "cnpj" | "currency" | "telephone" | "cep" | "perimeter" | "area" | "date",
    onBlur?: (any?) => void,
    onChange?: (any) => void,
    onSetText?: (string) => void,
    onValidate?: (boolean) => void,
}


export default function InputTextArea(props: InputTextAreaProps) {
    const [isValid, setIsValid] = useState(true)

    let classNameHolder = "w-full dark:text-slate-50"
    let classNameLabel = "block text-sm font-medium text-gray-700 dark:text-gray-200"
    let classNameInput = "peer p-2 mt-1 block w-full shadow-sm dark:shadow-none sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 "
    classNameInput = classNameInput + " dark:border-gray-700 dark:text-gray-200 dark:bg-slate-800 "

    if (props.holderClassName) {
        classNameHolder = classNameHolder + " " + props.holderClassName
    }

    if (props.isDisabled) {
        classNameInput = classNameInput + " opacity-60"
        classNameLabel = classNameLabel + " opacity-60"
    }

    if (props.isLoading) {
        classNameInput = classNameInput + STYLE_FOR_INPUT_LOADING
        classNameLabel = classNameLabel + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }

    if (!isValid) {
        classNameInput = classNameInput + " ring-red-600 border-red-600  focus:ring-red-600 focus:border-red-600"
    }

    const handleValidation = (text) => {
        let test = true
        switch (props.validation) {
            case NOT_NULL_MARK:
                test = handleValidationNotNull(text)
                setIsValid(test)
                break
            case JSON_MARK:
                test = handleJSONcheck(text)
                setIsValid(test)
                break
        }

        if (props.onValidate) {
            props.onValidate(test)
        }
        return text
    }

    return (
        <div className={classNameHolder}>
            <label htmlFor={props.id}
                className={classNameLabel}>
                {props.title}
            </label>
            <textarea
                rows={3}
                id={props.id}
                name={props.title}
                value={props.value}
                className={classNameInput}
                maxLength={props.maxLength}
                required={props.isRequired}
                autoFocus={props.isAutoFocus}
                placeholder={props.placeholder}
                disabled={props.isDisabled || props.isLoading}
                onBlur={(event) => {
                    if (props.onBlur) {
                        props.onBlur(event)
                    }
                }}
                onChange={(event) => {
                    let text = event.target.value
                    text = handleValidation(text)
                    props.onSetText(text)
                    if (props.onChange) {
                        props.onChange(event)
                    }
                }}
            />
            {!isValid && (
                <p className="text-red-600">{props.validationMessage}</p>
            )}
        </div>
    )
}
