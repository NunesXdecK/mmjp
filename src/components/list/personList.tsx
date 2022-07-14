import { useEffect, useState } from "react"
import Button from "../button/button"
import data from "../../data/data.json"
import InputText from "../inputText/inputText"
import { PersonConversor } from "../../db/converters"
import { collection, getDocs } from "firebase/firestore"
import { defaultCompany, defaultPerson, Person } from "../../interfaces/objectInterfaces"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { db, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import { handleMaskCPF, handleRemoveCPFMask } from "../../util/maskUtil"
import { ElementFromBase, extratePerson } from "../../util/converterUtil"
import { handleValidationOnlyNumbersNotNull, handleValidationOnlyTextNotNull } from "../../util/validationUtil"
import PlaceholderItemList from "./placeholderItemList"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"
const contentClassName = "sm:px-4 sm:py-5 mt-1 text-sm text-gray-900"
const titleClassName = "sm:px-4 sm:py-5 text-md leading-6 font-medium text-gray-900"

interface PersonListProps {
    haveNew?: boolean,
    isOldBase?: boolean,
    onNewClick?: () => void,
    onListItemClick?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function PersonList(props: PersonListProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)

    const [page, setPage] = useState(-1)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [inputSearch, setInputSearch] = useState("")

    const [listItems, setListItems] = useState([])

    const handleListItemClick = (element: Person) => {
        setIsLoading(true)
        if (element.name !== "" && element.cpf !== "") {
            props.onListItemClick && props.onListItemClick(element)
        }
        setIsLoading(false)
    }

    const handlePaginationMinus = () => {
        setPage(page - 1)
    }

    const handlePaginationPlus = () => {
        setPage(page + 1)
    }

    const handleFilterList = async (event?, first?) => {
        event?.preventDefault()

        setIsLoading(true)
        let listItemsFiltered = []
        let arrayList: Person[] = []

        if (props.isOldBase) {
            const startList = 0
            const endList = data.Plan1.length - 0
            const dataList = data.Plan1.slice(startList, endList)
            dataList.map((element: ElementFromBase, index) => {
                let newElement: Person = extratePerson(element)
                if (handleValidationOnlyTextNotNull(newElement.name) && handleRemoveCPFMask(newElement.cpf)?.length === 11) {
                    newElement = { ...newElement, oldData: element }
                    arrayList = [...arrayList, newElement]
                }
            })
        } else {
            try {
                const querySnapshot = await getDocs(personCollection)
                querySnapshot.forEach((doc) => {
                    arrayList = [...arrayList, doc.data()]
                })
            } catch (err) {
                console.error(err)
                if (props.onShowMessage) {
                    let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu, tente novamente."], messageType: "ERROR" }
                    props.onShowMessage(feedbackMessage)
                }
            }
        }

        listItemsFiltered = arrayList.filter((element: Person, index) => {
            if (handleValidationOnlyNumbersNotNull(handleRemoveCPFMask(inputSearch))) {
                let matchCPF = handleRemoveCPFMask(element.cpf).includes(handleRemoveCPFMask(inputSearch))
                return matchCPF
            }

            if (handleValidationOnlyTextNotNull(inputSearch)) {
                let matchName = element.name.toLowerCase().includes(inputSearch.toLowerCase())
                return matchName
            }
            return true
        })

        listItemsFiltered = listItemsFiltered.sort((elementOne: Person, elementTwo: Person) => {
            if (first) {
                let dateOne = elementOne.dateInsertUTC
                let dateTwo = elementTwo.dateInsertUTC

                if (elementOne.dateLastUpdateUTC > 0 && elementOne.dateLastUpdateUTC > dateOne) {
                    dateOne = elementOne.dateLastUpdateUTC
                }
                if (elementTwo.dateLastUpdateUTC > 0 && elementTwo.dateLastUpdateUTC > dateTwo) {
                    dateTwo = elementTwo.dateLastUpdateUTC
                }
                return dateTwo - dateOne
            } else {
                return elementOne.name.localeCompare(elementTwo.name)
            }
        })

        let pagesArray = []
        if (listItemsFiltered.length > 5) {
            let lastPOS = 0
            const perPage = 5
            const listLenght = listItemsFiltered.length
            const pages = Math.ceil(listLenght / perPage)

            for (let i = 0; i < listLenght; i++) {
                const lastIndex = lastPOS + perPage
                if (lastPOS < (listLenght - 1)) {
                    if (lastIndex < (listLenght - 1)) {
                        pagesArray = [...pagesArray, listItemsFiltered.slice(lastPOS, lastIndex)]
                    } else {
                        let lastPage = listItemsFiltered.slice(lastPOS, (listLenght - 1))
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
            pagesArray = [...pagesArray, listItemsFiltered]
        }

        setPage(0)
        setListItems(pagesArray)
        setIsLoading(false)
    }

    const handleAfterSaveOperation = () => {
        setIsOpen(false)
    }

    let classNavigationBar = "bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"

    if (listItems.length < 2) {
        classNavigationBar = classNavigationBar + " hidden"
    }

    useEffect(() => {
        if (listItems.length === 0) {
            handleFilterList(null, true)
        }
    })

    return (
        <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="bg-gray-100 border-gray-200 px-4 py-5 sm:px-6">

                <div className="flex w-full">
                    <div className="w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Lista de pessoas</h3>
                        <p className={subtitle}>subtitulo lindo</p>
                    </div>

                    {props.haveNew && (
                        <div className="self-center">
                            <Button
                                isLoading={isLoading}
                                isDisabled={isLoading}
                                onClick={props.onNewClick}>
                                Novo
                            </Button>
                        </div>
                    )}
                </div>

                <form className="mt-5 flex" onSubmit={handleFilterList}>
                    <div className="w-full self-end">
                        <InputText
                            id="inputSearch"
                            title="Pesquisar"
                            value={inputSearch}
                            isLoading={isLoading}
                            isDisabled={isLoading}
                            onSetText={setInputSearch}
                        />
                    </div>

                    <div className="pl-4 self-end">
                        <div>
                            <Button
                                isDisabled={isLoading}
                                isLoading={isLoading}
                                type="submit">
                                Pesquisar
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 bg-white">

                {listItems?.length === 0 && (
                    <>
                        <PlaceholderItemList />
                        <PlaceholderItemList />
                        <PlaceholderItemList />
                        <PlaceholderItemList />
                        <PlaceholderItemList />
                    </>
                )}

                {listItems[page]?.map((element: Person, index) => (
                    <div
                        key={index.toString()}
                        className="bg-white p-4 rounded-sm shadow items-center text-left">
                        <div className="flex">
                            <div><span className={titleClassName}>{element.name}</span></div>
                        </div>
                        <div><span className={contentClassName}>{handleMaskCPF(element.cpf)}</span></div>
                        {element.rg && (<div><span className={contentClassName}>{element.rg}</span></div>)}
                        <div className="mt-2 w-full flex justify-end">
                            <Button
                                isHidden={element.name === ""}
                                onClick={() => handleListItemClick(element)}
                            >
                                Selecionar
                            </Button>
                        </div>
                    </div>
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

                    <span className={subtitle}>{(page + 1) + " de " + (listItems.length)}</span>

                    <Button
                        onClick={handlePaginationPlus}
                        isDisabled={page === (listItems?.length - 1)}
                    >
                        Próxima
                    </Button>
                </div>
            </div>
        </div >
    )
}
