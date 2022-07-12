import Button from "../button/button"
import { useEffect, useState } from "react"
import InputText from "../inputText/inputText"
import PlaceholderItemList from "./placeholderItemList"
import { collection, getDocs, query, where } from "firebase/firestore"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import { ProjectPayment } from "../../interfaces/objectInterfaces"
import { handleValidationNotNull } from "../../util/validationUtil"
import { ProjectConversor, ProjectPaymentConversor } from "../../db/converters"
import { db, PROJECT_COLLECTION_NAME, PROJECT_PAYMENT_COLLECTION_NAME } from "../../db/firebaseDB"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"
const contentClassName = "text-sm text-gray-900 whitespace-pre"
const titleClassName = "text-md leading-6 font-medium text-gray-900"
const titleGreenClassName = "mb-2 py-1 px-3 rounded-xl text-md leading-6 font-medium text-white bg-green-600"

interface ProjectPaymentListProps {
    haveNew?: boolean,
    isOldBase?: boolean,
    isPayedAllowed?: boolean,
    onNewClick?: () => void,
    onListItemClick?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectPaymentList(props: ProjectPaymentListProps) {
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const projectPaymentCollection = collection(db, PROJECT_PAYMENT_COLLECTION_NAME).withConverter(ProjectPaymentConversor)

    const [page, setPage] = useState(-1)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [inputSearch, setInputSearch] = useState("")

    const [listItems, setListItems] = useState([])

    const handleListItemClick = (element: ProjectPayment) => {
        setIsLoading(true)
        if (element.value !== "") {
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
        let arrayList: ProjectPayment[] = []

        try {
            const querySnapshotProject = await getDocs(projectCollection)
            let querySnapshotProjectPayment
            if (props.isPayedAllowed) {
                querySnapshotProjectPayment = await getDocs(projectPaymentCollection)
            } else {
                const queryProject = query(projectPaymentCollection, where("payed", "==", false));
                querySnapshotProjectPayment = await getDocs(queryProject)
            }
            querySnapshotProjectPayment.forEach((docProjectPayment) => {
                let projectPayment: ProjectPayment = docProjectPayment.data()

                querySnapshotProject.forEach((doc) => {
                    if (projectPayment?.project?.id === doc?.id) {
                        projectPayment = { ...projectPayment, project: doc.data() }
                    }
                })
                arrayList = [...arrayList, projectPayment]
            })
        } catch (err) {
            console.error(err)
            if (props.onShowMessage) {
                let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu, tente novamente."], messageType: "ERROR" }
                props.onShowMessage(feedbackMessage)
            }
        }

        listItemsFiltered = arrayList.filter((element: ProjectPayment, index) => {
            if (handleValidationNotNull(inputSearch)) {
                let matchName = element.project.number.toLowerCase().includes(inputSearch.toLowerCase()) || element.project.title.toLowerCase().includes(inputSearch.toLowerCase())
                return matchName
            }
            return true
        })

        listItemsFiltered = listItemsFiltered.sort((elementOne: ProjectPayment, elementTwo: ProjectPayment) => {
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
                return elementOne.project.title.localeCompare(elementTwo.project.title)
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
        if (listItems?.length === 0) {
            handleFilterList(null, true)
        }
    })

    return (
        <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="bg-gray-100 border-gray-200 px-4 py-5 sm:px-6">

                <div className="flex w-full">
                    <div className="w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Lista de pagamentos</h3>
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

                {listItems[page]?.map((element: ProjectPayment, index) => (
                    <button
                        key={index.toString()}
                        disabled={element.value !== ""}
                        onClick={() => handleListItemClick(element)}
                        className="bg-white p-4 rounded-sm shadow items-center text-left">
                        <>
                            {element.payed && (
                                <div className="mb-2"><span className={titleGreenClassName}>Pago</span></div>
                            )}
                            <p className={titleClassName}>{element.description + " - Valor: R$ " + handleMountNumberCurrency(element.value, ".", ",", 3, 2)}</p>
                            {element?.project && (
                                <p className={contentClassName}>
                                    {element.project.number && "Projeto:\n" + element.project.number}
                                </p>
                            )}
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