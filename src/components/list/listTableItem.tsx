import { EyeIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import ScrollDownTransition from "../animation/scrollDownTransition";
import Button from "../button/button";
import FormRow from "../form/formRow";

interface ListTableItemProps {
    index?: number,
    element?: boolean,
    isActive?: boolean,
    isDisabled?: boolean,
    onRowClick?: () => void,
    onEditClick?: (any, number?) => void,
    onShowClick?: (any, number?) => void,
    onDeleteClick?: (any,number?) => void,
    onTableRow?: (any) => any,
}

export default function ListTableItem(props: ListTableItemProps) {
    let className = "border-b items-center mb-2 px-4 py-2"
    if (props.isActive) {
        className = className + " bg-indigo-100"
    }
    return (
        <div
            className={className}
            onClick={props.onRowClick}
        >
            <FormRow
            >
                {props.onTableRow(props.element)}
            </FormRow>
            <ScrollDownTransition isOpen={props.isActive}>
                <div className="pt-2 flex justify-end gap-2">
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
