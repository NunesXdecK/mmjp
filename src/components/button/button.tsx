import { STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil"

interface ButtonProps {
    href?: string,
    color?: "red",
    children?: any,
    isLink?: boolean,
    isHidden?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    type?: "button" | "submit" | "reset",
    onClick?: (any) => void,
}

export default function Button(props: ButtonProps) {
    let colorClassName = "bg-indigo-600 hover:bg-indigo-700 focus:border-indigo-500 focus:ring-indigo-500"

    switch (props.color) {
        case "red":
            colorClassName = "bg-red-600 hover:bg-red-700 focus:border-red-500 focus:ring-red-500"
            break
    }

    let className = `
                        py-2 px-4 
                        shadow-sm 
                        justify-center 
                        disabled:opacity-40
                        border border-transparent 
                        text-sm font-medium rounded-md text-white 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                    `
    if (props.isLoading) {
        className = className + " " + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }

    if (props.isHidden) {
        className = className + " hidden"
    }

    className = colorClassName + " " + className
    return (
        <>
            {props.isLink ? (
                <a
                    href={props.href}
                    className={className}>
                    {props.children}
                </a>
            ) : (
                <button
                    disabled={props.isDisabled}
                    type={props.type}
                    onClick={props.onClick}
                    className={className}>
                    {props.children}
                </button>
            )
            }
        </>
    )
}
