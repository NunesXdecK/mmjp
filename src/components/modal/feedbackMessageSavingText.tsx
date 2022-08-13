import { CheckIcon, XIcon } from "@heroicons/react/outline"
import ScrollDownTransition from "../animation/scrollDownTransition"

interface FeedbackMessageSaveTextProps {
    className?: string,
    isOpen?: boolean,
    isError?: boolean,
    isSuccess?: boolean,
    setIsOpen?: (boolean) => void,
}

export default function FeedbackMessageSaveText(props: FeedbackMessageSaveTextProps) {
    let className = `
                        z-20 
                        mt-2
                    `

    if (props.className) {
        className = className + " " + props.className
    }

    return (
        <div className={className}>
            {props.isOpen && (
                <div>
                    <p className="gap-1 text-sm flex flex-row self-center">
                        {props.isOpen && !props.isSuccess && !props.isError && (
                            <>
                                <svg className="animate-spin w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-indigo-600">Salvando informações...</span>
                            </>
                        )}
                        {props.isOpen && props.isSuccess && !props.isError && (
                            <>
                                <span className="text-green-600">Sucesso!</span>
                                <CheckIcon className="text-green-600 block w-4" aria-hidden="true" />
                            </>
                        )}
                        {props.isOpen && !props.isSuccess && props.isError && (
                            <>
                                <span className="text-red-600">Erro!</span>
                                <XIcon className="text-red-600 block w-4" aria-hidden="true" />
                            </>
                        )}
                    </p>
                </div>
            )}
        </div>
    )
}
