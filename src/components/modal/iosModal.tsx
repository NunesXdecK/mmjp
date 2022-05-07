import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment, useRef } from "react";
import HeaderModal from "./headerModal";

export default function IOSModal(props) {
    let cancelButtonRef = useRef(null)

    return (
        <Transition.Root show={props.isOpen} as={Fragment}>
            <Dialog
                className="fixed inset-0 z-10"
                initialFocus={cancelButtonRef}
                open={props.isOpen}
                onClose={() => { }}>

                <div className="fex flex-col px-1 pt-10 justify-center h-full sm:block">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-200 sm:duration-300"
                        enterFrom="translate-y-full"
                        enterTo="translate-y-0"
                        leave="transform transition ease-in-out duration-200 sm:duration-300"
                        leaveFrom="translate-y-0"
                        leaveTo="translate-y-full"
                    >
                        <Dialog.Panel className={`
                                z-0 flex flex-col h-full
                                bg-white rounded-t-lg shadow-xl
                                `}>

                            <Transition.Child
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0">
                                <HeaderModal
                                    onClose={() => props.setIsOpen(false)}/>
                                <div className="p-4">
                                    {props.children}
                                </div>
                            </Transition.Child>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
