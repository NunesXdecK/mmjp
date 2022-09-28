import HeaderModal from "./headerModal";
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface WindowModalProps {
    isOpen?: boolean,
    children?: any,
    onClose?: () => void,
    setIsOpen?: (boolean) => void,
}

export default function WindowModal(props: WindowModalProps) {
    let cancelButtonRef = useRef(null)

    return (
        <Transition.Root show={props.isOpen} as={Fragment}>
            <Dialog
                className="relative z-30"
                initialFocus={cancelButtonRef}
                open={props.isOpen}
                onClose={() => {
                    if (props.onClose) {
                        props.onClose()
                    }
                }}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
                <div className="fixed z-10 inset-0 overflow-hidden">
                    <div className="flex h-screen items-center justify-center text-center p-6 sm:block">
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

                            <Dialog.Panel className={`
                                relative inline-block align-bottom
                                bg-slate-50 rounded-lg text-left 
                                overflow-y-auto shadow-xl 
                                transform transition-all
                                max-h-[30rem] sm:max-h-[40rem]
                                sm:my-8 sm:align-middle sm:max-w-4xl
                                p-4
                                `}>
                                <HeaderModal
                                    onClose={() => props.setIsOpen(false)} />
                                <div ref={cancelButtonRef}>
                                    {props.children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
