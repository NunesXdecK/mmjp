import ItemList from "./listItem"
import Button from "../button/button"
import { useEffect, useState } from "react"
import InputText from "../inputText/inputText"
import WindowModal from "../modal/windowModal"
import PlaceholderItemList from "./placeholderItemList"
import { FeedbackMessage } from "../modal/feedbackMessageModal"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"

interface ListProps {
    title?: string,
    subtitle?: string,
    haveNew?: boolean,
    canEdit?: boolean,
    canSelect?: boolean,
    canDelete?: boolean,
    isLoading?: boolean,
    canSeeInfo?: boolean,
    autoSearch?: boolean,
    list?: any[],
    onNewClick?: () => void,
    onEditClick?: (any) => void,
    onDeleteClick?: (any) => void,
    onFilterList?: (string) => void,
    onSelectClick?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onInfo?: (element) => any,
    onTitle?: (element) => any,
}

export default function List(props: ListProps) {
    const [element, setElement] = useState({})
    const [page, setPage] = useState(0)
    const [perPage, setPerpage] = useState(5)

    const [inputSearch, setInputSearch] = useState("")
    const [isActiveItem, setIsActiveItem] = useState(-1)
    const [isOpenDelete, setIsOpenDelete] = useState(false)

    const handleSetInputSearch = (value) => {
        if (props.autoSearch) {
            handleFilterList(null, value)
        }
        setInputSearch(value)
    }

    const handleActiveChange = (index) => {
        setIsActiveItem((old) => index)
    }

    const handlePaginationMinus = () => {
        setIsActiveItem(-1)
        setPage(page - 1)
    }

    const handlePaginationPlus = () => {
        setIsActiveItem(-1)
        setPage(page + 1)
    }

    const handleFilterList = (event?, value?) => {
        event?.preventDefault()
        if (props.onFilterList) {
            props.onFilterList(value ?? inputSearch)
        }
    }

    const handlePagination = (list) => {
        let pagesArray = []
        if (list.length > 5) {
            let lastPOS = 0
            const listLenght = list.length
            const pages = Math.ceil(listLenght / perPage)

            for (let i = 0; i < listLenght; i++) {
                const lastIndex = lastPOS + perPage
                if (lastPOS < (listLenght)) {
                    if (lastIndex < (listLenght)) {
                        pagesArray = [...pagesArray, list.slice(lastPOS, lastIndex)]
                    } else {
                        let lastPage = list.slice(lastPOS, (listLenght))
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
            pagesArray = [...pagesArray, list]
        }
        return pagesArray[page] ?? []
    }

    let classNavigationBar = "bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"

    if (props.list && Math.ceil(props.list.length / perPage) < 2) {
        classNavigationBar = classNavigationBar + " hidden"
    }

    useEffect(() => {
        window.removeEventListener("popstate", () => { })
        window.onbeforeunload = () => { }
    })

    return (
        <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="bg-gray-100 border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex w-full">
                    <div className="w-full">
                        {props.title && (<h3 className="text-lg leading-6 font-medium text-gray-900">{props.title}</h3>)}
                        {props.subtitle && (<p className={subtitle}>{props.subtitle}</p>)}
                    </div>

                    {props.haveNew && (
                        <div className="self-center">
                            <Button
                                isLoading={props.isLoading}
                                isDisabled={props.isLoading}
                                onClick={props.onNewClick}>
                                Novo
                            </Button>
                        </div>
                    )}
                </div>

                {props.onFilterList && (
                    <form className="mt-5 flex"
                        onSubmit={handleFilterList}
                    >
                        <div className="w-full self-end">
                            <InputText
                                id="inputSearch"
                                title="Pesquisar"
                                value={inputSearch}
                                isLoading={props.isLoading}
                                isDisabled={props.isLoading}
                                onSetText={handleSetInputSearch}
                            />
                        </div>
                        {!props.autoSearch && (
                            <div className="pl-4 self-end">
                                <div>
                                    <Button
                                        isDisabled={props.isLoading}
                                        isLoading={props.isLoading}
                                        type="submit">
                                        Pesquisar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                )}

            </div>

            <div className="grid grid-cols-1 gap-4 p-4 bg-white">

                {props.isLoading && (
                    <>
                        <PlaceholderItemList />
                        <PlaceholderItemList />
                        <PlaceholderItemList />
                        <PlaceholderItemList />
                        <PlaceholderItemList />
                    </>
                )}

                {handlePagination(props.list)?.map((element, index) => (
                    <ItemList
                        index={index}
                        element={element}
                        onInfo={props.onInfo}
                        onTitle={props.onTitle}
                        canEdit={props.canEdit}
                        canSelect={props.canSelect}
                        isLoading={props.isLoading}
                        canDelete={props.canDelete}
                        canSeeInfo={props.canSeeInfo}
                        isActive={isActiveItem === index}
                        onActiveChange={handleActiveChange}
                        key={page.toString() + index.toString()}
                        onDeleteClick={() => {
                            setIsOpenDelete(true)
                            setElement(element)
                        }}
                        onEditClick={() => {
                            if (props.onEditClick) {
                                props.onEditClick(element)
                            }
                        }}
                        onSelectClick={() => {
                            if (props.onSelectClick) {
                                props.onSelectClick(element)
                            }
                        }}
                    />
                ))}
            </div>

            <div className={classNavigationBar}>
                <div className="p-2 flex-1 flex justify-between">
                    <Button
                        isDisabled={page < 1}
                        onClick={handlePaginationMinus}
                    >
                        Anterior
                    </Button>

                    <span className={subtitle}>{(page + 1) + " de " + (Math.ceil(props.list.length / perPage))}</span>

                    <Button
                        onClick={handlePaginationPlus}
                        isDisabled={page === (Math.ceil(props.list.length / perPage) - 1)}
                    >
                        Próxima
                    </Button>
                </div>
            </div>

            <WindowModal
                isOpen={isOpenDelete}
                setIsOpen={setIsOpenDelete}>
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        if (props.onDeleteClick) {
                            props.onDeleteClick(element)
                        }
                        setIsOpenDelete(false)
                        setIsActiveItem(-1)
                    }}
                >
                    <p className="text-center">Deseja realmente deletar?</p>
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
        </div >
    )
}
