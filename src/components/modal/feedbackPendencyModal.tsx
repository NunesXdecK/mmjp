import { useEffect, useState } from "react"
import { Transition } from "@headlessui/react"
import { ExclamationCircleIcon } from "@heroicons/react/solid"

interface FeedbackPendencyProps {
    isFirst: boolean,
}

export default function FeedbackPendency(props: FeedbackPendencyProps) {
    const [messages, setMessages] = useState<string[]>([])
    let className = "z-20 fixed py-2 px-5 bg-red-600 text-white rounded-md right-16 lg:right-60 top-16 animate-bounce print:hidden"

    useEffect(() => {
        if (props.isFirst && messages.length === 0) {
            fetch("api/checkPendencies").then((res) => res.json()).then((res) => {
                if (res.messages.length) {
                    setMessages(res.messages)
                }
            })
        }
    })

    return (
        <>
            <Transition
                show={!props.isFirst}
                enter="transition-opacity duration-[500ms]"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-[500ms]"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div className={className}>
                    <div className="hidden sm:block">
                        {messages?.map((element, index) => (
                            <p key={index + element}>{element}</p>
                        ))}
                    </div>
                    <div className="block sm:hidden">
                        <ExclamationCircleIcon className="text-white block h-5 w-5" aria-hidden="true" />
                    </div>
                </div>
            </Transition>
        </>
    )
}
