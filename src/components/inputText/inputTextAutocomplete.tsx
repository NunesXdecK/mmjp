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
    onBlur?: (any?) => void,
    onChange?: (any) => void,
    onClickItem?: (any) => void,
    onSetText?: (string) => void,
    onValidate?: (boolean) => void,
    onListOptions?: (any) => any,
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

    const handleCheckSugestion = (text) => {
        let finalSugestions = []
        if (text.length > 0) {
            finalSugestions = props?.sugestions?.filter((element, index) => {
                let name = ""
                if (element) {
                    if (typeof element === "string") {
                        name = element
                    } else if (typeof element === "object") {
                        if ("name" in element) {
                            name = element.name
                        }
                        if ("title" in element) {
                            name = element.title
                        }
                    }
                }
                return name.toLowerCase().includes(text.toLowerCase())
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
            <div>
                <label
                    htmlFor={props.id}
                    className={classNameLabel}>
                    {props.title}
                </label>

                <input
                    type="text"
                    ref={inputRef}
                    name={props.title}
                    value={props.value}
                    className={classNameInput}
                    maxLength={props.maxLength}
                    required={props.isRequired}
                    id={props.id + "-auto-complete"}
                    disabled={props.isDisabled || props.isLoading}
                    onBlur={(event) => {
                        if (props.onBlur) {
                            props.onBlur(event)
                        }
                        if (!event?.relatedTarget?.id ||
                            event?.relatedTarget?.id.indexOf(props.id + "-auto-complete-option-") < 0) {
                            handleCheckSugestion("")
                        }
                    }}
                    onChange={(event) => {
                        let text = event.target.value
                        text = handleValidation(text)
                        if (!text.includes(" ")) {
                            handleCheckSugestion(text)
                            let input: HTMLInputElement = document.querySelector("#" + props.id + "-auto-complete")
                            let suggestionHolder: HTMLDivElement = document.querySelector("#" + props.id + "-suggestions-holder")
                            if (input && suggestionHolder) {
                                suggestionHolder.style.width = input.offsetWidth + "px"
                            }
                        } else {
                            handleCheckSugestion("")
                        }
                        props.onSetText(text)
                    }}
                />
                {!isValid && (
                    <span className="text-sm whitespace-nowrap text-red-600">{props.validationMessage}</span>
                )}
            </div>

            <div
                id={props.id + "-suggestions-holder"}
                className="absolute shadow-m mt-2 z-20 bg-slate-50 rounded"
            >
                {sugestions.length > 0 && (
                    <div
                        ref={divRef}
                        className="rounded w-full">
                        {props?.onListOptions && props?.onListOptions(handleCheckSugestion)}
                        {sugestions.map((element, index) => (
                            <button
                                id={props.id + "-auto-complete-option-" + index}
                                key={props.id + index + (typeof element === "string" ? element
                                    : ("id" in element && element?.id?.length > 0 ? element.id : ""))}
                                onClick={() => {
                                    if (props?.onClickItem) {
                                        props.onClickItem(element)
                                    } else if (props?.onSetText) {
                                        props.onSetText(element)
                                    }
                                    inputRef.current.focus()
                                    handleCheckSugestion("")
                                }}
                                type="button"
                                className="text-left text-gray-600 w-full px-2 py-4 hover:bg-gray-300">
                                {element && typeof element === "string" ? element : "name" in element && element.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}
