import Form from "../form/form";
import List from "../list/list";
import Button from "../button/button";
import FormRow from "../form/formRow";
import IOSModal from "../modal/iosModal";
import { useEffect, useState } from "react";
import PersonForm from "../form/personForm";
import InputText from "../inputText/inputText";
import FormRowColumn from "../form/formRowColumn";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { handleMaskCPF, handleRemoveCPFMask } from "../../util/maskUtil";
import { defaultPerson, Person } from "../../interfaces/objectInterfaces";

interface SelectPersonFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    buttonTitle?: string,
    formClassName?: string,
    validationMessage?: string,
    validationMessageButton?: string,
    isLocked?: boolean,
    isLoading?: boolean,
    validationButton?: boolean,
    isMultipleSelect?: boolean,
    persons?: Person[],
    onValidate?: (any) => boolean,
    onSetLoading?: (any) => void,
    onSetPersons?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectPersonForm(props: SelectPersonFormProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const [editIndex, setEditIndex] = useState(-1)

    const [person, setPerson] = useState<Person>(defaultPerson)

    const [persons, setPersons] = useState<Person[]>([])
    const [personsForShow, setPersonsForShow] = useState<Person[]>([])

    const handleNewClick = () => {
        setIsRegister(true)
        setPerson(defaultPerson)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setPersons([])
        setPersonsForShow([])
        setPerson(defaultPerson)
        setIsFirst(true)
        setIsRegister(false)
    }

    const handleFilterList = (string) => {
        let listItems = [...persons]
        let listItemsFiltered: Person[] = []
        listItemsFiltered = listItems.filter((element: Person, index) => {
            return element.name.toLowerCase().includes(string.toLowerCase())
        })
        setPersonsForShow((old) => listItemsFiltered)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, person) => {
        handleAdd(person)
        handleBackClick()
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleAdd = (person) => {
        let localPersons = props.persons
        let canAdd = true
        localPersons?.map((element, index) => {
            if (handleRemoveCPFMask(element.cpf) === handleRemoveCPFMask(person.cpf)) {
                canAdd = false
            }
        })

        if (props.onValidate) {
            canAdd = props.onValidate(person)
        }

        if (canAdd) {
            if (props.isMultipleSelect) {
                if (editIndex > -1) {
                    localPersons = [
                        ...localPersons.slice(0, editIndex),
                        person,
                        ...localPersons.slice(editIndex + 1, localPersons.length),
                    ]
                } else {
                    localPersons = [...localPersons, person]
                }
            } else {
                localPersons = [person]
            }
            setEditIndex(-1)
            if (props.onSetPersons) {
                props.onSetPersons(localPersons)
                setIsOpen(false)
            }
        } else {
            let feedbackMessage: FeedbackMessage = { messages: [props?.validationMessage], messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
    }

    const handleRemovePerson = (event, person) => {
        event.preventDefault()
        if (!props.isMultipleSelect) {
            props.onSetPersons([])
        } else {
            let localPersons = props.persons
            if (localPersons.length > -1) {
                let index = localPersons.indexOf(person)
                localPersons.splice(index, 1)
                if (props.onSetPersons) {
                    props.onSetPersons(localPersons)
                }
            }
        }
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/persons").then((res) => res.json()).then((res) => {
                if (res.list.length) {
                    setPersons(res.list)
                    setPersonsForShow(res.list)
                }
                setIsFirst(false)
                if (props.onSetLoading) {
                    props.onSetLoading(false)
                }
            })
        }
    })

    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}
                className={props.formClassName}
            >
                {!props.isLocked && (
                    <FormRow>
                        <FormRowColumn unit="6" className="flex flex-col items-end justify-self-end">
                            <Button
                                type="submit"
                                className="w-fit"
                                isLoading={props.isLoading}
                                isDisabled={props.isLoading}
                                onClick={() => {
                                    if (props.validationButton) {
                                        setIsInvalid(true)
                                    } else {
                                        setIsOpen(true)
                                    }
                                }}
                            >
                                {props.buttonTitle}
                            </Button>
                            {isInvalid && (
                                <span className="mt-2 text-red-600">{props.validationMessageButton}</span>
                            )}
                        </FormRowColumn>
                    </FormRow>
                )}

                {props.persons?.map((element, index) => (
                    <form key={index + element.dateInsertUTC + element.cpf}
                        onSubmit={(event) => handleRemovePerson(event, element)}>
                        <FormRow>
                            <FormRowColumn unit="2">
                                <InputText
                                    title="Nome"
                                    isDisabled={true}
                                    value={element.name}
                                    isLoading={props.isLoading}
                                    id={"person-name-" + element.cpf}
                                />
                            </FormRowColumn>

                            <FormRowColumn unit="2">
                                <InputText
                                    mask="cpf"
                                    title="CPF"
                                    isDisabled={true}
                                    isLoading={props.isLoading}
                                    id={"person-cpf-" + element.cpf}
                                    value={handleMaskCPF(element.cpf)}
                                />
                            </FormRowColumn>

                            {!props.isLocked && (
                                <FormRowColumn unit="2"
                                    className="flex flex-row gap-2 self-end justify-self-end">
                                    <Button
                                        type="button"
                                        isLoading={props.isLoading}
                                        isDisabled={props.isLoading}
                                        onClick={() => {
                                            setEditIndex(index)
                                            setIsOpen(true)
                                        }}
                                    >
                                        <PencilAltIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="red"
                                        isLoading={props.isLoading}
                                        isDisabled={props.isLoading}
                                    >
                                        <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                    </Button>
                                </FormRowColumn>
                            )}
                        </FormRow>
                    </form>
                ))}
            </Form>

            <IOSModal
                onClose={() => {
                    setIsOpen(false)
                    setIsRegister(false)
                }}
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <>
                    {!isRegister ? (
                        <List
                            haveNew
                            canSelect
                            autoSearch
                            list={personsForShow}
                            onSelectClick={handleAdd}
                            title={"Lista de pessoas"}
                            isLoading={props.isLoading}
                            onNewClick={handleNewClick}
                            onFilterList={handleFilterList}
                            onTitle={(element: Person) => {
                                return (<p>{element.name}</p>)
                            }}
                            onInfo={(element: Person) => {
                                return (<p>{element.name}</p>)
                            }}
                            onShowMessage={props.onShowMessage}
                        />
                    ) : (
                        <PersonForm
                            isBack={true}
                            person={person}
                            canMultiple={false}
                            onBack={handleBackClick}
                            title="Informações pessoais"
                            onAfterSave={handleAfterSave}
                            onShowMessage={props.onShowMessage}
                            subtitle="Dados importantes sobre a pessoa" />
                    )}
                </>
            </IOSModal>
        </>
    )
}
