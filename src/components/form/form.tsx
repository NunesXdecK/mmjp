interface FormProps {
    title?: string,
    subtitle?: string,
    className?: string,
    children?: any,
}

export default function Form(props: FormProps) {

    let className = "p-4"
    let classNameHolder = "px-2 py-4 sm:p-4 rounded-lg shadow print:shadow-none"
    let classNameContent = ""

    if (props.className) {
        className = props.className
    }

    if (false && props.title) {
        classNameHolder = classNameHolder + " md:grid md:grid-cols-4 md:gap-6"
        classNameContent = classNameContent + " md:col-span-3"
    }

    return (
        <div className={className}>
            <div className={classNameHolder}>
                {props.title && (
                    <div className="md:cols-span-1">
                        <div className="pb-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">{props.title}</h3>
                            <p className="mt-1 text-sm text-gray-600">{props.subtitle}</p>
                        </div>
                    </div>
                )}

                <div className={classNameContent}>
                    <div className="overflow-hidden">
                        <div className="bg-slate-50">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
