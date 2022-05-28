import { STYLE_FOR_INPUT_LOADING } from "../../util/PatternValidationUtil"

interface InputSelectProps {
    id?: string,
    value?: string,
    title?: string,
    validation?: string,
    validationMessage?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    isRequired?: boolean,
    options?: string[],
    onValidate?: (boolean) => void,
    onSetText?: (string) => void,
}
export default function InputSelect(props: InputSelectProps) {

    let classNameInput = `
                            block 
                            w-full 
                            mt-1 
                            py-2 px-3 
                            sm:text-sm
                            rounded-md shadow-sm border 
                            border-gray-300 bg-white 
                            focus:outline-none 
                            focus:ring-indigo-500 focus:border-indigo-500 
                        `
    let classNameLabel = "block text-sm font-medium text-gray-700"
    if (props.isLoading) {
        classNameInput = classNameInput + STYLE_FOR_INPUT_LOADING
        classNameLabel = classNameLabel + STYLE_FOR_INPUT_LOADING
    }
    return (
        <>
            <label htmlFor={props.id} className={classNameLabel}>
                {props.title}
            </label>
            <select
                id={props.id}
                name={props.id}
                value={props.value.toLowerCase()}
                onChange={(event) => {
                    props.onSetText(event.target.value)
                }}
                className={classNameInput}>
                {props.options.map((element, index) => {
                    return (
                        <option
                            key={index + element}
                            value={element}

                        >{element.substring(0, 1).toUpperCase() + element.substring(1, element.length).toLowerCase()}</option>
                    )

                })}
            </select>
        </>
    )
}