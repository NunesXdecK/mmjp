interface FormRowColumnProps {
    unit: string,
    className?: any,
    children?: any,
}
export default function FormRowColumn(props: FormRowColumnProps) {
    let className = `py-1 px-2 sm:mt-0 col-span-6 sm:col-span-${props.unit} `
    if (props.className) {
        className = className + props.className
    }
    return (
        <div className={className}>
            {props.children}
        </div>
    )
}
