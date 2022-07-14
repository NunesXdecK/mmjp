import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import IOSModal from "../modal/iosModal";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import ProfessionalForm from "./professionalForm";
import ProfessionalList from "../list/professionalList";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { defaultProfessional, Professional } from "../../interfaces/objectInterfaces";

interface SelectProfessionalFormProps {
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
    professionals?: Professional[],
    onSetProfessionals?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectProfessionalForm(props: SelectProfessionalFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const [professional, setProfessional] = useState<Professional>(defaultProfessional)

    const handleNewClick = () => {
        setIsRegister(true)
        setProfessional(defaultProfessional)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setProfessional(defaultProfessional)
        setIsRegister(false)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, professional) => {
        handleAdd(professional)
        handleBackClick()
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleAdd = (professional) => {
        let localProfessionals = props.professionals
        let canAdd = true

        if (props.isMultipleSelect) {
            localProfessionals?.map((element, index) => {
                if (element.creaNumber === professional.creaNumber) {
                    canAdd = false
                }
            })
        }

        if (canAdd) {
            if (props.isMultipleSelect) {
                localProfessionals = [...localProfessionals, professional]
            } else {
                localProfessionals = [professional]
            }
            if (props.onSetProfessionals) {
                props.onSetProfessionals(localProfessionals)
                setIsOpen(false)
            }
        } else {
            let feedbackMessage: FeedbackMessage = { messages: [props?.validationMessage], messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
    }

    const handleRemoveProfessional = (event, professional) => {
        event.preventDefault()
        if (!props.isMultipleSelect) {
            props.onSetProfessionals([])
        } else {
            let localProfessionals = props.professionals
            if (localProfessionals.length > -1) {
                let index = localProfessionals.indexOf(professional)
                localProfessionals.splice(index, 1)
                if (props.onSetProfessionals) {
                    props.onSetProfessionals(localProfessionals)
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

                {props.professionals?.map((element, index) => (
                    <form key={index + element.dateInsertUTC}
                        onSubmit={(event) => handleRemoveProfessional(event, element)}>
                        <FormRow>
                            <FormRowColumn unit="3">
                                <InputText
                                    title="Titulo"
                                    isDisabled={true}
                                    value={element.title}
                                    isLoading={props.isLoading}
                                    id={"professional-title-" + index}
                                />
                            </FormRowColumn>

                            <FormRowColumn unit="2">
                                <InputText
                                    title="Número do CREA"
                                    isDisabled={true}
                                    isLoading={props.isLoading}
                                    id={"professional-crea-number-" + index}
                                    value={element.creaNumber}
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
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <>
                    {!isRegister ? (
                        <ProfessionalList
                            haveNew={true}
                            onNewClick={handleNewClick}
                            onListItemClick={handleAdd}
                            onShowMessage={props.onShowMessage}
                        />) : (
                        <ProfessionalForm
                            isBack={true}
                            canMultiple={false}
                            onBack={handleBackClick}
                            professional={professional}
                            onAfterSave={handleAfterSave}
                            title="Informações do profisisonal"
                            onShowMessage={props.onShowMessage}
                            subtitle="Dados importantes sobre o profissional" />
                    )}
                </>
            </IOSModal>
        </>
    )
}
