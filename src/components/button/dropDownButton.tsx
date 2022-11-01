import Button from "./button"
import { useState } from "react"
import ScrollDownTransition from "../animation/scrollDownTransition"

interface DropDownButtonProps {
    id?: string,
    className?: string,
    title?: any,
    children?: any,
    isLeft?: boolean,
    isHidden?: boolean,
    isLoading?: boolean,
    isNotFloat?: boolean,
    isDisabled?: boolean,
}

export default function DropDownButton(props: DropDownButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    let optionsHolderClassName = " min-w-max shadow-m dark:shadow-none mt-2 z-20 bg-slate-50 rounded"
    if (!props.isNotFloat) {
        optionsHolderClassName = optionsHolderClassName + " absolute"
    }
    if (props.isLeft) {
        optionsHolderClassName = optionsHolderClassName + " right-0"
    }
    return (
        <div className="relative">
            <div>
                <Button
                    className={props.className}
                    isLoading={props.isLoading}
                    isDisabled={props.isDisabled}
                    id={props.id + "-drop-down-button"}
                    ignoreClass={props.className?.length > 0}
                    onClick={(event) => {
                        setIsOpen(!isOpen)
                    }}
                    onBlur={(event) => {
                        if (!event?.relatedTarget?.id ||
                            event?.relatedTarget?.id.indexOf(props.id) < 0) {
                            setIsOpen(false)
                        }
                    }}
                >
                    {props.title}
                </Button>
            </div>
            <div
                id={props.id + "-drop-down-info"}
                className={optionsHolderClassName}
            >
                <ScrollDownTransition isOpen={isOpen}>
                    {props.children}
                </ScrollDownTransition>
            </div>
        </div>
    )
}
