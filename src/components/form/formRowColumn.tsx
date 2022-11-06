import { unit } from "./formRow";

interface FormRowColumnProps {
    unit: unit,
    unitM?: unit,
    children?: any,
    className?: any,
}
export default function FormRowColumn(props: FormRowColumnProps) {
    let colSpanClassName = ""
    if (props.unit) {
        colSpanClassName = "sm:col-span-" + props.unit + " print:col-span-" + props.unit
    } else {
        colSpanClassName = "sm:col-span-6 print:col-span-6"
    }
    if (props.unitM) {
        colSpanClassName = colSpanClassName + " col-span-" + props.unitM
    } else {
        colSpanClassName = colSpanClassName + " col-span-6"
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
