interface InfoHolderViewProps {
    title?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideBorder?: boolean,
    children?: any,
}

export default function InfoHolderView(props: InfoHolderViewProps) {

    let classNameHolder = "mt-6 px-4 pt-2 pb-4 border-2 border-indigo-200 rounded-lg"
    let classNameTitle = "text-lg font-semibold absolute bg-indigo-50 px-2 -mt-6"
    let classNameContentHolder = "mt-6 flex flex-row flex-wrap gap-4"

    if (props.hideBorder) {
        classNameHolder = classNameHolder + " border-none"
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
        <>
            <div className={classNameHolder}>
                {props.title && (<span className={classNameTitle}>{props.title}</span>)}
                <div className={classNameContentHolder}>
                    {props.children}
                </div>
            </div>
        </>
    )
}
