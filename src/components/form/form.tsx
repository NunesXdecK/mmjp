interface FormProps {
    title?: string,
    subtitle?: string,
    children?: any,
}

export default function Form(props: FormProps) {

    let classNameHolder = "rounded-lg p-4"
    let classNameContent = "py-2"

    if (props.title) {
        classNameHolder = classNameHolder + " md:grid md:grid-cols-3 md:gap-6"
        classNameContent = classNameContent + " md:col-span-2"
    }

    return (
        <div className={classNameHolder}>
            {props.title && (
                <div className="py-2 md:cols-span-1">
                    <div className="md:px-4 px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">{props.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{props.subtitle}</p>
                    </div>
                </div>
            )}

            <div className={classNameContent}>
                <div className="shadow overflow-hidden md:py-0">
                    <div className="bg-white pb-2">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}
