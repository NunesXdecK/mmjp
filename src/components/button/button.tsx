interface ButtonProps {
    children?: any,
    isDisabled?: boolean,
    type?: "button" | "submit" | "reset",
    onClick?: () => void,
}

export default function Button(props: ButtonProps) {
    return (
        <>
            <button
                disabled={props.isDisabled}
                type={props.type}
                onClick={props.onClick}
                className={`
                            justify-center py-2 px-4 
                            border border-transparent 
                            shadow-sm 
                            text-sm font-medium rounded-md text-white 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 
                            disabled:opacity-80
                            focus:border-indigo-500 focus:ring-indigo-500
                            bg-indigo-600 hover:bg-indigo-700 
                    `}>
                {props.children}
            </button>
        </>
    )
}
