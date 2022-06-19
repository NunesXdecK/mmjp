import { useState } from "react"
import Button from "../button/button"
import InputText from "../inputText/inputText"
import { collection, getDocs } from "firebase/firestore"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { handleValidationNotNull } from "../../util/validationUtil"
import { handleMaskCNPJ, handleMaskCPF } from "../../util/maskUtil"
import { Company, Person, Project, Property } from "../../interfaces/objectInterfaces"
import { CompanyConversor, PersonConversor, ProfessionalConversor, ProjectConversor, PropertyConversor } from "../../db/converters"
import { COMPANY_COLLECTION_NAME, db, PERSON_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME, PROJECT_COLLECTION_NAME, PROPERTY_COLLECTION_NAME } from "../../db/firebaseDB"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"
const contentClassName = "sm:px-4 sm:py-5 mt-1 text-sm text-gray-900"
const titleClassName = "sm:px-4 sm:py-5 text-md leading-6 font-medium text-gray-900"

interface ProjectListProps {
    isOldBase?: boolean,
    onListItemClick?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectList(props: ProjectListProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const propertyCollection = collection(db, PROPERTY_COLLECTION_NAME).withConverter(PropertyConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    const [page, setPage] = useState(-1)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [inputSearch, setInputSearch] = useState("")

    const [listItems, setListItems] = useState([])

    const handleListItemClick = (element: Project) => {
        setIsLoading(true)
        if (element.number !== "") {
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
        let arrayList: Project[] = []

        try {
            const querySnapshotPerson = await getDocs(personCollection)
            const querySnapshotCompany = await getDocs(companyCollection)
            const querySnapshotProperties = await getDocs(propertyCollection)
            const querySnapshotProfessional = await getDocs(professionalCollection)
            const querySnapshotProject = await getDocs(projectCollection)
            querySnapshotProject.forEach((docProject) => {
                let project: Project = docProject.data()
                let propertiesIdList = []
                let personOwnersIdList = []
                let companyOwnersIdList = []
                let clientsList = []
                let propertiesList = []

                project?.clients?.map((element, index) => {
                    if (element.parent.id === PERSON_COLLECTION_NAME) {
                        personOwnersIdList = [...personOwnersIdList, element.id]
                    } else if (element.parent.id === COMPANY_COLLECTION_NAME) {
                        companyOwnersIdList = [...companyOwnersIdList, element.id]
                    }
                })
                project?.properties?.map((element, index) => {
                    if (element.id) {
                        propertiesIdList = [...propertiesIdList, element.id]
                    }
                })

                querySnapshotPerson.forEach((doc) => {
                    const id = doc.data().id
                    if (personOwnersIdList.includes(id)) {
                        if (!clientsList.includes(doc.data())) {
                            clientsList = [...clientsList, doc.data()]
                        }
                    }
                })
                querySnapshotCompany.forEach((doc) => {
                    const id = doc.data().id
                    if (companyOwnersIdList.includes(id)) {
                        if (!clientsList.includes(doc.data())) {
                            clientsList = [...clientsList, doc.data()]
                        }
                    }
                })
                querySnapshotProperties.forEach((doc) => {
                    const id = doc.data().id
                    if (propertiesIdList.includes(id)) {
                        if (!propertiesList.includes(doc.data())) {
                            propertiesList = [...propertiesList, doc.data()]
                        }
                    }
                })
                querySnapshotProfessional.forEach((doc) => {
                    if (project?.professional?.id === doc?.id) {
                        project = { ...project, professional: doc.data() }
                    }
                })

                const date = new Date(project.date)
                const month = (date.getMonth() + 1).toString().length > 1 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
                const dateString = date.getUTCDate() + "/" + month + "/" + date.getFullYear()

                project = {
                    ...project,
                    dateString: dateString,
                    clients: clientsList,
                    properties: propertiesList,
                }

                arrayList = [...arrayList, project]
            })
        } catch (err) {
            console.error(err)
            if (props.onShowMessage) {
                let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu, tente novamente."], messageType: "ERROR" }
                props.onShowMessage(feedbackMessage)
            }
        }

        listItemsFiltered = arrayList.filter((element: Project, index) => {
            if (handleValidationNotNull(inputSearch)) {
                let matchName = element.number.toLowerCase().includes(inputSearch.toLowerCase())
                return matchName
            }
            return true
        })

        listItemsFiltered = listItemsFiltered.sort((elementOne: Project, elementTwo: Project) => {
            return elementOne.number.localeCompare(elementTwo.number)
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
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Lista de propriedades</h3>
                        <p className={subtitle}>subtitulo lindo</p>
                    </div>

                    <div className="self-center">
                        <Button
                            isLink={true}
                            isLoading={isLoading}
                            isDisabled={isLoading}
                            href="/project">
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
                {listItems[page]?.map((element: Project, index) => (
                    <button
                        key={index.toString()}
                        disabled={element.number === ""}
                        onClick={() => handleListItemClick(element)}
                        className="bg-white p-4 rounded-sm shadow items-center text-left">
                        <>
                            <div className="flex">
                                <div><span className={titleClassName}>{element.number} - {element.dateString}</span></div>
                            </div>
                            {element.clients?.map((elementClient: Person | Company, indexOwners) => (
                                <div key={elementClient.name + index + indexOwners}>
                                    <span className={contentClassName}>
                                        {elementClient.name && elementClient.name} {("cpf" in elementClient && "CPF: " + handleMaskCPF(elementClient.cpf)) || ("cnpj" in elementClient && "CNPJ: " + handleMaskCNPJ(elementClient.cnpj))}
                                    </span>
                                </div>
                            ))}
                            {element.properties?.map((elementProperty: Property, indexOwners) => (
                                <div key={elementProperty.name + index + indexOwners}>
                                    <span className={contentClassName}>
                                        {elementProperty.name && elementProperty.name} {elementProperty.area && "Área: " + elementProperty.area} {elementProperty.perimeter && "Perimetro: " + elementProperty.perimeter}
                                    </span>
                                </div>
                            ))}
                            {element?.professional && (
                                <div>
                                    <span className={contentClassName}>
                                        {element.professional.title && element.professional.title} {element.professional.creaNumber && "CREA: " + element.professional.creaNumber}
                                    </span>
                                </div>
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