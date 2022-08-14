interface InfoViewProps {
    id?: string,
    title?: string,
    info?: string,
    classNameTitle?: string,
    classNameInfo?: string,
}

export default function InfoView(props: InfoViewProps) {

    let classNameTitle = "font-semibold"
    let classNameInfo = ""

    if (props.classNameTitle) {
        classNameTitle = classNameTitle + " " + props.classNameTitle
    }

    if (props.classNameInfo) {
        classNameInfo = classNameInfo + " " + props.classNameInfo
    }
    return (
        <>
            {props.info?.length > 0 && (
                <p className={classNameInfo}>
                    {props.title?.length > 0 && (<span className={classNameTitle}>{props.title}: </span>)}
                    {props.info}
                </p>
            )}
        </>
    )
}
