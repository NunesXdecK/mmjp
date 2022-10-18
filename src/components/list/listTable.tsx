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

interface ListTableProps {
    list?: any[],
    title?: string,
    isLoading?: boolean,
    onDeleteClick?: (any) => void,
    onShowClick?: (any, number?) => void,
    onEditClick?: (any, number?) => void,
    onTableHeader?: () => any,
    onTableRow?: (any) => any,
}

export default function ListTable(props: ListTableProps) {
    const [isActive, setIsActive] = useState(-1)
    const [inputSearch, setInputSearch] = useState("")
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
        <div className={classNameHolder}>
            <div className="rounded mt-4 ">
                <div className="bg-gray-200">
                    <div className="p-4 flex flex-row items-center justify-between ">
                        <span className="text-2xl">{props.title}</span>
                        <div>
                            <InputText
                                value={inputSearch}
                                placeholder="Pesquisa..."
                                onSetText={setInputSearch}
                                isDisabled={props.isLoading}
                            />
                        </div>
                    </div>
                    {props.onTableHeader && (
                        <div className="px-4">
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
                            }}
                            isDisabled={props.isLoading}
                            isActive={isActive === index}
                            onTableRow={props.onTableRow}
                            onShowClick={props.onShowClick}
                            onEditClick={props.onEditClick}
                            onDeleteClick={props.onDeleteClick}
                            key={index + "-" + (element && "id" in element ? element.id : element)}
                        />
                    ))}
                </div>
            </div>
        </div >
    )
}
