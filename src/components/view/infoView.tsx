interface InfoViewProps {
    id?: string,
    info?: string,
    title?: string,
    classNameInfo?: string,
    classNameTitle?: string,
    classNameHolder?: string,
}

export default function InfoView(props: InfoViewProps) {

    let classNameTitle = "font-semibold"
    let classNameInfo = ""
    let classNameHolder = ""

    if (props.classNameHolder) {
        classNameHolder = classNameHolder + " " + props.classNameHolder
    }
    if (props.classNameTitle) {
        classNameTitle = classNameTitle + " " + props.classNameTitle
    }

    if (props.classNameInfo) {
        classNameInfo = classNameInfo + " " + props.classNameInfo
    }
    return (
        <>
            {props.info?.length > 0 && (
                <div className={classNameHolder}>
                    <span className={classNameInfo}>
                        {props.title?.length > 0 && (<span className={classNameTitle}>{props.title}: </span>)}
                        {props.info}
                    </span>
                </div>
            )}
        </>
    )
}
