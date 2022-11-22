import Form from "../form/form"
import { useState } from "react"
import Button from "../button/button"
import FormRow from "../form/formRow"
import ListTable from "../list/listTable"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { TrashIcon } from "@heroicons/react/solid"
import InputSelectImmobile from "../inputText/inputSelectImmobile"
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces"
import { handleMaskCurrency, handleMaskPerimeter } from "../inputText/inputText"

interface SelectImmobileFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    listTitle?: string,
    inputTitle?: string,
    placeholder?: string,
    formClassName?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    isDisabledExclude?: boolean,
    isSingle?: boolean,
    value?: Immobile[],
    excludeList?: Immobile[],
    onSet?: (any?) => void,
    onBlur?: (any?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectImmobileForm(props: SelectImmobileFormProps) {
    const [index, setIndex] = useState(-1)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [immobile, setImmobile] = useState<Immobile>(defaultImmobile)

    const handleOnSet = (value) => {
        if (props.onSet) {
            props.onSet(value)
        }
    }

    const handleRemoveImmobile = () => {
        if (props.isSingle) {
            handleOnSet([])
        } else {
            let localImmobiles = props.value
            if (localImmobiles.length > -1) {
                let index = localImmobiles.indexOf(immobile)
                localImmobiles.splice(index, 1)
                handleOnSet(localImmobiles)
            }
        }
        setImmobile(defaultImmobile)
    }

    const handleAdd = (value: Immobile) => {
        if (!props.excludeList?.includes(value)) {
            handleOnSet([...props.value, value])
        }
    }

    const handleFilterList = (list, string) => {
        let listItemsFiltered: Immobile[] = []
        if (list?.length > 0) {
            listItemsFiltered = list?.filter((element: Immobile, index) => {
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
                return element.name.toLowerCase().includes(string.toLowerCase())
            })
        }
        return listItemsFiltered
    }
    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="6">Nome</FormRowColumn>
            </FormRow>
        )
    }
    const handlePutRows = (element: Immobile, index: number) => {
        return (
            <FormRow>
                <FormRowColumn unit="6" className="flex flex-row justify-between items-center">
                    <div>
                        <li>
                            {element.name}
                            {element.land?.length > 0 ? ", " + element.land : ""}
                            {element.county?.length > 0 ? ", " + element.county : ""}
                            {element.area?.length > 0 ? ", " + handleMaskCurrency(element.area) : ""}
                            {element.perimeter?.length > 0 ? ", " + handleMaskPerimeter(element.perimeter) : ""}
                        </li>
                    </div>
                    <Button
                        ignoreClass
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabledExclude}
                        className="bg-red-600 hover:bg-red-800 disabled:opacity-70 rounded-full p-2"
                        onClick={() => {
                            setImmobile((old) => props.value[index])
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
                ignoreClass
                title={props.title}
                subtitle={props.subtitle}
            >
                <FormRow>
                    <FormRowColumn unit="6">
                        <InputSelectImmobile
                            notSet
                            onSet={handleAdd}
                            onBlur={props.onBlur}
                            title={props.inputTitle}
                            isLoading={props.isLoading}
                            onFilter={handleFilterList}
                            isDisabled={props.isDisabled}
                            placeholder={props.placeholder}
                            id={"select-immobile" + (props.id ? "-" + props.id : "")}
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
                <p className="text-center">Deseja realmente deletar {immobile.name}?</p>
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
                            handleRemoveImmobile()
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
