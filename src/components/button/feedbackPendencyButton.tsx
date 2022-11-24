import { useEffect, useState } from "react"
import DropDownButton from "./dropDownButton"
import { BellIcon } from "@heroicons/react/solid"

interface FeedbackPendencyButtonProps {
    check?: boolean,
    isLoading?: boolean,
    messages?: string[],
    onSetCheck?: (any) => void,
}

export default function FeedbackPendencyButton(props: FeedbackPendencyButtonProps) {
    const [messages, setMessages] = useState<string[]>([])
    const handleSetCheck = (value) => {
        if (props.onSetCheck) {
            props.onSetCheck(value)
        }
    }

    useEffect(() => {
        if (props.check) {
            fetch("api/checkPendencies").then((res) => res.json()).then((res) => {
                handleSetCheck(false)
                if (res.messages) {
                    setMessages(res.messages)
                }
            })
        }
    })

    return (
        <DropDownButton
            isLeft
            isDisabled={props.isLoading}
            id="feedback-message-drop-down"
            isHidden={messages.length === 0}
            className="p-2 bg-transparent hover:bg-gray-600 rounded-full"
            title={(
                <>
                    {messages.length > 0 && (
                        <div className="relative">
                            <div className="absolute">
                                <span className="flex">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full p-1 bg-red-600"></span>
                                </span>
                            </div>
                            <BellIcon className="text-gray-200 block h-5 w-5" aria-hidden="true" />
                        </div>
                    )}
                </>
            )}
        >
            <div className="text-gray-200">
                {messages.map((element, index) => (
                    <p key={index + "-feedback-pendency-notification"}>{element}</p>
                ))}
            </div>
        </DropDownButton>
    )
}
