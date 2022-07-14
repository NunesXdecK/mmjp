import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import IOSModal from "../modal/iosModal";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import PropertyList from "../list/propertyList";
import { defaultProperty, Property } from "../../interfaces/objectInterfaces";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import PropertyForm from "./propertyForm";

interface SelectPropertyFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    buttonTitle?: string,
    validationMessage?: string,
    isLoading?: boolean,
    isMultipleSelect?: boolean,
    properties?: Property[],
    onSetProperties?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectPropertyForm(props: SelectPropertyFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const [property, setProperty] = useState<Property>(defaultProperty)

    const handleNewClick = () => {
        setIsRegister(true)
        setProperty(defaultProperty)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setProperty(defaultProperty)
        setIsRegister(false)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, property) => {
        handleAdd(property)
        handleBackClick()
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleAdd = (property) => {
        let localProperties = props.properties
        let canAdd = true

        if (props.isMultipleSelect) {
            localProperties?.map((element, index) => {
                if (element.name === property.name) {
                    canAdd = false
                }
            })
        }

        if (canAdd) {
            if (props.isMultipleSelect) {
                localProperties = [...localProperties, property]
            } else {
                localProperties = [property]
            }
            if (props.onSetProperties) {
                props.onSetProperties(localProperties)
                setIsOpen(false)
            }
        } else {
            let feedbackMessage: FeedbackMessage = { messages: [props?.validationMessage], messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
    }

    const handleRemoveProperty = (event, property) => {
        event.preventDefault()
        if (!props.isMultipleSelect) {
            props.onSetProperties([])
        } else {
            let localProperties = props.properties
            if (localProperties.length > -1) {
                let index = localProperties.indexOf(property)
                localProperties.splice(index, 1)
                if (props.onSetProperties) {
                    props.onSetProperties(localProperties)
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

                {props.properties?.map((element, index) => (
                    <form key={index + element.dateInsertUTC}
                        onSubmit={(event) => handleRemoveProperty(event, element)}>
                        <FormRow>
                            <FormRowColumn unit="4">
                                <InputText
                                    title="Nome"
                                    isDisabled={true}
                                    value={element.name}
                                    isLoading={props.isLoading}
                                    id={"property-title-" + index}
                                />
                            </FormRowColumn>

                            <FormRowColumn unit="2"
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
                        </FormRow>
                    </form>
                ))}
            </Form>

            <IOSModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <>
                    {!isRegister ? (
                        <PropertyList
                            haveNew={true}
                            onNewClick={handleNewClick}
                            onListItemClick={handleAdd}
                            onShowMessage={props.onShowMessage}
                             />
                    ) : (
                        <PropertyForm
                            isBack={true}
                            property={property}
                            canMultiple={false}
                            onBack={handleBackClick}
                            title="Informações da propriedade"
                            onAfterSave={handleAfterSave}
                            onShowMessage={props.onShowMessage}
                            subtitle="Dados importantes sobre a propriedade" />
                    )}
                </>
            </IOSModal>
        </>
    )
}
