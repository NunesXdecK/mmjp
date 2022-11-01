import { useState } from "react";
import { STYLE_FOR_INPUT_LOADING, STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil";
import FormRow from "../form/formRow";
import FormRowColumn from "../form/formRowColumn";

interface InputTextWithButtonProps {
    id?: string,
    title?: string,
    value?: string,
    holderClassName?: string,
    index?: number,
    children?: any,
    isLoading?: boolean,
    isDisabled?: boolean,
    onBlur?: (any?) => void,
    onClick?: (object, string) => void,
}

export default function InputTextWithButton(props: InputTextWithButtonProps) {
    const [text, setText] = useState(props.value ?? "")

    let classNameInput = "z-0 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 rounded-none rounded-l-md sm:text-sm border-gray-300 "
    let classNameButton = "px-4 rounded-r-md inline-flex items-center border border-l-0 border-gray-300 "
    let classNameHolder = "w-full"

    if (props.holderClassName) {
        classNameHolder = classNameHolder + " " + props.holderClassName
    }

    if (props.isLoading) {
        classNameInput = classNameInput + STYLE_FOR_INPUT_LOADING
        classNameButton = classNameButton + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }

    return (
        <form className={classNameHolder} onSubmit={(event) => {
            props.onClick(event, text)
        }}>
            <FormRow>
                <FormRowColumn unit="6">
                    {props.title && (
                        <label
                            htmlFor={props.id}
                            className="block text-sm font-medium text-gray-700">
                            {props.title}
                        </label>
                    )}

                    <div className="mt-1 flex rounded-md shadow-sm dark:shadow-none">
                        <input
                            type="text"
                            value={text}
                            id={props.id}
                            className={classNameInput}
                            disabled={props.isDisabled || props.isLoading}
                            onBlur={(event) => {
                                if (props.onBlur) {
                                    props.onBlur(event)
                                }
                            }}
                            onChange={(event) => {
                                let value = event.target.value
                                setText(value)
                            }}
                        />

                        <button
                            disabled={props.isDisabled && props.isLoading}
                            type="submit"
                            className={classNameButton}>
                            {props.children}
                        </button>
                    </div>
                </FormRowColumn>
            </FormRow>
        </form>
    )
}
