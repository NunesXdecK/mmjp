interface FormRowColumnProps {
    unit: string,
    className?: any,
    children?: any,
}
export default function FormRowColumn(props: FormRowColumnProps) {
    let colSpanClassName = ""
    switch (props.unit) {
        case "1":
            colSpanClassName = "sm:col-span-1"
            break;
        case "2":
            colSpanClassName = "sm:col-span-2"
            break
        case "3":
            colSpanClassName = "sm:col-span-3"
            break
        case "4":
            colSpanClassName = "sm:col-span-4"
            break
        case "6":
            colSpanClassName = "sm:col-span-6"
            break
    }

    let className = "p-2 col-span-6 " + colSpanClassName
    if (props.className) {
        className = className + " " + props.className
    }
    return (
        <div className={className}>
            {props.children}
        </div>
    )
}
