import Form from "../form/form";
import List from "../list/list";
import FormRow from "../form/formRow";
import Button from "../button/button";
import IOSModal from "../modal/iosModal";
import { useEffect, useState } from "react";
import InputText from "../inputText/inputText";
import ImmobileForm from "../form/immobileForm";
import FormRowColumn from "../form/formRowColumn";
import { defaultFeedbackMessage, FeedbackMessage } from "../modal/feedbackMessageModal";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces";
import FeedbackMessageText from "../modal/feedbackMessageText";
import WindowModal from "../modal/windowModal";

interface SelectImmobileFormProps {
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
    immobiles?: Immobile[],
    onValidate?: (any) => boolean,
    onSetLoading?: (any) => void,
    onSetImmobiles?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectImmobileForm(props: SelectImmobileFormProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isRegister, setIsRegister] = useState(false)
    const [isInvalid, setIsInvalid] = useState(props.validationButton)

    const [editIndex, setEditIndex] = useState(-1)

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
        setIsFirst(true)
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
        let localImmobiles = props.immobiles ?? []
        let canAdd = true

        localImmobiles?.map((element, index) => {
            if (element.name === immobile.name) {
                canAdd = false
            }
        })

        if (canAdd && props.onValidate) {
            canAdd = props.onValidate(immobile)
        }

        if (canAdd) {
            if (props.isMultipleSelect) {
                if (editIndex > -1) {
                    localImmobiles = [
                        ...localImmobiles.slice(0, editIndex),
                        immobile,
                        ...localImmobiles.slice(editIndex + 1, localImmobiles.length),
                    ]
                } else {
                    localImmobiles = [...localImmobiles, immobile]
                }
            } else {
                localImmobiles = [immobile]
            }
            setEditIndex(-1)
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

    const handleRemoveImmobile = () => {
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
        setImmobile(defaultImmobile)
    }

    useEffect(() => {
        if (isOpen && isFirst) {
            fetch("api/immobiles").then((res) => res.json()).then((res) => {
                if (res.list.length) {
                    setImmobiles(res.list)
                    setImmobilesForShow(res.list)
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
                    <FormRow className="">
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

                {props.immobiles?.map((element, index) => (
                    <form key={index + element.dateInsertUTC}
                        onSubmit={(event) => {
                            event.preventDefault()
                            setImmobile(element)
                            setIsOpenDelete(true)
                        }}>
                        <FormRow>
                            <FormRowColumn unit="6" className="flex flex-col sm:flex-row">
                                <InputText
                                    title="Nome"
                                    isDisabled={true}
                                    value={element.name}
                                    holderClassName="w-full"
                                    isLoading={props.isLoading}
                                    id={"immobile-title-" + index}
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
                    )}
                </>
            </IOSModal>

            <WindowModal
                isOpen={isOpenDelete}
                setIsOpen={setIsOpenDelete}>
                <p className="text-center">Deseja realmente deletar {immobile.name}?</p>
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
                            handleRemoveImmobile()
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
