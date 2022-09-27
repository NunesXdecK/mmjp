interface FormRowColumnProps {
    unit: "1" | "2" | "3" | "4" | "5" | "6" | "1/1",
    children?: any,
    className?: any,
}
export default function FormRowColumn(props: FormRowColumnProps) {
    let colSpanClassName = ""
    switch (props.unit) {
        case "1/1":
            colSpanClassName = "col-span-3 sm:col-span-1"
            break;
        case "1":
            colSpanClassName = "col-span-6 sm:col-span-1"
            break;
        case "2":
            colSpanClassName = "col-span-6 sm:col-span-2"
            break
        case "3":
            colSpanClassName = "col-span-3 sm:col-span-3"
            break
        case "4":
            colSpanClassName = "col-span-6 sm:col-span-4"
            break
        case "5":
            colSpanClassName = "col-span-6 sm:col-span-5"
            break
        case "6":
            colSpanClassName = "col-span-6 sm:col-span-6"
            break
    }

    let className = "p-2 " + colSpanClassName
    if (props.className) {
        className = className + " " + props.className
    }
    return (
        <div className={className}>
            {props.children}
        </div>
    )
}
