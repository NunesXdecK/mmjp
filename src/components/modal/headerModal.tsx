import { XIcon } from "@heroicons/react/outline";

export default function HeaderModal(props) {
    return (
        <div className="left-6 sm:left-8 sm:top-8 top-4 fixed print:hidden">
            <button
                className="p-2 rounded-full bg-slate-50"
                type="button"
                onClick={() => props.onClose(false)}>
                <XIcon className="block h-6 w-6" aria-hidden="true" />
            </button>
        </div>
    )
}