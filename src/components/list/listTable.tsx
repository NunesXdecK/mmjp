import Button from "../button/button";
import FormRow from "../form/formRow";
import { useState } from "react";
import InputText from "../inputText/inputText";
import FormRowColumn from "../form/formRowColumn";
import { handleMaskCPF } from "../../util/maskUtil";
import { Person } from "../../interfaces/objectInterfaces";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import ListTableItem from "./listTableItem";
import { STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil";
import WindowModal from "../modal/windowModal";
import PlaceholderItemList from "./placeholderItemList";

interface ListTableProps {
    list?: any[],
    title?: string,
    deleteWindowTitle?: string,
    isLoading?: boolean,
    onDeleteClick?: (any, number) => void,
    onShowClick?: (any, number?) => void,
    onEditClick?: (any, number?) => void,
    onTableHeader?: () => any,
    onTableRow?: (any) => any,
    onSetIndex?: (any) => void,
}

export default function ListTable(props: ListTableProps) {
    const [element, setElement] = useState({})
    const [isActive, setIsActive] = useState(-1)
    const [inputSearch, setInputSearch] = useState("")
    const [isOpenDelete, setIsOpenDelete] = useState(false)

    const filteredList = props.list.filter((element, index) => {
        let name = ""
        if (element) {
            if (typeof element === "string") {
                name = element
            } else if (typeof element === "object") {
                if ("name" in element) {
                    name = element.name
                }
                if ("title" in element) {
                    name = element.title
                }
            }
        }
        return name.toLowerCase().includes(inputSearch.toLowerCase())
    })

    let classNameHolder = "rounded p-4 pt-0"
    if (props.isLoading) {
        classNameHolder = classNameHolder + " " + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }
    return (
        <>
            <div className={classNameHolder}>
                <div className="rounded mt-4 ">
                    <div className="bg-gray-200">
                        <div className="p-4 sm:flex sm:flex-row items-center justify-between ">
                            <span className="text-2xl">{props.title}</span>
                            <div className="mt-10 sm:mt-0">
                                <InputText
                                    value={inputSearch}
                                    placeholder="Pesquisa..."
                                    onSetText={setInputSearch}
                                    isDisabled={props.isLoading}
                                />
                            </div>
                        </div>
                        {props.onTableHeader && (
                            <div className="px-4 hidden sm:block">
                                {props.onTableHeader()}
                            </div>
                        )}
                        <div className="border-black my-1" />
                    </div>
                    <div className="">
                        {filteredList.map((element, index) => (
                            <ListTableItem
                                index={index}
                                element={element}
                                onRowClick={() => {
                                    setIsActive(index)
                                    if (props.onSetIndex) {
                                        props.onSetIndex(index)
                                    }
                                }}
                                isDisabled={props.isLoading}
                                isActive={isActive === index}
                                onTableRow={props.onTableRow}
                                onShowClick={props.onShowClick}
                                onEditClick={props.onEditClick}
                                key={index + "-" + (element && "id" in element ? element.id : element)}
                                onDeleteClick={() => {
                                    setElement(element)
                                    setIsOpenDelete(true)
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <WindowModal
                isOpen={isOpenDelete}
                setIsOpen={setIsOpenDelete}>
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        if (props.onDeleteClick) {
                            props.onDeleteClick(element, isActive)
                        }
                        setIsOpenDelete(false)
                        setIsActive(-1)
                    }}
                >
                    <p className="text-center">
                        {props.deleteWindowTitle ?? "Deseja realmente deletar?"}
                    </p>
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
                        >
                            Excluir
                        </Button>
                    </div>
                </form>
            </WindowModal>
        </>
    )
}
