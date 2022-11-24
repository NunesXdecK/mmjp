import { STYLE_FOR_INPUT_LOADING, STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil"

interface InputCheckboxProps {
    id?: string,
    title?: string,
    holderClassName?: string,
    value?: boolean,
    isHidden?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    onBlur?: (any?) => void,
    onSetText?: (string) => void,
}
export default function InputCheckbox(props: InputCheckboxProps) {

    let classNameHolder = "w-full dark:text-slate-50"
    let classNameLabel = "font-medium text-gray-700 dark:text-gray-200"
    let classNameInput = "h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded "
    classNameInput = classNameInput + " dark:text-gray-200 dark:bg-slate-800 dark:shadow-none dark:border-gray-600 "
    classNameInput = classNameInput + " dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:ring-gray-600 "

    if (props.holderClassName) {
        classNameHolder = classNameHolder + " " + props.holderClassName
    }

    if (props.isLoading) {
        classNameInput = classNameInput + STYLE_FOR_INPUT_LOADING
        classNameLabel = classNameLabel + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }

    return (
        <div className={classNameHolder}>
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id={props.id}
                        type="checkbox"
                        name={props.id}
                        checked={props.value}
                        hidden={props.isHidden}
                        className={classNameInput}
                        disabled={props.isDisabled || props.isLoading}
                        onBlur={(event) => {
                            if (props.onBlur) {
                                props.onBlur(event)
                            }
                        }}
                        onChange={(event) => {
                            props.onSetText(!props.value)
                        }}
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor={props.id} className={classNameLabel}>{props.title}</label>
                </div>
            </div>
        </div>
    )
}

