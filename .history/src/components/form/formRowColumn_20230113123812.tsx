import { unit } from "./formRow";

interface FormRowColumnProps {
    unit: unit,
    unitM?: unit,
    children?: any,
    className?: any,
}
export default function FormRowColumn(props: FormRowColumnProps) {
    let colSpanClassName = ""
    let colSpanClassNameMobile = ""
    if (props.unit) {
        colSpanClassName = "lg:col-span-" + props.unit + " md:col-span-" + props.unit + " sm:col-span-" + props.unit + " print:col-span-" + props.unit
        colSpanClassNameMobile = "col-span-" + props.unit
    } else {
        colSpanClassName = "lg:col-span-6 md:col-span-6 sm:col-span-6 print:col-span-6"
        colSpanClassNameMobile = "col-span-6"
    }
    if (props.unitM) {
        colSpanClassNameMobile = "col-span-" + props.unitM
    }
    let className = "p-2 " + colSpanClassNameMobile + " " + colSpanClassName
    if (props.className) {
        className = className + " " + props.className
    }
    return (
        <div className={className}>
            {props.children}
        </div>
    )
}
