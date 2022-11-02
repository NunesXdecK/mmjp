import { STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil"

interface ButtonProps {
    id?: string,
    href?: string,
    className?: string,
    color?: "red",
    children?: any,
    newTab?: boolean,
    isLink?: boolean,
    isLight?: boolean,
    isSwitch?: boolean,
    isHidden?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    ignoreClass?: boolean,
    type?: "button" | "submit" | "reset",
    onBlur?: (any) => void,
    onClick?: (any) => void,
}

export default function Button(props: ButtonProps) {
    let colorClassName = ""
    let className = ""

    if (props.isLight) {
        colorClassName = "bg-slate-50 hover:bg-gray-300 focus:ring-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        className = "text-center h-min p-2 shadow-sm dark:shadow-none justify-center text-sm font-medium rounded-full text-white disabled:opacity-40 focus:outline-none"
    } else if (props.isSwitch) {
        colorClassName = "bg-transparent hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:focus:ring-gray-700"
        className = "p-2 h-min text-center shadow-sm dark:shadow-none justify-center rounded-full text-sm font-medium text-gray-500 disabled:opacity-40 focus:outline-none"
    } else {
        colorClassName = "bg-indigo-600 hover:bg-indigo-700 focus:border-indigo-500 focus:ring-indigo-500"
        colorClassName = colorClassName + " dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:border-purple-500 dark:focus:ring-purple-500"
        className = "text-center h-min py-2 px-4 shadow-sm dark:shadow-none  justify-center disabled:opacity-40 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800"
    }

    switch (props.color) {
        case "red":
            colorClassName = "bg-red-600 hover:bg-red-700 focus:border-red-500 focus:ring-red-500"
            break
    }

    if (props.className) {
        className = className + " " + props.className
    }

    className = colorClassName + " " + className

    if (props.ignoreClass) {
        className = props.className
    }

    if (props.isLoading) {
        className = className + " " + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }

    if (props.isHidden) {
        className = className + " hidden"
    }

    return (
        <>
            {props.isLink ? (
                <a
                    id={props.id}
                    href={props.href}
                    className={className}
                    target={props.newTab && "_blank"}
                >
                    {props.children}
                </a>
            ) : (
                <button
                    id={props.id}
                    type={props.type}
                    className={className}
                    onBlur={props.onBlur}
                    onClick={props.onClick}
                    disabled={props.isDisabled || props.isLoading}
                >
                    {props.children}
                </button>
            )
            }
        </>
    )
}
