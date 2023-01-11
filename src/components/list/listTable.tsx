import { useState } from "react";
import Button from "../button/button";
import ListTableItem from "./listTableItem";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import { handleUTCToDateShow } from "../../util/dateUtils";
import { STYLE_FOR_INPUT_LOADING_TRANSPARENT } from "../../util/patternValidationUtil";

interface ListTableProps {
    list?: any[],
    title?: string,
    className?: string,
    deleteWindowTitle?: string,
    isActive?: number,
    canDelete?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    hideSearch?: boolean,
    onSetIsActive?: (any) => void,
    onShowClick?: (any, number?) => void,
    onEditClick?: (any, number?) => void,
    onDeleteClick?: (any, number) => void,
    onTableHeader?: () => any,
    onTableRow?: (any, number?) => any,
    onFilter?: (string) => any[],
}

export default function ListTable(props: ListTableProps) {
    const [page, setPage] = useState(0)
    const [element, setElement] = useState({})
    const [inputSearch, setInputSearch] = useState("")
    const [isOpenDelete, setIsOpenDelete] = useState(false)

    let perPage = 10

    const handleGetPage = (list) => {
        if (page > 0 && page === pages && (!list[page] || list[page].length > 0)) {
            setPage(page - 1)
            return page - 1
        }
        return page
    }

    const handleSetIsActive = (index) => {
        if (props.onSetIsActive) {
            props.onSetIsActive(index)
        }
    }
    const filteredList =
        (props?.onFilter && props?.onFilter(inputSearch)) ??
        (props?.list?.filter && props?.list?.filter((element, index) => {
            let name = ""
            let title = ""
            let date = ""
            let status = ""
            if (element) {
                if (typeof element === "string") {
                    name = element
                } else if (typeof element === "object") {
                    if ("name" in element) {
                        name = element.name.toString()
                    }
                    if ("title" in element) {
                        title = element.title.toString()
                    }
                    if ("status" in element) {
                        status = element.status.toString()
                    }
                    if ("date" in element) {
                        date = handleUTCToDateShow(element.date)
                    }
                }
            }
            return name.toLowerCase().includes(inputSearch.toLowerCase())
                || date.toLowerCase().includes(inputSearch.toLowerCase())
                || title.toLowerCase().includes(inputSearch.toLowerCase())
                || status.toLowerCase().includes(inputSearch.toLowerCase())
        })) ??
        props.list

    let pagesArray = []
    const listLenght = filteredList.length
    const pages = Math.ceil(listLenght / perPage)
    if (pages > 1) {
        let lastPOS = 0
        for (let i = 0; i < listLenght; i++) {
            const lastIndex = lastPOS + perPage
            if (lastPOS < (listLenght)) {
                if (lastIndex < (listLenght)) {
                    pagesArray = [...pagesArray, filteredList.slice(lastPOS, lastIndex)]
                } else {
                    let lastPage = filteredList.slice(lastPOS, (listLenght))
                    pagesArray = [...pagesArray, lastPage]
                }
                lastPOS = lastIndex
            }
        }
    } else {
        pagesArray = [...pagesArray, filteredList]
    }

    let classNameHolder = "rounded dark:text-slate-200"
    if (props.className) {
        classNameHolder = classNameHolder + " " + props.className
    }
    if (props.isLoading) {
        classNameHolder = classNameHolder + " " + STYLE_FOR_INPUT_LOADING_TRANSPARENT
    }
    /*
    useEffect(() => {
        if (listLenght > 0 && (!pagesArray[page] || pagesArray[page].length === 0)) {
            setPage((old) => old - 1)
        }
    }, [listLenght, page, pagesArray])
    */

    return (
        <>
            <div className={classNameHolder}>
                <div className="rounded mt-4 dark:border dark:border-gray-700">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-t">
                        <div className="p-4 sm:flex sm:flex-row items-center justify-between ">
                            <span className="text-2xl">{props.title}</span>
                            {!props.hideSearch && (
                                <div className="mt-10 sm:mt-0">
                                    <InputText
                                        value={inputSearch}
                                        placeholder="Pesquisa..."
                                        onSetText={setInputSearch}
                                        isLoading={props.isLoading}
                                        isDisabled={props.isDisabled}
                                    />
                                </div>
                            )}
                        </div>
                        {props.onTableHeader && (
                            <div className="px-4 hidden sm:block">
                                {props.onTableHeader()}
                            </div>
                        )}
                        {/*
                        <div className="border border-gray-200 dark:border-gray-800" />
                        */}
                    </div>
                    <div className="">
                        {pagesArray[handleGetPage(pagesArray)]?.map((element, index) => (
                            <ListTableItem
                                element={element}
                                canDelete={props.canDelete}
                                onTableRow={props?.onTableRow}
                                onShowClick={props?.onShowClick}
                                onEditClick={props?.onEditClick}
                                index={(page * perPage) + (index + 1)}
                                isLast={pagesArray[handleGetPage(pagesArray)]?.length === index + 1}
                                isDisabled={props.isLoading || props.isDisabled}
                                isActive={!props.isDisabled && (props.isActive - 1 === (page * perPage) + index)}
                                key={index + "-" + (element && "id" in element ? element.id : element)}
                                onRowClick={() => {
                                    if (!props.isDisabled) {
                                        handleSetIsActive((old) => (page * perPage) + (index + 1))
                                    }
                                }}
                                onDeleteClick={() => {
                                    setElement(element)
                                    setIsOpenDelete(true)
                                }}
                            />
                        ))}
                    </div>
                    <div className="rounded-b">
                        {pages > 1 && (
                            <div className="p-2 flex-1 flex justify-between">
                                <Button
                                    isDisabled={(page === pages ? page - 1 : page) < 1}
                                    onClick={() => {
                                        handleSetIsActive(-1)
                                        setPage((old) => page - 1)
                                    }}
                                >
                                    Anterior
                                </Button>

                                <span className="mt-1 max-w-2xl text-sm text-gray-500">{((page === pages ? page - 1 : page) + 1) + " de " + (pages)}</span>

                                <Button
                                    onClick={() => {
                                        handleSetIsActive(-1)
                                        setPage((old) => page + 1)
                                    }}
                                    isDisabled={page === pages || page === pages - 1}
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
