import { useState } from "react"
import Button from "../button/button"
import data from "../../data/data.json"
import InputText from "../inputText/inputText"
import { handleRemoveCPFMask } from "../../util/maskUtil"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { Person, Professional } from "../../interfaces/objectInterfaces"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { PersonConversor, ProfessionalConversor } from "../../db/converters"
import { ElementFromBase, extratePerson, extrateProfessional } from "../../util/converterUtil"
import { db, PERSON_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME } from "../../db/firebaseDB"
import { handleValidationNotNull, handleValidationOnlyNumbersNotNull } from "../../util/validationUtil"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"
const contentClassName = "sm:px-4 sm:py-5 mt-1 text-sm text-gray-900"
const titleClassName = "sm:px-4 sm:py-5 text-md leading-6 font-medium text-gray-900"

interface ProfessionalListProps {
    isOldBase?: boolean,
    onListItemClick?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProfessionalList(props: ProfessionalListProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    const [page, setPage] = useState(-1)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [inputSearch, setInputSearch] = useState("")

    const [listItems, setListItems] = useState([])

    const handleListItemClick = (element: Professional) => {
        setIsLoading(true)
        if (element.title !== "") {
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

    const handleFilterList = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let listItemsFiltered = []
        let arrayList: Professional[] = []
        if (props.isOldBase) {
            const startList = 0
            const endList = data.Plan1.length - 0
            const dataList = data.Plan1.slice(startList, endList)
            dataList.map((element: ElementFromBase, index) => {
                let newElement: Professional = extrateProfessional(element)
                if (handleValidationNotNull(newElement.title)) {
                    newElement = { ...newElement, oldData: element }
                    arrayList = [...arrayList, newElement]
                }
            })
        } else {
            try {
                const querySnapshotPerson = await getDocs(personCollection)
                const querySnapshotProfessional = await getDocs(professionalCollection)
                querySnapshotProfessional.forEach((docProfessional) => {
                    let professional: Professional = docProfessional.data()
                    const professionalPersonID = professional.person.id
                    querySnapshotPerson.forEach((docPerson) => {
                        const person = docPerson.data()
                        const personID = person.id
                        if (professionalPersonID === personID) {
                            professional = { ...professional, person: person }
                            return
                        }
                    })
                    arrayList = [...arrayList, professional]
                })
            } catch (err) {
                console.error(err)
                if (props.onShowMessage) {
                    let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu, tente novamente."], messageType: "ERROR" }
                    props.onShowMessage(feedbackMessage)
                }
            }
        }

        listItemsFiltered = arrayList.filter((element: Professional, index) => {
            if (handleValidationNotNull(inputSearch)) {
                let matchName = element.title.toLowerCase().includes(inputSearch.toLowerCase())
                return matchName
            }
            return true
        })

        listItemsFiltered = listItemsFiltered.sort((elementOne: Professional, elementTwo: Professional) => {
            return elementOne.title.localeCompare(elementTwo.title)
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

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="bg-gray-100 border-gray-200 px-4 py-5 sm:px-6">

                <div className="flex w-full">
                    <div className="w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Lista de profissionais</h3>
                        <p className={subtitle}>subtitulo lindo</p>
                    </div>

                    <div className="self-center">
                        <Button
                            isLink={true}
                            href="/professional">
                            Novo
                        </Button>
                    </div>
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
                {listItems[page]?.map((element: Professional, index) => (
                    <button
                        key={index.toString()}
                        disabled={element.title === ""}
                        onClick={() => handleListItemClick(element)}
                        className="bg-white p-4 rounded-sm shadow items-center text-left">
                        <>
                            <div className="flex">
                                <div><span className={titleClassName}>{element.title}</span></div>
                            </div>
                            <div>
                                <span className={contentClassName}>
                                    {element.person?.name} {element.person?.cpf}
                                </span>
                            </div>
                        </>
                    </button>
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
        </div>
    )
}