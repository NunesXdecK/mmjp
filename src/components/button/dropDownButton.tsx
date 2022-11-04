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
    const handleFocusBlur = (event) => {
        if (!event?.relatedTarget?.id?.includes(props.id)) {
            setIsOpen(false)
        }
        /*
        */
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
                    onBlur={(event) => handleFocusBlur(event)}
                >
                    {props.title}
                </Button>
            </div>
            <div
                onBlur={(event) => handleFocusBlur(event)}
                onFocus={(event) => handleFocusBlur(event)}
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
