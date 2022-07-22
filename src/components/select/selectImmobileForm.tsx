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
import { TrashIcon } from "@heroicons/react/outline";

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
    immobiles?: Immobile[],
    onValidate?: (any) => boolean,
    onSetLoading?: (any) => void,
    onSetImmobiles?: (array) => void,
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
        let localImmobiles = props.immobiles
        let canAdd = true

        if (props.isMultipleSelect) {
            localImmobiles?.map((element, index) => {
                if (element.name === immobile.name) {
                    canAdd = false
                }
            })
        }

        if (props.onValidate) {
            canAdd = props.onValidate(immobile)
        }

        if (canAdd) {
            if (props.isMultipleSelect) {
                localImmobiles = [...localImmobiles, immobile]
            } else {
                localImmobiles = [immobile]
            }
            if (props.onSetImmobiles) {
                props.onSetImmobiles(localImmobiles)
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
            props.onSetImmobiles([])
        } else {
            let localImmobiles = props.immobiles
            if (localImmobiles.length > -1) {
                let index = localImmobiles.indexOf(immobile)
                localImmobiles.splice(index, 1)
                if (props.onSetImmobiles) {
                    props.onSetImmobiles(localImmobiles)
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

                {props.immobiles?.map((element, index) => (
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
                                        <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
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
