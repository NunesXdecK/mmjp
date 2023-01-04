import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import PersonView from "../view/personView"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import { PlusIcon } from "@heroicons/react/solid"
import FormRowColumn from "../form/formRowColumn"
import NavBar, { NavBarPath } from "../bar/navBar"
import { handleMaskCPF } from "../../util/maskUtil"
import PersonDataForm from "../form/personDataForm"
import PersonActionBarForm from "../bar/personActionBar"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { Person, defaultPerson } from "../../interfaces/objectInterfaces"

interface PersonPageProps {
    id?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canDelete?: boolean,
    canUpdate?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    prevPath?: NavBarPath[],
    onSetPage?: (any) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function PersonPage(props: PersonPageProps) {
    const [person, setPerson] = useState<Person>(defaultPerson)
    const [persons, setPersons] = useState<Person[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setPerson(defaultPerson)
        setIndex(-1)
        setIsForShow(false)
        setIsRegister(false)
    }

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleDeleteClick = async (person, index) => {
        handleSetIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/person", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: person.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const list = [
            ...persons.slice(0, (index - 1)),
            ...persons.slice(index, persons.length),
        ]
        setPersons(list)
        handleSetIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setPerson({
            ...defaultPerson,
        })
        setIsRegister(true)
        setIndex(-1)
    }

    const handleCloseModal = (value) => {
        setIsRegister(value)
        setIsForShow(value)
    }

    const handleShowClick = (project) => {
        handleSetIsLoading(true)
        setPerson({ ...defaultPerson, ...project })
        setIsForShow(true)
        handleSetIsLoading(false)
    }

    const handleEditClick = async (person, index?) => {
        handleSetIsLoading(true)
        setIsForShow(false)
        let localPerson: Person = await fetch("api/person/" + person?.id).then((res) => res.json()).then((res) => res.data)
        localPerson = {
            ...localPerson,
            cpf: handleMaskCPF(localPerson?.cpf)
        }
        handleSetIsLoading(false)
        setIsRegister(true)
        setPerson(localPerson)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, person: Person, isForCloseModal) => {
        let localIndex = -1
        persons.map((element, index) => {
            if (element.id === person.id) {
                localIndex = index
            }
        })
        let list: Person[] = [
            person,
            ...persons,
        ]
        if (localIndex > -1) {
            list = [
                person,
                ...persons.slice(0, localIndex),
                ...persons.slice(localIndex + 1, persons.length),
            ]
        }
        setPersons((old) => list)
        handleShowMessage(feedbackMessage)
        if (!isForCloseModal) {
            handleBackClick()
            setIndex((old) => -1)
        } else {
            setIndex((old) => 1)
        }
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handlePutModalTitle = (short: boolean) => {
        let paths = []
        let path: NavBarPath = { path: "Nova pessoa", onClick: null }
        if (short) {
            //path = { ...path, path: "S" }
        }
        if (person?.id > 0) {
            path = { ...path, path: "Pessoa-" + person.name, onClick: null }
        }
        try {
            if (props.prevPath?.length > 0) {
                let prevPath: NavBarPath = {
                    ...props.prevPath[props.prevPath?.length - 1],
                    onClick: handleBackClick,
                    path: props.prevPath[props.prevPath?.length - 1]?.path + "/",
                }
                paths = [...props.prevPath.slice(0, props.prevPath?.length - 1), prevPath,]
            }
            paths = [...paths, path]
        } catch (err) {
            console.error(err)
        }
        if (short) {
            return paths
        } else {
            return (
                <>
                    {paths?.length > 0 ? (<NavBar pathList={paths} />) : path.path}
                </>
            )
        }
    }

    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="1">Codigo</FormRowColumn>
                <FormRowColumn unit="3">Nome</FormRowColumn>
                <FormRowColumn unit="2">CPF</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: Person) => {
        return (
            <FormRow>
                <FormRowColumn unit="1">{element.clientCode > -1 ? element.clientCode : "n/a"}</FormRowColumn>
                <FormRowColumn unit="3">{element.name}</FormRowColumn>
                <FormRowColumn unit="2">{handleMaskCPF(element.cpf)}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            handleSetIsLoading(true)
            fetch("api/persons/").then((res) => res.json()).then((res) => {
                setPersons(res.list ?? [])
                setIsFirst(old => false)
                handleSetIsLoading(false)
            })
        }
    })

    return (
        <>
            <ActionBar
                isHidden={!props.canSave}
                className="flex flex-row justify-end"
            >
                <Button
                    isLoading={props.isLoading}
                    onClick={handleNewClick}
                    isHidden={!props.canSave}
                    isDisabled={props.isDisabled}
                >
                    <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                </Button>
            </ActionBar>
            <ListTable
                title="Pessoas"
                isActive={index}
                list={persons}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                canDelete={props.canDelete}
                isLoading={props.isLoading}
                onShowClick={handleShowClick}
                onEditClick={handleEditClick}
                isDisabled={props.isDisabled}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />
            <WindowModal
                max
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                id="service-stage-register-modal"
                title={(handlePutModalTitle(false))}
                headerBottom={(
                    <div className="p-4 pb-0">
                        {isRegister && (
                            <PersonActionBarForm
                                person={person}
                                onSet={setPerson}
                                isLoading={props.isLoading}
                                onSetIsLoading={handleSetIsLoading}
                                onAfterSave={handleAfterSave}
                                onShowMessage={handleShowMessage}
                            />
                        )}
                        {isForShow && (
                            <ActionBar
                                className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"
                            >
                                <Button
                                    isLoading={props.isLoading}
                                    onClick={() => {
                                        handleEditClick(person)
                                    }}
                                >
                                    Editar
                                </Button>
                            </ActionBar>
                        )}
                    </div>
                )}
            >
                <>
                    {isRegister && (
                        <PersonDataForm
                            person={person}
                            onSet={setPerson}
                            isLoading={props.isLoading}
                            prevPath={(handlePutModalTitle(true))}
                        />
                    )}
                    {isForShow && (
                        <PersonView elementId={person.id} />
                    )}
                </>
            </WindowModal>
        </>
    )
}
