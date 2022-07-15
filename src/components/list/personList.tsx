import Button from "../button/button"
import data from "../../data/data.json"
import { useEffect, useState } from "react"
import InputText from "../inputText/inputText"
import PersonItemList from "./personListItem"
import WindowModal from "../modal/windowModal"
import { PersonConversor } from "../../db/converters"
import PlaceholderItemList from "./placeholderItemList"
import { handleRemoveCPFMask } from "../../util/maskUtil"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { db, PERSON_COLLECTION_NAME } from "../../db/firebaseDB"
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore"
import { defaultPerson, Person } from "../../interfaces/objectInterfaces"
import { ElementFromBase, extratePerson } from "../../util/converterUtil"
import { handleValidationOnlyNumbersNotNull, handleValidationOnlyTextNotNull } from "../../util/validationUtil"
import IOSModal from "../modal/iosModal"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"

interface PersonListProps {
    haveNew?: boolean,
    canDelete?: boolean,
    isOldBase?: boolean,
    onNewClick?: () => void,
    onListItemClick?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function PersonList(props: PersonListProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)

    const [person, setPerson] = useState(defaultPerson)

    const [page, setPage] = useState(-1)

    const [isOpenShow, setIsOpenShow] = useState(false)
    const [isOpenEdit, setIsOpenEdit] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [inputSearch, setInputSearch] = useState("")

    const [listItems, setListItems] = useState([])

    const handleRemove = async () => {
        if (person.id !== "") {
            const docRef = doc(personCollection, person.id)
            await deleteDoc(docRef)
        }
        const feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
        setPerson(defaultPerson)
        handleFilterList(null, true)
        setIsOpenDelete(false)
    }

    const handleListItemClick = () => {
        setIsLoading(true)
        if (person.name !== "" && person.cpf !== "") {
            props.onListItemClick && props.onListItemClick(person)
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
        setIsOpenDelete(false)
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
                    <PersonItemList
                        person={element}
                        isLoading={isLoading}
                        key={index.toString()}
                        canDelete={props.canDelete}
                        onDeleteClick={() => {
                            setIsOpenDelete(true)
                            setPerson((oldPerson) => element)
                        }}
                        onSelectClick={() => {
                            setIsOpenShow(true)
                            setPerson((oldPerson) => element)
                        }}
                        onEditClick={() => {
                            setIsOpenEdit(true)
                            setPerson((oldPerson) => element)
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

                    <span className={subtitle}>{(page + 1) + " de " + (listItems.length)}</span>

                    <Button
                        onClick={handlePaginationPlus}
                        isDisabled={page === (listItems?.length - 1)}
                    >
                        Próxima
                    </Button>
                </div>
            </div>

            <WindowModal
                isOpen={isOpenDelete}
                setIsOpen={setIsOpenDelete}>
                <p className="text-center">Deseja realmente deletar esta Pessoa {person.name}?</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={() => setIsOpenDelete(false)}
                    >
                        Voltar
                    </Button>
                    <Button
                        color="red"
                        onClick={() => handleRemove()}
                    >
                        Excluir
                    </Button>
                </div>
            </WindowModal>

            <WindowModal
                isOpen={isOpenEdit}
                setIsOpen={setIsOpenEdit}>
                <p className="text-center">Deseja realmente editar esta Pessoa {person.name}?</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={() => setIsOpenEdit(false)}
                    >
                        Voltar
                    </Button>
                    <Button
                        onClick={() => handleListItemClick()}
                    >
                        Editar
                    </Button>
                </div>
            </WindowModal>

            <IOSModal
                isOpen={isOpenShow}
                setIsOpen={setIsOpenShow}>
                <p>Aqui verás as informações de {person.name}?</p>
            </IOSModal>
        </div>
    )
}
