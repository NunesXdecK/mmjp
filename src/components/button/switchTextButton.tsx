import Button from "./button"

interface SwitchButtonProps {
    href?: string,
    className?: string,
    buttonClassName?: string,
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
    onChildren?: any,
    offChildren?: any,
    onClick?: (any) => void,
    trueValue?: (any?) => any,
    falseValue?: (any?) => any,
}

export default function SwitchTextButton(props: SwitchButtonProps) {
    return (
        <div className={props.className ?? "p-4"}>
            <Button
                isSwitch
                onClick={props.onClick}
                isDisabled={props.isDisabled}
                ignoreClass={props.buttonClassName?.length > 0}
                className={props.buttonClassName ?? "mr-2 sm:mt-auto w-full"}
            >
                {props.isSwitched ? (
                    <>
                        {props.offChildren ?? (<span>Ver menos...</span>)}
                    </>
                ) : (
                    <>
                        {props.onChildren ?? (<span>Ver mais...</span>)}
                    </>
                )}
            </Button>
        </div>
    )
}
