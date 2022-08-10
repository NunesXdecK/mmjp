import { useRef, useState } from "react"
import { handleValidationNotNull } from "../../util/validationUtil"
import { NOT_NULL_MARK, STYLE_FOR_INPUT_LOADING, STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil"

interface InputTextAutoCompleteProps {
    id?: string,
    value?: string,
    title?: string,
    validation?: string,
    holderClassName?: string,
    validationMessage?: string,
    maxLength?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    isRequired?: boolean,
    ref?: any,
    children?: any,
    sugestions?: any[],
    onChange?: (any) => void,
    onSetText?: (string) => void,
    onValidate?: (boolean) => void,
}

export default function InputTextAutoComplete(props: InputTextAutoCompleteProps) {
    const [isValid, setIsValid] = useState(true)
    const [sugestions, setSugestions] = useState([])
    const inputRef = useRef(props.ref ?? null);
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
    let classNameHolder = "w-full"

    if (props.holderClassName) {
        classNameHolder = classNameHolder + " " + props.holderClassName
    }

    if (props.isLoading) {
        classNameInput = classNameInput + STYLE_FOR_INPUT_LOADING
        classNameLabel = classNameLabel + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }

    if (!isValid) {
        classNameInput = classNameInput + " ring-red-600 border-red-600  focus:ring-red-600 focus:border-red-600"
    }

    const handleCheckSugestion = (text) => {
        let finalSugestions = []
        if (text.length > 0) {
            props.sugestions?.map((element, index) => {
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
        <div className={classNameHolder}>
            <label
                htmlFor={props.id}
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
                    className="absolute bg-white shadow-md mt-2 z-20">
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

            {!isValid && (
                <span className="text-sm whitespace-nowrap text-red-600">{props.validationMessage}</span>
            )}
        </div>
    )
}
