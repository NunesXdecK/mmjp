interface FormProps {
    title?: string,
    subtitle?: string,
    className?: string,
    titleRight?: any,
    children?: any,
}

export default function Form(props: FormProps) {

    let className = "p-4"
    let classNameHolder = "px-2 py-4 sm:p-4 rounded-lg shadow dark:shadow-none print:shadow-none print:px-0 print:py-0"
    let classNameContent = ""

    if (props.className) {
        className = props.className
    }

    if (false && props.title) {
        classNameHolder = classNameHolder + " md:grid md:grid-cols-4 md:gap-6"
        classNameContent = classNameContent + " md:col-span-3"
    }

    return (
        <div className="rounded shadow dark:shadow-none dark:border dark:border-gray-700 p-4 mt-4">
            <div className="flex flex-row justify-between items-center p-2">
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">{props.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{props.subtitle}</p>
                </div>
                {props.titleRight}
            </div>
            {props.children}
        </div>
    )
}
