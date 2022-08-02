import { Transition } from "@headlessui/react";

interface ScrollDownTransitionProps {
    isOpen?: boolean,
    children?: any,
}

export default function ScrollDownTransition(props: ScrollDownTransitionProps) {
    return (
        <Transition.Root
            show={props.isOpen}>
            <Transition.Child
                enter="transform transition duration-500"
                enterFrom="h-0"
                enterTo="h-auto"
                leave="transform transition duration-500"
                leaveFrom="h-auto"
                leaveTo="h-0"
            >
                <Transition.Child
                    enter=""
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave=""
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {props.children}
                </Transition.Child>
            </Transition.Child>
        </Transition.Root>
    )
}