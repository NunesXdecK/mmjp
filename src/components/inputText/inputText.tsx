export default function InputText(props) {
    return (
        <>
            <label htmlFor={props.id}
                className="block text-sm font-medium text-gray-700">
                {props.title}
            </label>

            <input
                disabled={props.isDisabled}
                type="text"
                onChange={props.onChange}
                name={props.title}
                id={props.id}
                className={`
                    p-2 mt-1 
                    focus:ring-indigo-500 focus:border-indigo-500 
                    block w-full 
                    shadow-sm sm:text-sm 
                    border-gray-300 rounded-md
                `}
            />
        </>
    )
}
