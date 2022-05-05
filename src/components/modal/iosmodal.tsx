import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";

export default function IOSModal(props) {
    let cancelButtonRef = useRef(null)

    return (
        <Transition.Root show={props.isOpen} as={Fragment}>
            <Dialog
                className="fixed inset-0 z-10"
                initialFocus={cancelButtonRef}
                open={props.isOpen}
                onClose={() => { }}>
                <div className="fex flex-col justify-center h-full px-1 pt-4 sm:block sm:p-0 p-10 pb-0">

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
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

                        <Dialog.Panel className={`
                                z-0 flex flex-col w-full h-full
                                bg-white rounded-t-lg shadow-xl
                                
                                `}>
                            <div className="flex w-full justify-end p-4">
                                <span
                                    onClick={() => props.setIsOpen(false)}>
                                    X
                                </span>
                            </div>
                            <div className="p-4">
                                {props.children}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}