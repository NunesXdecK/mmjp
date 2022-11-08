import { TrashIcon } from "@heroicons/react/solid"
import { useState } from "react"
import { Immobile } from "../../interfaces/objectInterfaces"
import Button from "../button/button"
import Form from "../form/form"
import FormRow from "../form/formRow"
import FormRowColumn from "../form/formRowColumn"
import InputSelectImmobile from "../inputText/inputSelectImmobile"
import ListTable from "../list/listTable"

interface SelectImmobileFormNewProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    formClassName?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    isMultiple?: boolean,
    value?: Immobile[],
    excludeList?: Immobile[],
    onSetImmobiles?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onSet?: (any?) => void,
    onBlur?: (any?) => void,
}

export default function SelectImmobileFormNew(props: SelectImmobileFormNewProps) {
    const [index, setIndex] = useState(-1)
    const [isOpenDelete, setIsOpenDelete] = useState(false)

    const handleOnSet = (value) => {
        if (props.onSet) {
            props.onSet(value)
        }
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
                if (props.excludeList?.includes(element)) {
                    return false
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
                        {element.name}
                    </div>
                    <Button
                        ignoreClass
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        className="bg-red-600 hover:bg-red-800 rounded-full p-2"
                        onClick={() => {
                            console.log(props.value[index])
                        }}
                    >
                        <TrashIcon className="text-white block h-4 w-4" aria-hidden="true" />
                    </Button>
                </FormRowColumn>
            </FormRow>
        )
    }
    return (
        <Form
            title={props.title}
            subtitle={props.subtitle}
        >
            <FormRow>
                <FormRowColumn unit="6">
                    <InputSelectImmobile
                        title="Imóvel"
                        onSet={handleAdd}
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        onFilter={handleFilterList}
                        isDisabled={props.isDisabled}
                        id={"select-immobile" + (props.id ? "-" + props.id : "")}
                    />
                </FormRowColumn>
            </FormRow>
            <ListTable
                hideSearch
                className="p-2"
                list={props.value}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                isLoading={props.isLoading}
                onTableHeader={handlePutHeaders}
            />
        </Form>
    )
}
