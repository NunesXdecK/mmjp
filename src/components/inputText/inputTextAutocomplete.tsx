import { useEffect, useRef, useState } from "react"
import { handleValidationNotNull } from "../../util/validationUtil"
import { handleMaskCPF, handleMaskTelephone, handleMountCNPJMask, handleMountDateMask, handleMountMask, handleMountNumberCurrency, handleRemoveCEPMask, handleRemoveCNPJMask, handleRemoveCPFMask, handleRemoveDateMask } from "../../util/maskUtil"
import { CEP_MARK, CNPJ_MARK, CNPJ_PATTERN, CPF_MARK, CPF_PATTERN, DATE_MARK, DATE_PATTERN, NOT_NULL_MARK, NUMBER_MARK, ONLY_CHARACTERS_PATTERN, ONLY_CHARACTERS_PATTERN_TWO, ONLY_SPECIAL_FOR_NUMBER_PATTERN, STYLE_FOR_INPUT_LOADING, STYLE_FOR_INPUT_LOADING_TRANSPARENT, TELEPHONE_MARK, TEXT_NOT_NULL_MARK } from "../../util/patternValidationUtil"

interface InputTextAutoCompleteProps {
    id?: string,
    value?: string,
    title?: string,
    validation?: string,
    validationMessage?: string,
    maxLength?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    isRequired?: boolean,
    children?: any,
    onChange?: (any) => void,
    onSetText?: (string) => void,
    onValidate?: (boolean) => void,
}

export default function InputTextAutoComplete(props: InputTextAutoCompleteProps) {
    const [isValid, setIsValid] = useState(true)
    const [sugestions, setSugestions] = useState([])
    const inputRef = useRef(null);
    const divRef = useRef(null);

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
        classNameLabel = classNameLabel + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }

    if (!isValid) {
        classNameInput = classNameInput + " ring-red-600 border-red-600  focus:ring-red-600 focus:border-red-600"
    }

    const handleCheckSugestion = (text) => {
        const sugestions = ["Georeferenciamento", "Ambiental", "Licenciamento"]
        let finalSugestions = []
        if (text.length > 0) {
            sugestions.map((element, index) => {
                if (element.toString().toLowerCase().includes(text.toString().toLowerCase())) {
                    finalSugestions = [...finalSugestions, element]
                }
            })
        }
        setSugestions(sugestions => finalSugestions)
    }

    const handleValidation = (text) => {
        let test = true
        switch (props.validation) {
            case NOT_NULL_MARK:
                test = handleValidationNotNull(text)
                setIsValid(test)
                break
        }

        if (props.onValidate) {
            props.onValidate(test)
        }
        return text
    }

    return (
        <>
            <label htmlFor={props.id}
                className={classNameLabel}>
                {props.title}
            </label>

            <input
                type="text"
                id={props.id}
                ref={inputRef}
                name={props.title}
                value={props.value}
                className={classNameInput}
                maxLength={props.maxLength}
                required={props.isRequired}
                disabled={props.isDisabled || props.isLoading}
                onChange={(event) => {
                    let text = event.target.value
                    text = handleValidation(text)
                    if (!text.includes(" ")) {
                        handleCheckSugestion(text)
                    } else {
                        handleCheckSugestion("")
                    }
                    props.onSetText(text)
                }}
            />

            {sugestions.length > 0 && (
                <div
                    ref={divRef}
                    className="absolute bg-white shadow-md mt-2">
                    {sugestions.map((element, index) => (
                        <div key={index + element}>
                            <button
                                onClick={() => {
                                    props.onSetText(element + " ")
                                    inputRef.current.focus()
                                    handleCheckSugestion("")
                                }}
                                type="button"
                                className="text-left text-gray-600 w-full px-2 py-4"> {element}
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {!isValid && (<p className="text-red-600">{props.validationMessage}</p>)}
        </>
    )
}
