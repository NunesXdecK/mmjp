import { useState } from "react";

export default function InputTextWithButton(props) {
    const [text, setText] = useState(props.value ?? "")

    return (
        <div className="grid grid-cols-6">
            <div className="p-2 col-span-6">
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                        disabled={props.disabled}
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        type="text"
                        className={`
                            z-0
                            flex-1 block w-full 
                            rounded-none rounded-l-md sm:text-sm border-gray-300
                            focus:ring-indigo-500 focus:border-indigo-500 
                        `}
                    />

                    <button
                        type="button"
                        onClick={() => {
                            props.onClick(text, setText)
                        }}
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
    )
}
