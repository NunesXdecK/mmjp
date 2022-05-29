import { useState } from "react";
import { STYLE_FOR_INPUT_LOADING } from "../../util/patternValidationUtil";

interface InputTextWithButtonProps {
    id?: string,
    title?: string,
    value?: string,
    index?: number,
    children?: any,
    isLoading?: boolean,
    isDisabled?: boolean,
    onClick?: (object, string) => void,
}

export default function InputTextWithButton(props: InputTextWithButtonProps) {
    const [text, setText] = useState(props.value ?? "")

    let classNameInput = `
                            z-0
                            flex-1 block w-full 
                            rounded-none rounded-l-md sm:text-sm border-gray-300
                            focus:ring-indigo-500 focus:border-indigo-500 
                        `
    let classNameButton = `
                            px-4
                            rounded-r-md 
                            border border-l-0 border-gray-300
                            inline-flex items-center 
                        `
    if (props.isLoading) {
        classNameInput = classNameInput + STYLE_FOR_INPUT_LOADING
        classNameButton = classNameButton + STYLE_FOR_INPUT_LOADING
    }

    return (
        <form onSubmit={(event) => {
            props.onClick(event, text)
        }}>
            <div className="grid grid-cols-6">
                <div className="p-2 col-span-6">
                    {props.title && (
                        <label
                            htmlFor={props.id}
                            className="block text-sm font-medium text-gray-700">
                            {props.title}
                        </label>
                    )}

                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            id={props.id}
                            disabled={props.isDisabled || props.isLoading}
                            value={text}
                            onChange={(event) => {
                                let value = event.target.value
                                setText(value)
                            }}
                            type="text"
                            className={classNameInput}
                            />

                        <button
                            disabled={props.isDisabled && props.isLoading}
                            type="submit"
                            className={classNameButton}>
                            {props.children}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
