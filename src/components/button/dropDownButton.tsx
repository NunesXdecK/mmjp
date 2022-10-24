import Button from "./button"
import { useState } from "react"
import ScrollDownTransition from "../animation/scrollDownTransition"

interface DropDownButtonProps {
    id?: string,
    title?: string,
    children?: any,
    isLeft?: boolean,
    isHidden?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
}

export default function DropDownButton(props: DropDownButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    let optionsHolderClassName = "absolute min-w-max shadow-m mt-2 z-20 bg-slate-50 rounded"
    if (props.isLeft) {
        optionsHolderClassName = optionsHolderClassName + " right-0"
    }
    return (
        <div className="relative">
            <div>
                <Button
                    isLoading={props.isLoading}
                    isDisabled={props.isDisabled}
                    id={props.id + "-drop-down-button"}
                    onClick={(event) => {
                        setIsOpen(!isOpen)
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
