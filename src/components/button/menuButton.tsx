import Button from "./button"
import { useState } from "react"

interface MenuButtonProps {
    id?: string,
    href?: string,
    title?: string,
    className?: string,
    children?: any,
    newTab?: boolean,
    isLink?: boolean,
    isHidden?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    onClick?: (any) => void,
}

export default function MenuButton(props: MenuButtonProps) {
    let className = "py-2 px-4 text-left text-gray-800 bg-slate-50 hover:bg-slate-300 active:bg-slate-400 focus:outline-none"
    className = className + " dark:text-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-700"
    if (props.className) {
        className = props.className
    }
    return (
        <Button
            isLight
            ignoreClass
            href={props.href}
            newTab={props.newTab}
            isLink={props.isLink}
            className={className}
            onClick={props.onClick}
            isHidden={props.isHidden}
            isLoading={props.isLoading}
            isDisabled={props.isDisabled}
            id={props.id + "-menu-button"}
        >
            {props.children}
        </Button >
    )
}
