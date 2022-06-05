import Form from "./form";
import FormRow from "./formRow";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { Person } from "../../interfaces/objectInterfaces";
import { useState } from "react";
import IOSModal from "../modal/iosModal";
import PersonList from "../list/personList";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleRemoveCPFMask } from "../../util/maskUtil";

interface SelectPersonFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    validationMessage?: string,
    isLoading?: boolean,
    isMultipleSelect?: boolean,
    persons?: Person[],
    onSetPersons?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectPersonForm(props: SelectPersonFormProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleAddPerson = (person) => {
        let localPersons = props.persons
        let canAdd = true
        localPersons?.map((element, index) => {
            if (handleRemoveCPFMask(element.cpf) === handleRemoveCPFMask(person.cpf)) {
                canAdd = false
            }
        })
        if (canAdd) {
            localPersons = [...localPersons, person]
            if (props.onSetPersons) {
                props.onSetPersons(localPersons)
                setIsOpen(false)
            }
        } else {
            let feedbackMessage: FeedbackMessage = { messages: ["Esta pessoa já é um proprietário"], messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
    }

    const handleRemovePerson = (event, person) => {
        event.preventDefault()
        let localPersons = props.persons
        if (localPersons.length > -1) {
            let index = localPersons.indexOf(person)
            localPersons.splice(index, 1)
            if (props.onSetPersons) {
                props.onSetPersons(localPersons)
            }
        }
    }

    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>
                <FormRow>
                    <FormRowColumn unit="6" className="justify-self-end">
                        <Button
                            type="submit"
                            isLoading={props.isLoading}
                            isDisabled={props.isLoading}
                            onClick={() => setIsOpen(true)}
                        >
                            Pesquisar proprietário
                        </Button>
                    </FormRowColumn>
                </FormRow>

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
                                    value={element.cpf}
                                    isLoading={props.isLoading}
                                    id={"person-cpf-" + element.cpf}
                                />
                            </FormRowColumn>

                            <FormRowColumn unit="1"
                                className="self-end">
                                <Button
                                    type="submit"
                                    color="red"
                                    isLoading={props.isLoading}
                                    isDisabled={props.isLoading}
                                >
                                    X
                                </Button>
                            </FormRowColumn>
                        </FormRow>
                    </form>
                ))}
            </Form>

            <IOSModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <PersonList
                    onListItemClick={handleAddPerson} />
            </IOSModal>
        </>
    )
}
