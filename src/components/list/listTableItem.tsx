import { EyeIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import ScrollDownTransition from "../animation/scrollDownTransition";
import Button from "../button/button";
import FormRow from "../form/formRow";

interface ListTableItemProps {
    index?: number,
    element?: boolean,
    isLast?: boolean,
    isActive?: boolean,
    isDisabled?: boolean,
    onRowClick?: () => void,
    onEditClick?: (any, number?) => void,
    onShowClick?: (any, number?) => void,
    onDeleteClick?: (any, number?) => void,
    onTableRow?: (any, number?) => any,
}

export default function ListTableItem(props: ListTableItemProps) {
    let className = "dark:text-slate-200 items-center px-4 py-2"
    if (props.isActive) {
        className = className + " bg-indigo-100 dark:bg-gray-600"
    }
    className = className + " border-b border-gray-200 dark:border-gray-700"
    if (!props.isLast) {
    }
    return (
        <div
            className={className}
            onClick={props.onRowClick}
        >
            {props.onTableRow(props.element, props.index - 1)}
            <ScrollDownTransition isOpen={props.isActive}>
                <div className="flex justify-end gap-2">
                    <Button
                        color="red"
                        className="max-w-min"
                        isDisabled={props.isDisabled}
                        onClick={() => { props.onDeleteClick(props.element) }}
                    >
                        <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                    </Button>
                    <Button
                        className="max-w-min"
                        isDisabled={props.isDisabled}
                        onClick={() => { props.onEditClick(props.element, props.index) }}
                    >
                        <PencilAltIcon className="text-white block h-5 w-5 " aria-hidden="true" />
                    </Button>
                    <Button
                        className="max-w-min"
                        isDisabled={props.isDisabled}
                        onClick={() => { props.onShowClick(props.element, props.index) }}
                    >
                        <EyeIcon className="text-white block h-5 w-5 " aria-hidden="true" />
                    </Button>
                </div>
            </ScrollDownTransition>
        </div>
    )
}
