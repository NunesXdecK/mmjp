import { XIcon } from "@heroicons/react/outline";

export default function HeaderModal(props) {
    return (
        <div className="flex w-full justify-end p-4">
            <button
                onClick={() => props.setIsOpen(false)}>
                <XIcon className="block h-6 w-6" aria-hidden="true" />
            </button>
        </div>
    )
}