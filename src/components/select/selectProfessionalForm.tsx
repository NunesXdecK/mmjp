import Form from "../form/form";
import List from "../list/list";
import FormRow from "../form/formRow";
import Button from "../button/button";
import IOSModal from "../modal/iosModal";
import { useEffect, useState } from "react";
import InputText from "../inputText/inputText";
import FormRowColumn from "../form/formRowColumn";
import ProfessionalForm from "../form/professionalForm";
import { defaultFeedbackMessage, FeedbackMessage } from "../modal/feedbackMessageModal";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { defaultProfessional, Professional } from "../../interfaces/objectInterfaces";
import FeedbackMessageText from "../modal/feedbackMessageText";

interface SelectProfessionalFormProps {
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
    professionals?: Professional[],
    onValidate?: (any) => boolean,
    onSetLoading?: (any) => void,
    onSetProfessionals?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectProfessionalForm(props: SelectProfessionalFormProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const [editIndex, setEditIndex] = useState(-1)

    const [professional, setProfessional] = useState<Professional>(defaultProfessional)

    const [professionals, setProfessionals] = useState<Professional[]>([])
    const [professionalsForShow, setProfessionalsForShow] = useState<Professional[]>([])

    const handleNewClick = () => {
        setIsRegister(true)
        setProfessional(defaultProfessional)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setProfessionals([])
        setProfessionalsForShow([])
        setProfessional(defaultProfessional)
        setIsFirst(true)
        setIsRegister(false)
    }

    const handleFilterList = (string) => {
        let listItems = [...professionals]
        let listItemsFiltered: Professional[] = []
        listItemsFiltered = listItems.filter((element: Professional, index) => {
            return element.title.toLowerCase().includes(string.toLowerCase())
        })
        setProfessionalsForShow((old) => listItemsFiltered)
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

        localProfessionals?.map((element, index) => {
            if (element.creaNumber === professional.creaNumber) {
                canAdd = false
            }
        })

        if (props.onValidate) {
            canAdd = props.onValidate(professional)
        }

        if (canAdd) {
            if (props.isMultipleSelect) {
                if (editIndex > -1) {
                    localProfessionals = [
                        ...localProfessionals.slice(0, editIndex),
                        professional,
                        ...localProfessionals.slice(editIndex + 1, localProfessionals.length),
                    ]
                } else {
                    localProfessionals = [...localProfessionals, professional]
                }
            } else {
                localProfessionals = [professional]
            }
            setEditIndex(-1)
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

    useEffect(() => {
        if (isOpen && isFirst) {
            fetch("api/professionals").then((res) => res.json()).then((res) => {
                console.log("entrou")
                if (res.list.length) {
                    setProfessionals(res.list)
                    setProfessionalsForShow(res.list)
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
                    <FormRow>
                        <FormRowColumn unit="6" className="flex flex-col items-end justify-self-end">
                            <Button
                                type="submit"
                                className="w-fit"
                                isLoading={props.isLoading}
                                isDisabled={props.isLoading}
                                onClick={() => {
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

                            <FormRowColumn unit="3" className="flex flex-row">
                                <InputText
                                    isDisabled={true}
                                    title="Número do CREA"
                                    isLoading={props.isLoading}
                                    value={element.creaNumber}
                                    id={"professional-crea-number-" + index}
                                />

                                {!props.isLocked && (
                                    <>
                                        <Button
                                            type="button"
                                            isLoading={props.isLoading}
                                            isDisabled={props.isLoading}
                                            className="ml-2 h-fit self-end"
                                            onClick={() => {
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
                                    </>
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
                                    onSelectClick={handleAdd}
                                    isLoading={props.isLoading}
                                    onNewClick={handleNewClick}
                                    list={professionalsForShow}
                                    onFilterList={handleFilterList}
                                    title={"Lista de profissionais"}
                                    onTitle={(element: Professional) => {
                                        return (<p>{element.title}</p>)
                                    }}
                                    onInfo={(element: Professional) => {
                                        return (<p>{element.title}</p>)
                                    }}
                                    onShowMessage={props.onShowMessage}
                                />
                            ) : (
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
                    )}
                </>
            </IOSModal>
        </>
    )
}
