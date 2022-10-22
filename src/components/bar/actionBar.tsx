interface ActionBarProps {
    className?: string,
    children?: any,
}

export default function ActionBar(props: ActionBarProps) {
    return (
        <div className="mb-4">
            <div className="rounded border shadow p-4 flex gap-2">
                {props.children}
            </div>
        </div>
    )
}