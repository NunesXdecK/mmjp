import Form from "../form/form";
import List from "../list/list";
import Button from "../button/button";
import FormRow from "../form/formRow";
import IOSModal from "../modal/iosModal";
import { useEffect, useState } from "react";
import PersonForm from "../form/personForm";
import WindowModal from "../modal/windowModal";
import InputText from "../inputText/inputText";
import FormRowColumn from "../form/formRowColumn";
import FeedbackMessageText from "../modal/feedbackMessageText";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { handleMaskCPF, handleRemoveCPFMask } from "../../util/maskUtil";
import { defaultPerson, Person } from "../../interfaces/objectInterfaces";
import { defaultFeedbackMessage, FeedbackMessage } from "../modal/feedbackMessageModal";
import PersonView from "../view/personView";

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
    onFinishAdd?: (any?) => void,
    onSetLoading?: (any) => void,
    onSetPersons?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onValidate?: (any) => boolean,
}

export default function SelectPersonForm(props: SelectPersonFormProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const [editIndex, setEditIndex] = useState(-1)

    const [person, setPerson] = useState<Person>(defaultPerson)

    const [persons, setPersons] = useState<Person[]>([])

    const handleNewClick = () => {
        setIsRegister(true)
        setPerson(defaultPerson)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setPersons([])
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
        return listItemsFiltered
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
            if (props.onFinishAdd) {
                props.onFinishAdd()
            }
        } else {
            let feedbackMessage: FeedbackMessage = { messages: [props?.validationMessage], messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
    }

    const handleRemovePerson = () => {
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
        setPerson(defaultPerson)
    }

    useEffect(() => {
        if (isOpen && isFirst) {
            fetch("api/persons").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setPersons(res.list)
                }
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
                                type="button"
                                className="w-fit"
                                isLoading={props.isLoading}
                                isDisabled={props.isLoading}
                                onClick={(event) => {
                                    event.preventDefault()
                                    if (props.validationButton) {
                                        setIsInvalid(true)
                                        setTimeout(() => setIsInvalid((old) => false), 2000)
                                    } else {
                                        setIsOpen(true)
                                    }
                                }}
                            >
                                {props.buttonTitle}
                            </Button>
                            <FeedbackMessageText
                                isOpen={isInvalid}
                                setIsOpen={setIsInvalid}
                                feedbackMessage={
                                    {
                                        ...defaultFeedbackMessage,
                                        messages: [props.validationMessageButton],
                                        messageType: "ERROR"
                                    }} />
                        </FormRowColumn>
                    </FormRow>
                )}

                {props.persons?.map((element, index) => (
                    <form key={index + element.dateInsertUTC + element.cpf}
                        onSubmit={(event) => {
                            event.preventDefault()
                            setPerson(element)
                            setIsOpenDelete(true)
                        }}>
                        <FormRow>
                            <FormRowColumn unit="3">
                                <InputText
                                    title="Nome"
                                    isDisabled={true}
                                    value={element.name}
                                    isLoading={props.isLoading}
                                    id={"person-name-" + element.cpf}
                                />
                            </FormRowColumn>

                            <FormRowColumn unit="3" className="flex flex-col sm:flex-row">
                                <InputText
                                    mask="cpf"
                                    title="CPF"
                                    isDisabled={true}
                                    isLoading={props.isLoading}
                                    id={"person-cpf-" + element.cpf}
                                    value={handleMaskCPF(element.cpf)}
                                />

                                {!props.isLocked && (
                                    <div className="min-w-fit flex-col mt-4 sm:mt-0 self-end">
                                        <Button
                                            type="button"
                                            isLoading={props.isLoading}
                                            isDisabled={props.isLoading}
                                            className="ml-2 h-fit self-end"
                                            onClick={(event) => {
                                                event.preventDefault()
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
                                            className="ml-2 h-fit self-end"
                                        >
                                            <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                        </Button>
                                    </div>
                                )}
                            </FormRowColumn>
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
                    {isOpen && (
                        <>
                            {!isRegister ? (
                                <List
                                    haveNew
                                    canSelect
                                    autoSearch
                                    onSelectClick={handleAdd}
                                    title={"Lista de pessoas"}
                                    isLoading={props.isLoading}
                                    onNewClick={handleNewClick}
                                    onFilterList={handleFilterList}
                                    onTitle={(element: Person) => {
                                        return (
                                            <PersonView
                                                title=""
                                                hideData
                                                hideBorder
                                                hidePaddingMargin
                                                person={element}
                                            />)
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
                    )}
                </>
            </IOSModal>

            <WindowModal
                isOpen={isOpenDelete}
                setIsOpen={setIsOpenDelete}>
                <p className="text-center">Deseja realmente deletar {person.name}?</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={(event) => {
                            event.preventDefault()
                            setIsOpenDelete(false)
                        }}
                    >
                        Voltar
                    </Button>
                    <Button
                        color="red"
                        type="submit"
                        onClick={(event) => {
                            event.preventDefault()
                            handleRemovePerson()
                            setIsOpenDelete(false)
                        }}
                    >
                        Excluir
                    </Button>
                </div>
            </WindowModal>
        </>
    )
}
