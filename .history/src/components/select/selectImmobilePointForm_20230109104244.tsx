import Form from "../form/form"
import { useState } from "react"
import Button from "../button/button"
import FormRow from "../form/formRow"
import ListTable from "../list/listTable"
import { NavBarPath } from "../bar/navBar"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { TrashIcon } from "@heroicons/react/solid"
import InputSelectImmobilePoint from "../inputText/inputSelectImmobilePoint"
import { defaultPerson, ImmobilePoint } from "../../interfaces/objectInterfaces"
import InputCVSFile from "../inputText/inputCSVFile"

interface SelectImmobilePointFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    listTitle?: string,
    inputTitle?: string,
    placeholder?: string,
    formClassName?: string,
    immobileId?: number,
    isFull?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isDisabledExclude?: boolean,
    isSingle?: boolean,
    value?: ImmobilePoint[],
    prevPath?: NavBarPath[] | any,
    excludeList?: ImmobilePoint[],
    onSet?: (any?) => void,
    onBlur?: (any?) => void,
    onSetIsLoading?: (boolean) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectImmobilePointForm(props: SelectImmobilePointFormProps) {
    const [index, setIndex] = useState(-1)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [element, setElement] = useState<ImmobilePoint>(defaultPerson)

    const handleOnSet = (value) => {
        if (props.onSet) {
            props.onSet(value)
        }
    }

    const handleRemove = () => {
        fetch("api/immobilePoint", {
            method: "DELETE",
            body: JSON.stringify({
                token: "tokenbemseguro",
                pointId: element?.id ?? 0,
                immobileId: props?.immobileId ?? 0,
            }),
        })
        if (props.isSingle) {
            handleOnSet([])
        } else {
            let localPersons = props.value
            if (localPersons.length > -1) {
                let index = localPersons.indexOf(element)
                localPersons.splice(index, 1)
                handleOnSet(localPersons)
            }
        }
        setElement(defaultPerson)
    }

    const handleAdd = (value: ImmobilePoint) => {
        if (!props.excludeList?.includes(value)) {
            if (props.immobileId && props.immobileId > 0) {
                fetch("api/immobilePoint", {
                    method: "POST",
                    body: JSON.stringify({
                        token: "tokenbemseguro",
                        data: {
                            pointId: value?.id ?? 0,
                            immobileId: props?.immobileId,
                        },
                    }),
                })
            }
            handleOnSet([...props.value, value])
        }
    }

    const handleFilterList = (list, string) => {
        let listItemsFiltered: ImmobilePoint[] = []
        if (list?.length > 0) {
            listItemsFiltered = list?.filter((element: ImmobilePoint, index) => {
                if (props.excludeList?.length > 0) {
                    let canAdd = false
                    props.excludeList.map((elementExcluded, index) => {
                        if (elementExcluded?.id === element?.id) {
                            canAdd = true
                        }
                    })
                    if (canAdd) {
                        return false
                    }
                }
                return element.pointId.toLowerCase().includes(string.toLowerCase())
            })
        }
        return listItemsFiltered
    }
    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="6">Ponto</FormRowColumn>
            </FormRow>
        )
    }
    const handlePutRows = (element: ImmobilePoint, index: number) => {
        return (
            <FormRow>
                <FormRowColumn unit="6" className="flex flex-row justify-between items-center">
                    <div>
                        {element.pointId}
                        {(element.epoch?.length > 0 ? ", " + element.epoch : "")}
                        {(element.eastingX?.length > 0 ? ", " + element.eastingX : "")}
                        {(element.northingY?.length > 0 ? ", " + element.northingY : "")}
                        {(element.elipseHeightZ?.length > 0 ? ", " + element.elipseHeightZ : "")}

                    </div>
                    <Button
                        ignoreClass
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabledExclude}
                        className="bg-red-600 hover:bg-red-800 disabled:opacity-70 rounded-full p-2"
                        onClick={() => {
                            setElement((old) => props.value[index])
                            setIsOpenDelete(true)
                        }}
                    >
                        <TrashIcon className="text-white block h-4 w-4" aria-hidden="true" />
                    </Button>
                </FormRowColumn>
            </FormRow>
        )
    }
    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}
                titleRight={(
                    <InputCVSFile />
                )}
            >
                <FormRow>
                    <FormRowColumn unit="6">
                        <InputSelectImmobilePoint
                            notSet
                            onSet={handleAdd}
                            onBlur={props.onBlur}
                            title={props.inputTitle}
                            prevPath={props.prevPath}
                            isLoading={props.isLoading}
                            onFilter={handleFilterList}
                            isDisabled={props.isDisabled}
                            placeholder={props.placeholder}
                            onShowMessage={props.onShowMessage}
                            onSetLoading={props.onSetIsLoading}
                            id={"select-point" + (props.id ? "-" + props.id : "")}
                        />
                    </FormRowColumn>
                </FormRow>
                {props.value?.length > 0 && (
                    <ListTable
                        hideSearch
                        className="p-2"
                        list={props.value}
                        title={props.listTitle}
                        onSetIsActive={setIndex}
                        onTableRow={handlePutRows}
                        isLoading={props.isLoading}
                        onTableHeader={handlePutHeaders}
                    />
                )}
            </Form>
            <WindowModal
                isOpen={isOpenDelete}
                setIsOpen={setIsOpenDelete}>
                <p className="text-center">Deseja realmente deletar {element.pointId}?</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={(event) => {
                            event.preventDefault()
                            setIsOpenDelete(false)
                        }}
                    >
                        Voltar
                    </Button>
                    <Button
                        color="red"
                        type="submit"
                        onClick={(event) => {
                            event.preventDefault()
                            handleRemove()
                            setIsOpenDelete(false)
                        }}
                    >
                        Excluir
                    </Button>
                </div>
            </WindowModal>
        </>
    )
}
