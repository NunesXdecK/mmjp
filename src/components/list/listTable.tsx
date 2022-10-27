import { useState } from "react";
import Button from "../button/button";
import ListTableItem from "./listTableItem";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import { STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil";

interface ListTableProps {
    list?: any[],
    title?: string,
    deleteWindowTitle?: string,
    isActive?: number,
    isLoading?: boolean,
    onSetIsActive?: (any) => void,
    onShowClick?: (any, number?) => void,
    onEditClick?: (any, number?) => void,
    onDeleteClick?: (any, number) => void,
    onTableHeader?: () => any,
    onTableRow?: (any) => any,
}

export default function ListTable(props: ListTableProps) {
    const [page, setPage] = useState(0)
    const [element, setElement] = useState({})
    const [inputSearch, setInputSearch] = useState("")
    const [isOpenDelete, setIsOpenDelete] = useState(false)

    const handleSetIsActive = (index) => {
        if (props.onSetIsActive) {
            props.onSetIsActive(index)
        }
    }

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

    let pagesArray = []
    if (filteredList.length > 5) {
        let lastPOS = 0
        const listLenght = filteredList.length
        const pages = Math.ceil(listLenght / 10)

        for (let i = 0; i < listLenght; i++) {
            const lastIndex = lastPOS + 10
            if (lastPOS < (listLenght)) {
                if (lastIndex < (listLenght)) {
                    pagesArray = [...pagesArray, filteredList.slice(lastPOS, lastIndex)]
                } else {
                    let lastPage = filteredList.slice(lastPOS, (listLenght))
                    {/*
                    let diference = perPage - lastPage.length
                    for (let ii = 0; ii < diference; ii++) {
                        lastPage = [...lastPage, defaultPerson]
                    }
                */}
                    pagesArray = [...pagesArray, lastPage]
                }
                lastPOS = lastIndex
            }
        }
    } else {
        pagesArray = [...pagesArray, filteredList]
    }

    let classNameHolder = "rounded p-4 pt-0"
    if (props.isLoading) {
        classNameHolder = classNameHolder + " " + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }
    return (
        <>
            <div className={classNameHolder}>
                <div className="rounded mt-4 ">
                    <div className="bg-gray-200 rounded-t">
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
                        {pagesArray[page]?.map((element, index) => (
                            <ListTableItem
                                index={index}
                                element={element}
                                onRowClick={() => {
                                    handleSetIsActive(index)
                                }}
                                isDisabled={props.isLoading}
                                isActive={props.isActive === index}
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
                    <div className="rounded-b">
                        {(Math.ceil(filteredList.length / 10)) > 1 && (
                            <div className="p-2 flex-1 flex justify-between">
                                <Button
                                    isDisabled={page < 1}
                                    onClick={() => {
                                        handleSetIsActive(-1)
                                        setPage((old) => page - 1)
                                    }}
                                >
                                    Anterior
                                </Button>

                                <span className="mt-1 max-w-2xl text-sm text-gray-500">{(page + 1) + " de " + (Math.ceil(filteredList.length / 10))}</span>

                                <Button
                                    onClick={() => {
                                        handleSetIsActive(-1)
                                        setPage((old) => page + 1)
                                    }}
                                    isDisabled={page === (Math.ceil(filteredList.length / 10) - 1)}
                                >
                                    Próxima
                                </Button>
                            </div>
                        )}
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
                            props.onDeleteClick(element, props.isActive)
                        }
                        handleSetIsActive(-1)
                        setIsOpenDelete(false)
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
