import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import IOSModal from "../modal/iosModal";
import FormRowColumn from "./formRowColumn";
import PersonList from "../list/personList";
import InputText from "../inputText/inputText";
import { Person } from "../../interfaces/objectInterfaces";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleMaskCPF, handleRemoveCPFMask } from "../../util/maskUtil";

interface SelectPersonFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    buttonTitle?: string,
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
                            {props.buttonTitle}
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
                                    isLoading={props.isLoading}
                                    id={"person-cpf-" + element.cpf}
                                    value={handleMaskCPF(element.cpf)}
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
