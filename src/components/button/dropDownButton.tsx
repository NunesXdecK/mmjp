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
    let HolderClassName = "relative"
    let optionsHolderClassName = " min-w-max shadow-m dark:shadow-none mt-2 z-20 bg-transparent rounded"
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
        <>
            {!props.isHidden && (
                <div className={HolderClassName}>
                    <div>
                        <Button
                            className={props.className}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            id={props.id + "-drop-down-button"}
                            ignoreClass={props.className?.length > 0}
                            onClick={(event) => {
                                event.stopPropagation()
                                setIsOpen(!isOpen)
                            }}
                            onBlur={(event) => handleFocusBlur(event)}
                        >
                            {props.title}
                        </Button>
                    </div>
                    <div
                        onClick={() => setIsOpen(false)}
                        id={props.id + "-drop-down-info"}
                        className={optionsHolderClassName}
                        onBlur={(event) => handleFocusBlur(event)}
                        onFocus={(event) => handleFocusBlur(event)}
                    >
                        <ScrollDownTransition isOpen={isOpen}>
                            {props.children}
                        </ScrollDownTransition>
                    </div>
                </div>
            )}
        </>
    )
}
