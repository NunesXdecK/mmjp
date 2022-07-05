import { STYLE_FOR_INPUT_LOADING, STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil"

interface InputCheckboxProps {
    id?: string,
    value?: boolean,
    title?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    onSetText?: (string) => void,
}
export default function InputCheckbox(props: InputCheckboxProps) {

    let classNameInput = `
                    h-4 w-4 
                    text-indigo-600 
                    focus:ring-indigo-500 
                    border-gray-300 rounded 
                        `
    let classNameLabel = "font-medium text-gray-700"
    if (props.isLoading) {
        classNameInput = classNameInput + STYLE_FOR_INPUT_LOADING
        classNameLabel = classNameLabel + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }

    return (
        <>
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id={props.id}
                        type="checkbox"
                        name={props.id}
                        checked={props.value}
                        className={classNameInput}
                        disabled={props.isDisabled || props.isLoading}
                        onChange={(event) => {
                            props.onSetText(!props.value)
                        }}
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor={props.id} className={classNameLabel}>{props.title}</label>
                </div>
            </div>
        </>
    )
}

