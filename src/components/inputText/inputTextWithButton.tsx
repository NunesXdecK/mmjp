import { useState } from "react";

interface InputTextWithButtonProps {
    id?: string,
    title?: string,
    value?: string,
    index?: number,
    children?: any,
    disabled?: boolean,
    onClick?: (object, string, any) => void,
}

export default function InputTextWithButton(props: InputTextWithButtonProps) {
    const [text, setText] = useState(props.value ?? "")

    const handleTelephoneMask = (text: string) => {
        text = text.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "")
        let lastDigit = 0
        let maskedText = ""

        const mask = "(99) 99999-9999"
        let maskLength = mask.length
        let length = text.length

        if (length > 2) {
            for (let i = 1; i <= length; i++) {
                const textChar = text.substring(i, i - 1)
                for (let im = 1; im <= maskLength; im++) {
                    const maskChar = mask.substring(im, im - 1)
                    if (maskChar === "9" && im > lastDigit) {
                        maskedText = maskedText + textChar
                        lastDigit = im
                        break
                    } else if (maskedText.indexOf(maskChar) === -1) {
                        maskedText = maskedText + maskChar
                    }
                }
            }
        } else {
            maskedText = text
        }
        return maskedText
    }

    return (
        <form onSubmit={(event) => {
            props.onClick(event, text, setText)
        }}>
            <div className="grid grid-cols-6">
                <div className="p-2 col-span-6">
                    {props.title && (
                        <label
                            htmlFor={props.id}
                            className="block text-sm font-medium text-gray-700">
                            {props.title}
                        </label>
                    )}

                    <div className="mt-1 flex rounded-md shadow-sm">

                        <input
                            id={props.id}
                            disabled={props.disabled}
                            value={text}
                            onChange={(event) => {
                                let value = event.target.value
                                value = handleTelephoneMask(value)
                                setText(value)
                            }}
                            type="text"
                            className={`
                                z-0
                                flex-1 block w-full 
                                rounded-none rounded-l-md sm:text-sm border-gray-300
                                focus:ring-indigo-500 focus:border-indigo-500 
                            `}
                        />

                        <button
                            type="submit"
                            className={`
                                px-4
                                rounded-r-md 
                                border border-l-0 border-gray-300
                                inline-flex items-center 
                                bg-gray-50 
                                text-gray-500 text-sm
                            `}>
                            {props.children}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
