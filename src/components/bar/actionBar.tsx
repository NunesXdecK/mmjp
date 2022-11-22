interface ActionBarProps {
    className?: string,
    isHidden?: boolean,
    children?: any,
}

export default function ActionBar(props: ActionBarProps) {
    let className = "mb-4 rounded border dark:border-gray-700 dark:shadow-none shadow p-4 flex gap-2 print:hidden"
    if (props.className) {
        className = className + " " + props.className
    }
    if (props.isHidden) {
        className = "hidden"
    }
    return (
        <div className={className}>
            {props.children}
        </div>
    )
}