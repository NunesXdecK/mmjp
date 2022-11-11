import Button from "./button"
import DropDownButton from "./dropDownButton"

interface SwiftInfoButtonProps {
    id?: string,
    value?: string,
    values?: string[],
    children?: any,
    isHidden?: boolean,
    isLoading?: boolean,
    isNotFloat?: boolean,
    isDisabled?: boolean,
    onClick?: (string) => void,
}

export default function SwiftInfoButton(props: SwiftInfoButtonProps) {
    const handleClassName = (value) => {
        let className = "rounded py-1 px-2 text-xs font-bold"
        const classNameError = " text-red-600 bg-red-300 hover:opacity-90"
        const classNameNeutral = " text-slate-600 bg-slate-300 hover:opacity-90"
        const classNameSuccess = " text-green-600 bg-green-300 hover:opacity-90"
        switch (value) {
            case "APROVADO":
                className = className + classNameSuccess
                break
            case "ARQUIVADO":
                className = className + classNameSuccess
                break
            case "ATRASADO":
                className = className + classNameError
                break
            case "EM ANDAMENTO":
                className = className + classNameNeutral
                break
            case "EM ABERTO":
                className = className + classNameNeutral
                break
            case "NEGOCIANDO":
                className = className + classNameNeutral
                break
            case "ORÇAMENTO":
                className = className + classNameNeutral
                break
            case "PAGO":
                className = className + classNameSuccess
                break
            case "PARADO":
                className = className + classNameNeutral
                break
            case "PENDENTE":
                className = className + classNameError
                break
            case "FINALIZADO":
                className = className + classNameSuccess
                break
            case "REJEITADO":
                className = className + classNameError
                break
            case "VENCIDO":
                className = className + classNameError
                break

        }
        return className
    }

    return (
        <DropDownButton
            title={props.value}
            isHidden={props.isHidden}
            isLoading={props.isLoading}
            isDisabled={props.isDisabled}
            id={props.id + "switch-button"}
            className={handleClassName(props.value)}
        >
            <div className="p-2 rounded bg-slate-50 dark:bg-slate-700 flex flex-col gap-2 items-center">
                {props.values?.map((element, index) => (
                    <Button
                        ignoreClass
                        isHidden={props.isHidden || props.value === element}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        className={"w-full " + handleClassName(element)}
                        id={index + "-" + props.id + "switch-button-option"}
                        key={props.id + "-" + index + "-switch-info-button-key"}
                        onClick={() => {
                            if (props.onClick) {
                                props.onClick(element)
                            }
                        }}
                    >
                        {element}
                    </Button>
                ))}
            </div>
        </DropDownButton>
    )
}
