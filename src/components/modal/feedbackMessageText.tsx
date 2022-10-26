import { Transition } from "@headlessui/react"
import { FeedbackMessage } from "./feedbackMessageModal"

interface FeedbackMessageTextProps {
    className?: string,
    children?: any,
    isOpen?: boolean,
    feedbackMessage?: FeedbackMessage,
    setIsOpen?: (boolean) => void,
}

export default function FeedbackMessageText(props: FeedbackMessageTextProps) {
    let className = "z-20 mt-2"
    switch (props.feedbackMessage?.messageType) {
        case "SUCCESS":
            className = className + " text-green-600"
            break
        case "ERROR":
            className = className + " text-red-600"
            break
        case "WARNING":
            className = className + " text-orange-600"
            break
    }

    if (props.className) {
        className = className + " " + props.className
    }

    return (
        <>
            <Transition
                show={props.isOpen}
                enter="transition-opacity duration-[500ms]"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-[500ms]"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div className={className}>
                    {props.feedbackMessage?.messages?.map((element, index) => (
                        <p key={index + element}>{element}</p>
                    ))}
                </div>
            </Transition>
        </>
    )
}
