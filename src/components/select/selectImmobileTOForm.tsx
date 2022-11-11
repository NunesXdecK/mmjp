import Form from "../form/form"
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces"
import Button from "../button/button"
import { useState } from "react"
import { PlusIcon } from "@heroicons/react/outline"
import FormRow from "../form/formRow"
import FormRowColumn from "../form/formRowColumn"
import InputSelectImmobile from "../inputText/inputSelectImmobile"

interface SelectImmobileTOFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    formClassName?: string,
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

export default function SelectImmobileTOForm(props: SelectImmobileTOFormProps) {
    const [isUnion, setIsUnion] = useState(false)
    const [isDismemberment, setIsDismemberment] = useState(false)

    const handleOnSetTarget = (value, index?) => {
        if (props.onSetTarget) {
            if (index > -1) {
                props.onSetTarget([
                    ...props.valueTarget?.slice(0, index),
                    value,
                    ...props.valueTarget?.slice(index + 1, props.valueTarget?.length),
                ])
            } else {
                props.onSetTarget([...props.valueTarget, value])
            }
        }
    }

    const handleOnSetOrigin = (value, index?) => {
        if (props.onSetOrigin) {
            if (index && index > -1) {
                props.onSetOrigin([
                    ...props.valueOrigin?.slice(0, index),
                    value,
                    ...props.valueOrigin?.slice(index + 1, props.valueTarget?.length),
                ])
            } else {
                props.onSetOrigin(value)
            }
        }
    }

    const handleFilterList = (list, string) => {
        let listItemsFiltered: Immobile[] = []
        if (list?.length > 0) {
            listItemsFiltered = list?.filter((element: Immobile, index) => {
                let canAdd = false
                if (props.valueTarget?.length > 0) {
                    props.valueTarget?.map((elementExcluded, index) => {
                        if (elementExcluded?.id === element?.id) {
                            canAdd = true
                        }
                    })
                }
                if (props.valueOrigin?.length > 0) {
                    props.valueOrigin?.map((elementExcluded, index) => {
                        if (elementExcluded?.id === element?.id) {
                            canAdd = true
                        }
                    })
                }
                if (canAdd) {
                    return false
                }
                return element.name.toLowerCase().includes(string.toLowerCase())
            })
        }
        return listItemsFiltered
    }

    const handleShowTarget = () => {
        console.log(props.valueTarget)
        return (
            <>
                {props.valueTarget?.map((element, index) => (
                    <FormRow key={"input-target-" + index}>
                        <FormRowColumn unit="6">
                            <InputSelectImmobile
                                value={element.name}
                                isLoading={props.isLoading}
                                onFilter={handleFilterList}
                                isDisabled={props.isDisabled}
                                placeholder="Pesquise o imóvel..."
                                id={"select-immobile-target-" + index + (props.id ? "-" + props.id : "")}
                                onSet={(value) => {
                                    handleOnSetTarget(value, index)
                                }}
                            />
                        </FormRowColumn>
                    </FormRow>
                ))}
            </>
        )
    }

    const handleShowOrigin = () => {
        return (
            <>
                {props.valueOrigin?.map((element, index) => (
                    <FormRow key={"input-origin-" + index}>
                        <FormRowColumn unit="6">
                            <InputSelectImmobile
                                isLoading={props.isLoading}
                                onFilter={handleFilterList}
                                isDisabled={props.isDisabled}
                                placeholder="Pesquise o imóvel..."
                                id={"select-immobile-origin-" + index + (props.id ? "-" + props.id : "")}
                            />
                        </FormRowColumn>
                    </FormRow>
                ))}
            </>
        )
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
                            }}
                        >
                            União
                        </Button>
                    )}
                    {(!isUnion && !isDismemberment) && (
                        <Button
                            onClick={() => {
                                handleOnSetTarget({ ...defaultImmobile, id: "", name: "", })
                            }}
                        >
                            <PlusIcon className="block h-5 w-5" aria-hidden="true" />
                        </Button>
                    )}
                </div>
            )}
        >
            <div>{props.valueTarget.length}</div>
            {(!isUnion && !isDismemberment) && (
                <>
                    {handleShowTarget()}
                </>
            )}
            {(isUnion || isDismemberment) && (
                <>
                    <Form
                        ignoreClass
                        title={(isUnion ? "Imóveis unificados" : "") + (isDismemberment ? "Imóvel desmembrado" : "")}
                        titleRight={(
                            <div className="flex flex-row items-center justify-end gap-2">
                                <Button><PlusIcon className="block h-5 w-5" aria-hidden="true" /></Button>
                            </div>
                        )}
                    >
                        {handleShowTarget()}
                    </Form>
                    <Form
                        ignoreClass
                        title={(isUnion ? "Imóvel final" : "") + (isDismemberment ? "Imóveis finais" : "")}
                        titleRight={(
                            <div className="flex flex-row items-center justify-end gap-2">
                                <Button><PlusIcon className="block h-5 w-5" aria-hidden="true" /></Button>
                            </div>
                        )}
                    >
                        {handleShowOrigin()}
                    </Form>
                </>
            )}
        </Form>
    )
}
