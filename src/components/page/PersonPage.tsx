import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { handleMaskCPF } from "../../util/maskUtil"
import PersonDataForm from "../form/personDataForm"
import PersonActionBarForm from "../bar/personActionBar"
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { Person, defaultPerson } from "../../interfaces/objectInterfaces"

interface PersonPageProps {
    id?: string,
    serviceId?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canUpdate?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    onSetPage?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function PersonPage(props: PersonPageProps) {
    const [person, setPerson] = useState<Person>(defaultPerson)
    const [persons, setPersons] = useState<Person[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo || props.serviceId === undefined)
    const [isLoading, setIsLoading] = useState(props.getInfo || props.serviceId === undefined)
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

    const handleDeleteClick = async (person, index) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/personNew", {
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
        setIsLoading(false)
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
        setIsLoading(true)
        setPerson({ ...defaultPerson, ...project })
        setIsForShow(true)
        setIsLoading(false)
    }

    const handleEditClick = async (person, index?) => {
        setIsLoading(true)
        setIsForShow(false)
        let localPerson: Person = await fetch("api/person/" + person?.id).then((res) => res.json()).then((res) => res.data)
        localPerson = {
            ...localPerson,
        }
        setIsLoading(false)
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
                <FormRowColumn unit="1">{element.clientCode?.length > 0 ? element.clientCode : "n/a"}</FormRowColumn>
                <FormRowColumn unit="3">{element.name}</FormRowColumn>
                <FormRowColumn unit="2">{handleMaskCPF(element.cpf)}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.serviceId?.length > 0) {
                fetch("api/persons/" + props.serviceId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    if (res.list.length) {
                        setPersons(res.list)
                    }
                    setIsLoading(false)
                })
            } else if (props.serviceId === undefined) {
                fetch("api/persons").then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    if (res.list.length) {
                        setPersons(res.list)
                    }
                    setIsLoading(false)
                })
            }
        }
    })

    return (
        <>
            <ActionBar className="flex flex-row justify-end">
                <Button
                    isLoading={isLoading}
                    isHidden={!props.canUpdate}
                    isDisabled={props.isDisabled}
                    onClick={() => {
                        setIndex(-1)
                        setIsFirst(true)
                        setIsLoading(true)
                        handleBackClick()
                    }}
                >
                    <RefreshIcon className="block h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                    isLoading={isLoading}
                    onClick={handleNewClick}
                    isHidden={!props.canSave}
                    isDisabled={props.isDisabled}
                >
                    <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                </Button>
            </ActionBar>
            <ListTable
                title="Etapas"
                isActive={index}
                list={persons}
                isLoading={isLoading}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                onShowClick={handleShowClick}
                onEditClick={handleEditClick}
                isDisabled={props.isDisabled}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />
            <WindowModal
                max
                title="Etapas"
                id="service-stage-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                headerBottom={(
                    <>
                        {isRegister && (
                            <div className="p-4 pb-0">
                                <PersonActionBarForm
                                    person={person}
                                    onSet={setPerson}
                                    isLoading={isLoading}
                                    onSetIsLoading={setIsLoading}
                                    onAfterSave={handleAfterSave}
                                    onShowMessage={handleShowMessage}
                                />
                            </div>
                        )}
                        {isForShow && (
                            <ActionBar
                                className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"
                            >
                                <Button
                                    isLoading={isLoading}
                                    onClick={() => {
                                        handleEditClick(person)
                                    }}
                                >
                                    Editar
                                </Button>
                            </ActionBar>
                        )}
                    </>
                )}
            >
                <>
                    {isRegister && (
                        <PersonDataForm
                            person={person}
                            onSet={setPerson}
                            isLoading={isLoading}
                        />
                    )}
                    {isForShow && (
                        <></>
                    )}
                </>
            </WindowModal>
        </>
    )
}
