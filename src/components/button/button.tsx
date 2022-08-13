import { STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil"

interface ButtonProps {
    href?: string,
    className?: string,
    color?: "red",
    children?: any,
    newTab?: boolean,
    isLink?: boolean,
    isLight?: boolean,
    isHidden?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    type?: "button" | "submit" | "reset",
    onClick?: (any) => void,
}

export default function Button(props: ButtonProps) {
    let colorClassName = ""
    let className = ""

    if (props.isLight) {
        colorClassName = "bg-slate-50 hover:bg-gray-300  focus:ring-gray-300"
        className = `
                        text-center
                        h-min
                        p-2 
                        shadow-sm 
                        justify-center 
                        text-sm font-medium rounded-full text-white 
                        disabled:opacity-40
                        focus:outline-none
                    `
    } else {
        colorClassName = "bg-indigo-600 hover:bg-indigo-700 focus:border-indigo-500 focus:ring-indigo-500"
        className = `
                        text-center
                        h-min
                        py-2 px-4 
                        shadow-sm 
                        justify-center 
                        disabled:opacity-40
                        border border-transparent 
                        text-sm font-medium rounded-md text-white 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                    `
    }

    switch (props.color) {
        case "red":
            colorClassName = "bg-red-600 hover:bg-red-700 focus:border-red-500 focus:ring-red-500"
            break
    }

    if (props.isLoading) {
        className = className + " " + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }

    if (props.isHidden) {
        className = className + " hidden"
    }

    if (props.className) {
        className = className + " " + props.className
    }

    className = colorClassName + " " + className

    return (
        <>
            {props.isLink ? (
                <a
                    href={props.href}
                    className={className}
                    target={props.newTab && "_blank"}
                >
                    {props.children}
                </a>
            ) : (
                <button
                    type={props.type}
                    className={className}
                    onClick={props.onClick}
                    disabled={props.isDisabled}
                >
                    {props.children}
                </button>
            )
            }
        </>
    )
}
