import { XIcon } from "@heroicons/react/outline";
interface HeaderModalProps {
    title?: string,
    onClose?: (boolean) => void,
}

export default function HeaderModal(props: HeaderModalProps) {
    return (
        <div className="p-4 flex flex-row items-center justify-between print:hidden">
            <div className="text-xl pl-4">
                {props.title}
            </div>
            <button
                className="p-2 rounded-full bg-slate-50"
                type="button"
                onClick={() => props.onClose(false)}>
                <XIcon className="block h-6 w-6" aria-hidden="true" />
            </button>
        </div>
    )
}