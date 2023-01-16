import Form from "../form/form"
import { useState } from "react"
import Button from "../button/button"
import SelectImmobileForm from "./selectImmobileForm"
import { Immobile } from "../../interfaces/objectInterfaces"
import { NavBarPath } from "../bar/navBar"

interface SelectImmobileTOFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    formClassName?: string,
    index?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    isSingle?: boolean,
    valueTarget?: Immobile[],
    valueOrigin?: Immobile[],
    prevPath?: NavBarPath[] | any,
    onBlur?: (any?) => void,
    onSetTarget?: (any?) => void,
    onSetOrigin?: (any?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectImmobileTOForm(props: SelectImmobileTOFormProps) {
    const [isUnion, setIsUnion] = useState(false)
    const [isDismemberment, setIsDismemberment] = useState(false)

    const handleOnSetTarget = (value, index?) => {
        if (props.onSetTarget) {
            props.onSetTarget(value)
        }
    }

    const handleOnSetOrigin = (value, index?) => {
        if (props.onSetOrigin) {
            props.onSetOrigin(value)
        }
    }

    return (
        <Form
            title={props.title}
            subtitle={props.subtitle}
            titleRight={(
                <div className="flex flex-row flex-wrap items-center justify-end gap-2">
                    {(isUnion || isDismemberment) && (
                        <Button
                            onClick={() => {
                                setIsUnion(false)
                                setIsDismemberment(false)
                                handleOnSetOrigin([])
                            }}
                        >
                            Normal
                        </Button>
                    )}
                    {!isDismemberment && (
                        <Button
                            onClick={() => {
                                setIsUnion(false)
                                setIsDismemberment(true)
                                handleOnSetTarget(props.valueTarget[0] ? [props.valueTarget[0]] : [])
                            }}
                        >
                            Desmembramento
                        </Button>
                    )}
                    {!isUnion && (
                        <Button
                            onClick={() => {
                                setIsUnion(true)
                                setIsDismemberment(false)
                                handleOnSetOrigin(props.valueOrigin[0] ? [props.valueOrigin[0]] : [])
                            }}
                        >
                            União
                        </Button>
                    )}
                </div>
            )}
        >
            <SelectImmobileForm
                onSet={props.onSetTarget}
                value={props.valueTarget}
                prevPath={props.prevPath}
                placeholder="Pesquise o imóvel..."
                isDisabledExclude={props.isDisabled}
                excludeList={[...props.valueTarget, ...props.valueOrigin]}
                id={"immobile-target-service-" + props.index + "-" + props.id}
                title={(isUnion ? "Unificados" : "")
                    + (isDismemberment ? "Desmembrado" : "")}
                subtitle={(isUnion ? "Selecione mais de um imóvel" : "")
                    + (isDismemberment ? "Selecione apenas um imóvel" : "")}
                isDisabled={
                    props.isDisabled ||
                    (isDismemberment && props.valueTarget?.length > 0)
                }
            />
            {(isUnion || isDismemberment) && (
                <SelectImmobileForm
                    onSet={props.onSetOrigin}
                    value={props.valueOrigin}
                    prevPath={props.prevPath}
                    placeholder="Pesquise o imóvel..."
                    isDisabledExclude={props.isDisabled}
                    excludeList={[...props.valueTarget, ...props.valueOrigin]}
                    id={"immobile-origin-service-" + props.index + "-" + props.id}
                    title={(isUnion ? "Final" : "")
                        + (isDismemberment ? "Finais" : "")}
                    subtitle={(isUnion ? "Selecione apenas um imóvel" : "")
                        + (isDismemberment ? "Selecione mais de um imóvel" : "")}
                    isDisabled={
                        props.isDisabled ||
                        (isUnion && props.valueOrigin?.length > 0)
                    }
                />
            )}
        </Form>
    )
}
