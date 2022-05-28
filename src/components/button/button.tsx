import { STYLE_FOR_INPUT_LOADING } from "../../util/patternValidationUtil"

interface ButtonProps {
    children?: any,
    isLoading?: boolean,
    isDisabled?: boolean,
    type?: "button" | "submit" | "reset",
    onClick?: () => void,
}

export default function Button(props: ButtonProps) {

    let className = `
                        justify-center py-2 px-4 
                        border border-transparent 
                        shadow-sm 
                        text-sm font-medium rounded-md text-white 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        disabled:opacity-80
                        focus:border-indigo-500 focus:ring-indigo-500
                        bg-indigo-600 hover:bg-indigo-700 
                    `
    if (props.isLoading) {
        className = className + STYLE_FOR_INPUT_LOADING
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
