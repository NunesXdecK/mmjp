interface FormRowProps {
    className?: any,
    children?: any,
}

export default function FormRow(props: FormRowProps) {
    let className = "grid grid-cols-6 sm:gap-6 md:pt-2 "
    if (props.className) {
        className = className + props.className
    }
    
    return (
        <div className={className}>
            {props.children}
        </div>
    )
}
