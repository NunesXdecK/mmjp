import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import IOSModal from "../modal/iosModal";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import ImmobileList from "../list/immobileList";
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import ImmobileForm from "./immobileForm";

interface SelectImmobileFormProps {
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
    properties?: Immobile[],
    onSetProperties?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectImmobileForm(props: SelectImmobileFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const [immobile, setImmobile] = useState<Immobile>(defaultImmobile)

    const handleNewClick = () => {
        setIsRegister(true)
        setImmobile(defaultImmobile)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setImmobile(defaultImmobile)
        setIsRegister(false)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, immobile) => {
        handleAdd(immobile)
        handleBackClick()
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleAdd = (immobile) => {
        let localProperties = props.properties
        let canAdd = true

        if (props.isMultipleSelect) {
            localProperties?.map((element, index) => {
                if (element.name === immobile.name) {
                    canAdd = false
                }
            })
        }

        if (canAdd) {
            if (props.isMultipleSelect) {
                localProperties = [...localProperties, immobile]
            } else {
                localProperties = [immobile]
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

    const handleRemoveImmobile = (event, immobile) => {
        event.preventDefault()
        if (!props.isMultipleSelect) {
            props.onSetProperties([])
        } else {
            let localProperties = props.properties
            if (localProperties.length > -1) {
                let index = localProperties.indexOf(immobile)
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

                {props.properties?.map((element, index) => (
                    <form key={index + element.dateInsertUTC}
                        onSubmit={(event) => handleRemoveImmobile(event, element)}>
                        <FormRow>
                            <FormRowColumn unit="4">
                                <InputText
                                    title="Nome"
                                    isDisabled={true}
                                    value={element.name}
                                    isLoading={props.isLoading}
                                    id={"immobile-title-" + index}
                                />
                            </FormRowColumn>

                            {!props.isLocked && (
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
                            )}
                        </FormRow>
                    </form>
                ))}
            </Form>

            <IOSModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <>
                    {!isRegister ? (
                        <ImmobileList
                            haveNew={true}
                            onNewClick={handleNewClick}
                            onListItemClick={handleAdd}
                            onShowMessage={props.onShowMessage}
                        />
                    ) : (
                        <ImmobileForm
                            isBack={true}
                            immobile={immobile}
                            canMultiple={false}
                            onBack={handleBackClick}
                            title="Informações do imóvel"
                            onAfterSave={handleAfterSave}
                            onShowMessage={props.onShowMessage}
                            subtitle="Dados importantes sobre o imóvel" />
                    )}
                </>
            </IOSModal>
        </>
    )
}
