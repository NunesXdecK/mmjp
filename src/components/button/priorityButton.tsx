import Button from "./button"
import DropDownButton from "./dropDownButton"
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid"

interface priorityButtonProps {
    id?: string,
    title?: string,
    priority?: number,
    isLeft?: boolean,
    isHidden?: boolean,
    isLoading?: boolean,
    isNotFloat?: boolean,
    isDisabled?: boolean,
    list?: any[],
}

export default function PriorityButton(props: priorityButtonProps) {
    const iconClassName = "block h-4 w-4"

    const handleOnClick = () => {
        console.log("chamou")
        let first = 0
        let next = 0
        let back = 0
        let last = 0
        props.list?.map((element, index) => {
            if (element && "priority" in element) {
                const priority = element?.priority
                console.log(priority)
                if (priority < first) {
                    first = priority
                }
                if (priority < props.priority) {
                    next = priority
                }
                if (priority > props.priority) {
                    back = priority
                }
                if (priority > last) {
                    first = priority
                }
            }
        })
        console.log(first, next, back, last)
    }

    return (
        <DropDownButton
            title={props.title}
            isLeft={props.isLeft}
            isHidden={props.isHidden}
            isLoading={props.isLoading}
            isNotFloat={props.isNotFloat}
            isDisabled={props.isDisabled}
            id={props.id + "priority-button"}
        >
            <div className="p-2 flex flex-row gap-2 rounded bg-slate-50 dark:bg-slate-800">
                <Button
                    onClick={() => handleOnClick()}
                    id={props.id + "priority-button-first"}
                >
                    <ChevronDoubleUpIcon className={iconClassName} aria-hidden="true" />
                </Button>
                <Button
                    onClick={() => handleOnClick()}
                    id={props.id + "priority-button-next"}
                >
                    <ChevronUpIcon className={iconClassName} aria-hidden="true" />
                </Button>
                <Button
                    onClick={() => handleOnClick()}
                    id={props.id + "priority-button-back"}
                >
                    <ChevronDownIcon className={iconClassName} aria-hidden="true" />
                </Button>
                <Button
                    onClick={() => handleOnClick()}
                    id={props.id + "priority-button-last"}
                >
                    <ChevronDoubleDownIcon className={iconClassName} aria-hidden="true" />
                </Button>
            </div>
        </DropDownButton>
    )
}
