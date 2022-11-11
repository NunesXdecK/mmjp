import Form from "../form/form"
import { useState } from "react"
import Button from "../button/button"
import SelectImmobileFormNew from "./selectImmobileFormNew"
import { Immobile } from "../../interfaces/objectInterfaces"

interface SelectImmobileTOFormNewProps {
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
    onBlur?: (any?) => void,
    onSetTarget?: (any?) => void,
    onSetOrigin?: (any?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectImmobileTOFormNew(props: SelectImmobileTOFormNewProps) {
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
                <div className="flex flex-row items-center justify-end gap-2">
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
                                handleOnSetTarget([props.valueTarget[0]])
                                handleOnSetOrigin([])
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
                                handleOnSetTarget([])
                                handleOnSetOrigin([])
                            }}
                        >
                            União
                        </Button>
                    )}
                </div>
            )}
        >
            <SelectImmobileFormNew
                listTitle="Imóveis"
                onSet={props.onSetTarget}
                value={props.valueTarget}
                placeholder="Pesquise o imóvel..."
                isDisabledExclude={props.isDisabled}
                excludeList={[...props.valueTarget, ...props.valueOrigin]}
                id={"immobile-target-service-" + props.index + "-" + props.id}
                title={(isUnion ? "Imóveis unificados" : "")
                    + (isDismemberment ? "Imóvel desmembrado" : "")}
                subtitle={(isUnion ? "Selecione mais de um imóvel" : "")
                    + (isDismemberment ? "Selecione apenas um imóvel" : "")}
                isDisabled={
                    props.isDisabled ||
                    (isDismemberment && props.valueTarget?.length > 0)
                }
            />
            {(isUnion || isDismemberment) && (
                <SelectImmobileFormNew
                    listTitle="Imóveis"
                    onSet={props.onSetOrigin}
                    value={props.valueOrigin}
                    placeholder="Pesquise o imóvel..."
                    isDisabledExclude={props.isDisabled}
                    excludeList={[...props.valueTarget, ...props.valueOrigin]}
                    id={"immobile-origin-service-" + props.index + "-" + props.id}
                    title={(isUnion ? "Imóvel final" : "")
                        + (isDismemberment ? "Imóveis finais" : "")}
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
