interface InfoHolderViewProps {
    title?: string,
    subtitle?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideBorder?: boolean,
    hidePaddingMargin?: boolean,
    children?: any,
}

export default function InfoHolderView(props: InfoHolderViewProps) {
    let classNameHolder = "w-full bg-slate-50 dark:bg-slate-800 shadow dark:shadow-none sm:rounded-lg mb-2"
    let classNameTitle = "text-lg font-medium leading-6 text-gray-900 dark:text-gray-200 bg-transparent "
    let classNameSubtitle = "mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300 bg-transparent "
    let classNameContentHolder = "border-t border-gray-200 dark:border-gray-700 p-2"

    if (props.hideBorder) {
        classNameHolder = classNameHolder + " border-none"
        classNameContentHolder = classNameContentHolder + " border-none"
    }

    if (!props.hidePaddingMargin) {
        classNameHolder = " " + classNameHolder
        classNameTitle = " " + classNameTitle
        classNameContentHolder = " " + classNameContentHolder
    }

    if (props.classNameHolder) {
        classNameHolder = classNameHolder + " " + props.classNameHolder
    }

    if (props.classNameTitle) {
        classNameTitle = classNameTitle + " " + props.classNameTitle
    }

    if (props.classNameContentHolder) {
        classNameContentHolder = classNameContentHolder + " " + props.classNameContentHolder
    }

    return (
        <div className={classNameHolder}>
            <div className="rounded-t bg-gray-200 dark:bg-gray-800 px-4 py-5 sm:px-6">
                {props.title && (<p className={classNameTitle}>{props.title}</p>)}
                {props.subtitle && (<p className={classNameSubtitle}>{props.subtitle}</p>)}
            </div>
            <div className={classNameContentHolder}>
                <dl>
                    {props.children}
                </dl>
            </div>
        </div>
    )
}
