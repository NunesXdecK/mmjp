export type unit = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"
interface FormRowProps {
    maxUnit?: unit,
    children?: any,
    className?: any,
}

export default function FormRow(props: FormRowProps) {
    let className = ""
    if (props.maxUnit) {
        className = "grid grid-cols-" + props.maxUnit + " items-end "
    } else {
        className = "grid grid-cols-6 items-end "
    }
    if (props.className) {
        className = className + props.className
    }
    return (
        <div className={className}>
            {props.children}
        </div>
    )
}
