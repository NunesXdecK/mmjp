interface InfoHolderViewProps {
    title?: string,
    children?: any,
}

export default function InfoHolderView(props: InfoHolderViewProps) {
    return (
        <>
            <div className="mt-6 px-4 pt-2 pb-4 border-2 border-indigo-200 rounded-lg">
                <span className="text-lg font-semibold absolute bg-indigo-50 px-2 -mt-6">{props.title}</span>
                <div className="mt-6 flex flex-row flex-wrap gap-4">
                    {props.children}
                </div>
            </div>
        </>
    )
}
