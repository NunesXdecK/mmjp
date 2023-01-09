import { useRef, useState } from "react"
import { handleValidationNotNull } from "../../util/validationUtil"
import { NOT_NULL_MARK, STYLE_FOR_INPUT_LOADING, STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil"

interface InputTextAutoCompleteProps {
    id?: string,
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
    ref?: any,
    children?: any,
    sugestions?: any[],
    onBlur?: (any?) => void,
    onChange?: (any) => void,
    onClickItem?: (any) => void,
    onSetText?: (string) => void,
    onValidate?: (boolean) => void,
    onListOptions?: (any) => any,
    onFilter?: ([], string) => any[],
}

export default function InputTextAutoComplete(props: InputTextAutoCompleteProps) {
    const divRef = useRef(null)
    const inputRef = useRef(props.ref ?? null)
    const [isValid, setIsValid] = useState(true)
    const [sugestions, setSugestions] = useState([])

    let classNameHolder = "w-full relative "
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

    const handleOnSet = (value) => {
        if (props.onSetText) {
            props.onSetText(value)
        }
    }

    const handleCheckSugestion = (text) => {
        let finalSugestions = []
        if (text.length > 0) {
            finalSugestions =
                (props.onFilter && props.onFilter(props.sugestions, text)) ??
                props?.sugestions?.filter((element, index) => {
                    let name = ""
                    let title = ""
                    let username = ""
                    let pointId = ""
                    if (element) {
                        if (typeof element === "string") {
                            name = element
                        } else if (typeof element === "object") {
                            if ("name" in element) {
                                name = element.name
                            }
                            if ("title" in element) {
                                title = element.title
                            }
                            if ("username" in element) {
                                username = element.username
                            }
                            if ("pointId" in element) {
                                pointId = element.pointId
                            }
                        }
                    }
                    return name.toLowerCase().includes(text.toLowerCase())
                        || title.toLowerCase().includes(text.toLowerCase())
                        || username.toLowerCase().includes(text.toLowerCase())
                        || pointId.toLowerCase().includes(text.toLowerCase())
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
                    placeholder={props.placeholder}
                    id={props.id + "-auto-complete"}
                    disabled={props.isDisabled || props.isLoading}
                    onBlur={(event) => {
                        if (props.onBlur) {
                            props.onBlur(event)
                        }
                        if (!event?.relatedTarget?.id ||
                            event?.relatedTarget?.id.indexOf(props.id + "-auto-complete-option-") < 0) {
                            handleCheckSugestion("")
                            /*
                            if (props.onListOptions) {
                                handleOnSet("")
                            }
                            */
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
                            /*
                            if (props.onListOptions) {
                                text = ""
                            }
                            */
                        }
                        handleOnSet(text)
                    }}
                />
                {!isValid && (
                    <span className="text-sm whitespace-nowrap text-red-600">{props.validationMessage}</span>
                )}
            </div>
            <div
                id={props.id + "-suggestions-holder"}
                className="absolute shadow-md dark:shadow-none mt-2 z-40 bg-slate-50 dark:bg-gray-800 dark:text-slate-200 rounded"
            >
                {(props.value.length > 0 && !props.isDisabled) && (
                    <div
                        ref={divRef}
                        onClick={() => {
                            handleCheckSugestion("")
                        }}
                        className="rounded w-full">
                        <div
                            onClick={() => {
                                handleOnSet("")
                            }}>
                            {props?.onListOptions && props?.onListOptions(handleCheckSugestion)}
                        </div>
                        {sugestions.map((element, index) => (
                            <button
                                id={props.id + "-auto-complete-option-" + index}
                                key={props.id + index + (typeof element === "string" ? element
                                    : ("id" in element && element?.id?.length > 0 ? element.id : ""))}
                                onClick={() => {
                                    if (props?.onClickItem) {
                                        props.onClickItem(element)
                                    } else {
                                        handleOnSet(element)
                                    }
                                    inputRef.current.focus()
                                }}
                                type="button"
                                className="text-left text-gray-600 dark:text-gray-300 w-full px-2 py-4 hover:bg-gray-300 dark:hover:bg-gray-700">
                                {element && typeof element === "string" ? element
                                    : "name" in element ? element.name
                                        : "title" in element ? element.title
                                            : "username" in element ? element.username
                                                : "pointId" in element && element.pointId
                                }
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
