import { Transition } from "@headlessui/react"
import { Fragment } from "react"

export interface FeedbackMessage {
    messages?: string[],
    messageType?: "SUCCESS" | "ERROR" | "WARNING",
}

export const defaultFeedbackMessage: FeedbackMessage = {
    messages: [],
    messageType: "SUCCESS",
}

interface FeedbackMessageModalProps {
    children?: any,
    isOpen?: boolean,
    feedbackMessage?: FeedbackMessage,
    setIsOpen?: (boolean) => void,
}

export default function FeedbackMessageModal(props: FeedbackMessageModalProps) {
    let className = `
                        z-30
                        fixed 
                        py-2 px-5 
                        text-white
                        rounded-md 
                        right-10 bottom-10
                    `
    switch (props.feedbackMessage?.messageType) {
        case "SUCCESS":
            className = className + " bg-green-600"
            break
        case "ERROR":
            className = className + " bg-red-600"
            break
        case "WARNING":
            className = className + " bg-orange-600"
            break
    }

    return (
        <>
            <Transition
                as={Fragment}
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
