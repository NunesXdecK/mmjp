interface FormRowProps {
    className?: any,
    children?: any,
}

export default function FormRow(props: FormRowProps) {
    let className = "grid grid-cols-6 "
    if (props.className) {
        className = className + props.className
    }
    
    return (
        <div className={className}>
            {props.children}
        </div>
    )
}
