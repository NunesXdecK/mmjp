interface FormProps {
    title?: string,
    subtitle?: string,
    children?: any,
}

export default function Form(props: FormProps) {
    return (
        <div className="py-4 md:grid md:grid-cols-3 md:gap-6">
            <div className="py-2 md:cols-span-1">
                <div className="md:px-4 px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{props.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{props.subtitle}</p>
                </div>
            </div>

            <div className="py-2 md:col-span-2">
                <div className="shadow overflow-hidden sm:rounded-md md:py-0">
                    <div className="bg-white pb-2">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}
