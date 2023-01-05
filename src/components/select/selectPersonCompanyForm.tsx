import Form from "../form/form"
import { useState } from "react"
import Button from "../button/button"
import FormRow from "../form/formRow"
import ListTable from "../list/listTable"
import { NavBarPath } from "../bar/navBar"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { TrashIcon } from "@heroicons/react/solid"
import InputSelectPersonCompany from "../inputText/inputSelectPersonCompany"
import { Company, defaultPerson, Person } from "../../interfaces/objectInterfaces"

interface SelectPersonCompanyFormProps {
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
    value?: (Person | Company)[],
    prevPath?: NavBarPath[] | any,
    excludeList?: (Person | Company)[],
    onSet?: (any?) => void,
    onBlur?: (any?) => void,
    onSetIsLoading?: (boolean) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectPersonCompanyForm(props: SelectPersonCompanyFormProps) {
    const [index, setIndex] = useState(-1)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [element, setElement] = useState<(Person | Company)>(defaultPerson)

    const handleOnSet = (value) => {
        if (props.onSet) {
            props.onSet(value)
        }
    }

    const handleRemove = () => {
        fetch("api/immobileOwner", {
            method: "DELETE",
            body: JSON.stringify({
                token: "tokenbemseguro",
                immobileId: props?.immobileId ?? 0,
                personId: "cpf" in element ? element?.id : 0,
                companyId: "cnpj" in element ? element?.id : 0,
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

    const handleAdd = (value: (Person | Company)) => {
        if (!props.excludeList?.includes(value)) {
            if (props.immobileId && props.immobileId > 0) {
                fetch("api/immobileOwner", {
                    method: "POST",
                    body: JSON.stringify({
                        token: "tokenbemseguro",
                        data: {
                            ...value,
                            immobileId: props?.immobileId,
                        },
                    }),
                })
            }
            handleOnSet([...props.value, value])
        }
    }

    const handleFilterList = (list, string) => {
        let listItemsFiltered: (Person | Company)[] = []
        if (list?.length > 0) {
            listItemsFiltered = list?.filter((element: (Person | Company), index) => {
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
    const handlePutRows = (element: (Person | Company), index: number) => {
        return (
            <FormRow>
                <FormRowColumn unit="6" className="flex flex-row justify-between items-center">
                    <div>
                        {element.name}
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
            >
                <FormRow>
                    <FormRowColumn unit="6">
                        <InputSelectPersonCompany
                            notSet
                            onSet={handleAdd}
                            isFull={props.isFull}
                            onBlur={props.onBlur}
                            title={props.inputTitle}
                            prevPath={props.prevPath}
                            isLoading={props.isLoading}
                            onFilter={handleFilterList}
                            isDisabled={props.isDisabled}
                            placeholder={props.placeholder}
                            onShowMessage={props.onShowMessage}
                            onSetLoading={props.onSetIsLoading}
                            id={"select-person" + (props.id ? "-" + props.id : "")}
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
                <p className="text-center">Deseja realmente deletar {element.name}?</p>
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
