import { useEffect, useRef } from "react"
import HeaderModal from "./headerModal"

interface WindowModalProps {
    id?: string,
    title?: string,
    max?: boolean,
    isOpen?: boolean,
    children?: any,
    headerBottom?: any,
    onClose?: () => void,
    setIsOpen?: (boolean) => void,
}

export default function WindowModal(props: WindowModalProps) {
    let holderClass = "print:min-h-full justify-center items-center flex overflow-x-hidden overflow-y-hidden fixed inset-0 z-20 outline-none focus:outline-none"
    let panelClass = "bg-slate-50 dark:bg-slate-800 rounded print:min-h-full"

    const handleWindowResize = () => {
        let painel: HTMLInputElement = document.querySelector("#" + "modal-painel-" + props.id)
        let header: HTMLInputElement = document.querySelector("#" + "modal-header-" + props.id)
        let content: HTMLInputElement = document.querySelector("#" + "modal-content-" + props.id)
        if (painel && header && content) {
            painel.style.width = (window.innerWidth * 0.9) + "px"
            painel.style.height = (window.innerHeight * 0.9) + "px"
            content.style.height = (painel.offsetHeight - header.offsetHeight - 10) + "px"
        }
    }

    let painel: HTMLInputElement = document.querySelector("#" + "modal-painel-" + props.id)
    if (props.isOpen) {
        document.body.style.overflowY = "hidden"
    } else if (painel !== null) {
        document.body.style.overflowY = "scroll"
    }

    useEffect(() => {
        if (props.isOpen && props.max) {
            let painel: HTMLInputElement = document.querySelector("#" + "modal-painel-" + props.id)
            handleWindowResize()
            window.addEventListener("resize", handleWindowResize)
        }
    })

    return (
        <>
            {props.isOpen && (
                <>
                    <div className="opacity-25 fixed inset-0 z-10 bg-gray-900 print:hidden"></div>
                    <div className={holderClass} >
                        <div id={"modal-painel-" + props.id} className={panelClass}>
                            {/*header*/}
                            <div id={"modal-header-" + props.id} className="bg-gray-200 rounded-t border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                                <HeaderModal
                                    title={props.title}
                                    onClose={() => {
                                        props.setIsOpen(false)
                                    }} />
                                <div>
                                    {props.headerBottom}
                                </div>
                            </div>
                            {/*body*/}
                            <div id={"modal-content-" + props.id} className="rounded-b p-4 overflow-x-hidden overflow-y-auto break-after-all print:p-0 print:min-h-full print:overflow-y-hidden">
                                {props.children}
                            </div>
                            {/*footer
                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => props.setIsOpen(false)}
                                >
                                    Close
                                </button>
                                <button
                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => props.setIsOpen(false)}
                                >
                                Save Changes
                                </button>
                                </div>
                            */}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
