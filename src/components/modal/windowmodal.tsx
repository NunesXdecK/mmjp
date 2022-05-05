import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";

export default function WindowModal(props) {
    let cancelButtonRef = useRef(null)

    return (
        <Transition.Root show={props.isOpen} as={Fragment}>
            <Dialog
                className="relative z-10"
                initialFocus={cancelButtonRef}
                open={props.isOpen}
                onClose={() => { }}>

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

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                                bg-white rounded-lg text-left 
                                overflow-hidden shadow-xl 
                                transform transition-all 
                                sm:my-8 sm:align-middle sm:max-w-lg sm:w-full
                                p-4
                                `}>
                                <div className="flex w-full justify-end p-4">
                                    <span
                                        onClick={() => props.setIsOpen(false)}>
                                        X
                                    </span>
                                </div>
                                <div>
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