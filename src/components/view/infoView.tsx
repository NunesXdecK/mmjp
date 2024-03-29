import { Children } from "react"

interface InfoViewProps {
    id?: string,
    title?: string,
    classNameInfo?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    children?: any,
}

export default function InfoView(props: InfoViewProps) {

    let classNameTitle = "text-sm font-medium text-gray-500 dark:text-gray-100"
    let classNameInfo = "mt-1 text-sm text-gray-900 dark:text-gray-200 sm:col-span-2 sm:mt-0 print:col-span-2 print:mt-0"
    let classNameHolder = "bg-slate-50 dark:bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 print:grid print:grid-cols-3 print:gap-4 print:px-6"

    if (props.classNameHolder) {
        classNameHolder = classNameHolder + " " + props.classNameHolder
    }
    if (props.classNameTitle) {
        classNameTitle = classNameTitle + " " + props.classNameTitle
    }

    if (props.classNameInfo) {
        classNameInfo = classNameInfo + " " + props.classNameInfo
    }

    if (props.children?.length === 0) {
        classNameHolder = "hidden"
    }
    return (
        <div className={classNameHolder}>
            <dt className={classNameTitle}>{props.title}</dt>
            <dd className={classNameInfo}>{props.children}</dd>
        </div>
    )
}
