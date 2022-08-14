interface InfoHolderViewProps {
    title?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideBorder?: boolean,
    children?: any,
}

export default function InfoHolderView(props: InfoHolderViewProps) {

    let classNameHolder = "mt-6 px-4 pt-2 pb-4 w-full border-2 border-indigo-200 rounded-lg"
    let classNameTitle = "text-lg font-semibold absolute bg-indigo-50 px-2 -mt-6"
    let classNameContentHolder = "mt-6 flex flex-row flex-wrap place-items-center gap-4"

    if (props.hideBorder) {
        classNameHolder = " border-none " + classNameHolder
    }

    if (props.classNameHolder) {
        classNameHolder = props.classNameHolder + " " + classNameHolder
    }

    if (props.classNameTitle) {
        classNameTitle = props.classNameTitle + " " + classNameTitle
    }

    if (props.classNameContentHolder) {
        classNameContentHolder = props.classNameContentHolder + " " + classNameContentHolder
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
