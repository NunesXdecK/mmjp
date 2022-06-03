import { STYLE_FOR_INPUT_LOADING } from "../../util/patternValidationUtil"

interface ButtonProps {
    children?: any,
    isHidden?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    type?: "button" | "submit" | "reset",
    onClick?: () => void,
}

export default function Button(props: ButtonProps) {

    let className = `
                        py-2 px-4 
                        shadow-sm 
                        justify-center 
                        disabled:opacity-40
                        border border-transparent 
                        bg-indigo-600 hover:bg-indigo-700 
                        text-sm font-medium rounded-md text-white 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:border-indigo-500 focus:ring-indigo-500
                    `
    if (props.isLoading) {
        className = className + STYLE_FOR_INPUT_LOADING
    }

    if (props.isHidden) {
        className = className + " hidden"
    }

    return (
        <>
            <button
                disabled={props.isDisabled}
                type={props.type}
                onClick={props.onClick}
                className={className}>
                {props.children}
            </button>
        </>
    )
}
