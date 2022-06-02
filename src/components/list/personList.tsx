import { useState } from "react"
import Button from "../button/button"
import IOSModal from "../modal/iosModal"
import data from "../../data/data.json"
import PersonForm from "../form/personForm"
import InputText from "../inputText/inputText"
import { PersonConversor } from "../../db/converters"
import { collection, getDocs } from "firebase/firestore"
import { Person } from "../../interfaces/objectInterfaces"
import { db, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import { handleMaskCPF, handleRemoveCPFMask } from "../../util/maskUtil"
import { ElementFromBase, extratePerson } from "../../util/converterUtil"
import { FeedbackMessage } from "../modal/feedbackMessageModal"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"
const titleClassName = "sm:px-4 sm:py-5 text-md leading-6 font-medium text-gray-900"
const contentClassName = "sm:px-4 sm:py-5 mt-1 text-sm text-gray-900"

interface PersonListProps {
    isOldBase?: boolean,
    isForSelect?: boolean,
    onShowMessage?: (any) => void,
    onListItemClick?: (any) => void,
}

export default function PersonList(props: PersonListProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)

    const [page, setPage] = useState(-1)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [inputSearch, setInputSearch] = useState("")

    const [listItems, setListItems] = useState([])


    const handlePaginationMinus = () => {
        setPage(page - 1)
    }

    const handlePaginationPlus = () => {
        setPage(page + 1)
    }

    const handleFilterList = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let listItemsFiltered = []
        let arrayList: Person[] = []

        if (props.isOldBase) {
            const startList = 0
            const endList = data.Plan1.length - 0
            const dataList = data.Plan1.slice(startList, endList)
            dataList.map((element: ElementFromBase, index) => {
                let newElement: Person = extratePerson(element)
                newElement = { ...newElement, oldPerson: element }
                arrayList = [...arrayList, newElement]
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
            let matchCPF = handleRemoveCPFMask(element.cpf).includes(handleRemoveCPFMask(inputSearch))
            let matchName = element.name.toUpperCase().includes(inputSearch.toUpperCase())
            return matchCPF || matchName
        })

        listItemsFiltered = listItemsFiltered.sort((elementOne: Person, elementTwo: Person) => {
            return elementOne.name.localeCompare(elementTwo.name)
        })

        let pagesArray = []
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
                    pagesArray = [...pagesArray, listItemsFiltered.slice(lastPOS, (listLenght - 1))]
                }
                lastPOS = lastIndex
            }
        }

        setListItems(pagesArray)
        setPage(0)
        setIsLoading(false)
    }

    const handleAfterSaveOperation = () => {
        setIsOpen(false)
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="bg-gray-100 border-gray-200 px-4 py-5 sm:px-6">

                <div className="flex w-full">
                    <div className="w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Lista de pessoas</h3>
                        <p className={subtitle}>subtitulo lindo</p>
                    </div>

                    {!props.isForSelect ? (
                        <div className="self-center">
                            <Button
                                isLoading={isLoading}
                                isDisabled={isLoading}
                                onClick={() => setIsOpen(true)}>
                                Novo
                            </Button>
                        </div>
                    ) : null}
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
                {listItems[page]?.map((element, index) => (
                    <button key={index.toString()}
                        onClick={() => {
                            props.onListItemClick && props.onListItemClick(element)
                        }}
                        className="bg-white p-4 rounded-sm shadow items-center text-left">
                        <div className="flex">
                            <div><span className={titleClassName}>{element.name}</span></div>
                        </div>
                        <div><span className={contentClassName}>{handleMaskCPF(element.cpf)}</span></div>
                        <div><span className={contentClassName}>{element.rg}</span></div>
                    </button>
                ))}
            </div>

            <div className="p-2 flex-1 flex justify-between">
                <Button
                    isDisabled={page === 0}
                    onClick={handlePaginationMinus}
                    >
                    Previous
                </Button>
                <span>{page + 1}</span>
                <Button
                    onClick={handlePaginationPlus}
                    isDisabled={page === (listItems?.length - 1)}
                    >
                    Next
                </Button>
            </div>

            {!props.isForSelect && (
                <IOSModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}>
                    <PersonForm
                        title="Informações pessoais"
                        subtitle="Dados importantes sobre a pessoa"
                        onAfterSave={handleAfterSaveOperation}
                    />
                </IOSModal>
            )}
        </div>
    )
}
