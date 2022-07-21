import Form from "../form/form";
import List from "../list/list";
import FormRow from "../form/formRow";
import Button from "../button/button";
import IOSModal from "../modal/iosModal";
import { useEffect, useState } from "react";
import InputText from "../inputText/inputText";
import ImmobileForm from "../form/immobileForm";
import FormRowColumn from "../form/formRowColumn";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces";

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
    onSetLoading?: (any) => void,
    onSetProperties?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectImmobileForm(props: SelectImmobileFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const [immobile, setImmobile] = useState<Immobile>(defaultImmobile)
    
    const [immobiles, setImmobiles] = useState<Immobile[]>([])
    const [immobilesForShow, setImmobilesForShow] = useState<Immobile[]>([])

    const handleNewClick = () => {
        setIsRegister(true)
        setImmobile(defaultImmobile)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setImmobiles([])
        setImmobilesForShow([])
        setImmobile(defaultImmobile)
        setIsRegister(false)
    }

    const handleFilterList = (string) => {
        let listItems = [...immobiles]
        let listItemsFiltered: Immobile[] = []
        listItemsFiltered = listItems.filter((element: Immobile, index) => {
            return element.name.toLowerCase().includes(string.toLowerCase())
        })
        setImmobilesForShow((old) => listItemsFiltered)
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

    useEffect(() => {
        if (immobiles.length === 0) {
            fetch("api/immobiles").then((res) => res.json()).then((res) => {
                setImmobiles(res.list)
                setImmobilesForShow(res.list)
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
                        <List
                            haveNew
                            canSelect
                            autoSearch
                            list={immobilesForShow}
                            onSelectClick={handleAdd}
                            title={"Lista de imóveis"}
                            isLoading={props.isLoading}
                            onNewClick={handleNewClick}
                            onFilterList={handleFilterList}
                            onTitle={(element: Immobile) => {
                                return (<p>{element.name}</p>)
                            }}
                            onInfo={(element: Immobile) => {
                                return (<p>{element.name}</p>)
                            }}
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
