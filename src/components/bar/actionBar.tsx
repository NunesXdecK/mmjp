interface ActionBarProps {
    className?: string,
    children?: any,
}

export default function ActionBar(props: ActionBarProps) {
    let className = "mb-4 rounded border dark:border-gray-700 dark:shadow-none shadow p-4 flex gap-2 print:hidden"
    if (props.className) {
        className = className + " " + props.className
    }
    return (
        <div className={className}>
            {props.children}
        </div>
    )
}