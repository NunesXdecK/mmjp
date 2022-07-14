import Button from "../button/button"
import { useEffect, useState } from "react"
import InputText from "../inputText/inputText"
import { collection, getDocs } from "firebase/firestore"
import PlaceholderItemList from "./placeholderItemList"
import { ProfessionalConversor, ProjectConversor, ProjectStageConversor } from "../../db/converters"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { ProjectStage } from "../../interfaces/objectInterfaces"
import { handleValidationNotNull } from "../../util/validationUtil"
import { db, PROFESSIONAL_COLLECTION_NAME, PROJECT_COLLECTION_NAME, PROJECT_STAGE_COLLECTION_NAME } from "../../db/firebaseDB"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"
const contentClassName = "text-sm text-gray-900 whitespace-pre"
const descriptionClassName = " mt-4"
const titleClassName = "text-md leading-6 font-medium text-gray-900"

interface ProjectStageListProps {
    haveNew?: boolean,
    isOldBase?: boolean,
    onNewClick?: () => void,
    onListItemClick?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectStageList(props: ProjectStageListProps) {
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)
    const projectStageCollection = collection(db, PROJECT_STAGE_COLLECTION_NAME).withConverter(ProjectStageConversor)

    const [page, setPage] = useState(-1)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [inputSearch, setInputSearch] = useState("")

    const [listItems, setListItems] = useState([])

    const handleListItemClick = (element: ProjectStage) => {
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

    const handleFilterList = async (event?, first?) => {
        event?.preventDefault()
        setIsLoading(true)
        let listItemsFiltered = []
        let arrayList: ProjectStage[] = []

        try {
            const querySnapshotProject = await getDocs(projectCollection)
            const querySnapshotProfessional = await getDocs(professionalCollection)
            const querySnapshotProjectStage = await getDocs(projectStageCollection)
            querySnapshotProjectStage.forEach((docProjectStage) => {
                let projectStage: ProjectStage = docProjectStage.data()

                querySnapshotProfessional.forEach((doc) => {
                    if (projectStage?.responsible?.id === doc?.id) {
                        projectStage = { ...projectStage, responsible: doc.data() }
                    }
                })

                querySnapshotProject.forEach((doc) => {
                    if (projectStage?.project?.id === doc?.id) {
                        projectStage = { ...projectStage, project: doc.data() }
                    }
                })
                arrayList = [...arrayList, projectStage]
            })
        } catch (err) {
            console.error(err)
            if (props.onShowMessage) {
                let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu, tente novamente."], messageType: "ERROR" }
                props.onShowMessage(feedbackMessage)
            }
        }

        listItemsFiltered = arrayList.filter((element: ProjectStage, index) => {
            if (handleValidationNotNull(inputSearch)) {
                let matchName = element.title.toLowerCase().includes(inputSearch.toLowerCase())
                return matchName
            }
            return true
        })

        listItemsFiltered = listItemsFiltered.sort((elementOne: ProjectStage, elementTwo: ProjectStage) => {
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
                return elementOne.title.localeCompare(elementTwo.title)
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
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Lista de etapas</h3>
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

                {listItems[page]?.map((element: ProjectStage, index) => (
                    <div
                        key={index.toString()}
                        className="bg-white p-4 rounded-sm shadow items-center text-left">
                        <>
                            <p className={titleClassName}>{element.title}</p>
                            {element?.project?.id && (
                                <p className={contentClassName}>
                                    {element.project.number && "Projeto:\n" + element.project.number}
                                </p>
                            )}
                            {element?.responsible?.id && (
                                <p className={contentClassName}>
                                    {element.responsible.title && "Responsavel:\n" + element.responsible.title} {element.responsible.creaNumber && "CREA: " + element.responsible.creaNumber}
                                </p>
                            )}
                            <p className={contentClassName + descriptionClassName}>{"Descrição:\n" + element.description}</p>
                            <div className="mt-2 w-full flex justify-end">
                                <Button
                                    isHidden={element.title === ""}
                                    onClick={() => handleListItemClick(element)}
                                >
                                    Selecionar
                                </Button>
                            </div>
                        </>
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
        </div>
    )
}