import { STYLE_FOR_INPUT_LOADING, STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil"

interface InputSelectProps {
    id?: string,
    value?: string,
    title?: string,
    validation?: string,
    holderClassName?: string,
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
                            focus:outline-none 
                            border-gray-300 bg-slate-50
                            rounded-md shadow-sm border 
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
    return (
        <div className={classNameHolder}>
            <label htmlFor={props.id} className={classNameLabel}>
                {props.title}
            </label>
            <select
                id={props.id}
                name={props.id}
                className={classNameInput}
                value={props.value.toLowerCase()}
                disabled={props.isDisabled || props.isLoading}
                onChange={(event) => {
                    props.onSetText(event.target.value)
                }}
            >
                <option value="">Selecione uma opção</option>
                {props.options.map((element, index) => {
                    return (
                        <option
                            key={index + element}
                            value={element}
                        >
                            {element.substring(0, 1).toUpperCase() + element.substring(1, element.length).toLowerCase()}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}