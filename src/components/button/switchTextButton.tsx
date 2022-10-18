import Button from "./button"

interface SwitchButtonProps {
    href?: string,
    className?: string,
    color?: "red",
    type?: "button" | "submit" | "reset",
    newTab?: boolean,
    isLink?: boolean,
    isLight?: boolean,
    isHidden?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isSwitched?: boolean,
    children?: any,
    onClick?: (any) => void,
    trueValue?: (any?) => any,
    falseValue?: (any?) => any,
}

export default function SwitchTextButton(props: SwitchButtonProps) {
    return (
        <div className="p-4">
            <Button
                isSwitch
                className="mr-2 sm:mt-auto w-full"
                onClick={props.onClick}
            >
                {props.isSwitched ? (
                    <span>Ver menos...</span>
                ) : (
                    <span>Ver mais...</span>
                )}
            </Button>
        </div>
    )
}
