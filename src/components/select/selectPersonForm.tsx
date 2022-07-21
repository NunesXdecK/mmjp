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
import { handleMaskCPF, handleRemoveCPFMask } from "../../util/maskUtil";
import { defaultPerson, Person } from "../../interfaces/objectInterfaces";

interface SelectPersonFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    buttonTitle?: string,
    validationMessage?: string,
    isLocked?: boolean,
    isLoading?: boolean,
    isMultipleSelect?: boolean,
    persons?: Person[],
    onSetLoading?: (any) => void,
    onSetPersons?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectPersonForm(props: SelectPersonFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

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
        if (props.isMultipleSelect) {
            localPersons?.map((element, index) => {
                if (handleRemoveCPFMask(element.cpf) === handleRemoveCPFMask(person.cpf)) {
                    canAdd = false
                }
            })
        }

        if (canAdd) {
            if (props.isMultipleSelect) {
                localPersons = [...localPersons, person]
            } else {
                localPersons = [person]
            }
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
        if (persons.length === 0) {
            fetch("api/persons").then((res) => res.json()).then((res) => {
                setPersons(res.list)
                setPersonsForShow(res.list)
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
                subtitle={props.subtitle}>
                {!props.isLocked && (
                    <FormRow>
                        <FormRowColumn unit="6" className="justify-self-end">
                            <Button
                                type="submit"
                                isLoading={props.isLoading}
                                isDisabled={props.isLoading}
                                onClick={() => setIsOpen(true)}
                            >
                                {props.buttonTitle}
                            </Button>
                        </FormRowColumn>
                    </FormRow>
                )}

                {props.persons?.map((element, index) => (
                    <form key={index + element.dateInsertUTC + element.cpf}
                        onSubmit={(event) => handleRemovePerson(event, element)}>
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
                                <FormRowColumn unit="1"
                                    className="self-end justify-self-end">
                                    <Button
                                        type="submit"
                                        color="red"
                                        isLoading={props.isLoading}
                                        isDisabled={props.isLoading}
                                    >
                                        X
                                    </Button>
                                </FormRowColumn>
                            )}
                        </FormRow>
                    </form>
                ))}
            </Form>

            <IOSModal
                onClose={() => {
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
