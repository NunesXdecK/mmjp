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
        colSpanClassName =
            " md:col-span-" + props.unit +
            " lg:col-span-" + props.unit +
            " xl:col-span-" + props.unit +
            " 2xl:col-span-" + props.unit +
            " print:col-span-" + props.unit
    } else {
        colSpanClassName =
            " md:col-span-6" +
            " lg:col-span-6" +
            " xl:col-span-6" +
            " 2xl:col-span-6" +
            " print:col-span-6"
    }
    if (props.unitM) {
        colSpanClassNameMobile = " sm:col-span-" + props.unitM
    }
    let className = "p-2" + colSpanClassName + colSpanClassNameMobile
    if (props.className) {
        className = className + " " + props.className
    }
    return (
        <div className={className}>
            {props.children}
        </div>
    )
}
