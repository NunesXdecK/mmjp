import Button from "../button/button";
import { useEffect, useState } from "react";
import WindowModal from "../modal/windowModal";
import { XCircleIcon } from "@heroicons/react/outline";
import { PlusCircleIcon } from "@heroicons/react/solid";
import InputTextAutoComplete from "./inputTextAutocomplete";
import ProfessionalDataForm from "../form/professionalDataForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import ProfessionalActionBarForm from "../bar/professionalActionBar";
import { defaultProfessional, Professional } from "../../interfaces/objectInterfaces";

interface InputSelectProfessionalProps {
    id?: string,
    title?: string,
    value?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    buttonTitle?: string,
    placeholder?: string,
    formClassName?: string,
    validationMessage?: string,
    validationMessageButton?: string,
    notSet?: boolean,
    isLocked?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    validationButton?: boolean,
    isMultipleSelect?: boolean,
    professionals?: Professional[],
    onSet?: (any) => void,
    onBlur?: (any?) => void,
    onFinishAdd?: (any?) => void,
    onSetLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onValidate?: (any) => boolean,
    onFilter?: ([], string) => any[],
}

export default function InputSelectProfessional(props: InputSelectProfessionalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFirst, setIsFirst] = useState(true)
    const [isSelected, setIsSelected] = useState(props.value?.length > 0)
    const [isRegister, setIsRegister] = useState(false)

    const [text, setText] = useState<string>(props.value ?? "")
    const [professional, setProfessional] = useState<Professional>(defaultProfessional)

    const [professionals, setProfessionals] = useState<Professional[]>([])

    const handleNewClick = () => {
        setIsOpen(true)
        setIsRegister(false)
        setProfessional(defaultProfessional)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setProfessionals([])
        setProfessional(defaultProfessional)
        setIsOpen(false)
        setIsFirst(true)
        setIsRegister(false)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, element) => {
        handleAdd(element)
        handleBackClick()
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleAdd = (professional: Professional) => {
        let canAdd = true
        if (props.onValidate) {
            canAdd = props.onValidate(professional)
        }

        if (canAdd) {
            if (!props.notSet) {
                setText(professional.title)
                setIsSelected(true)
            } else {
                setText("")
            }
            if (props.onSet) {
                props.onSet(professional)
                setIsOpen(false)
            }
            if (props.onFinishAdd) {
                props.onFinishAdd()
            }
        } else {
            let feedbackMessage: FeedbackMessage = { messages: [props?.validationMessage], messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
    }

    const handlePutActions = (cleanFunction?) => {
        return (
            <Button
                isLight
                isLoading={props.isLoading}
                isDisabled={props.isLoading}
                id={props.id + "-auto-complete-option-new-person"}
                className="py-4 rounded-none text-left shadow-none w-full text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 "
                onClick={() => {
                    handleNewClick()
                    if (cleanFunction) {
                        cleanFunction("")
                    }
                }}
            >
                <div className="w-full text-left flex flex-row gap-1">
                    <PlusCircleIcon className="text-indigo-600 dark:text-gray-200 block h-5 w-5" aria-hidden="true" />
                    Novo profissional
                </div>
            </Button>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/professionals").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setProfessionals(res.list)
                }
                if (props.onSetLoading) {
                    props.onSetLoading(false)
                }
            })
        }
    })

    return (
        <>
            <div className="relative">
                <InputTextAutoComplete
                    value={text}
                    id={props.id}
                    title={props.title}
                    onSetText={setText}
                    onBlur={props.onBlur}
                    sugestions={professionals}
                    onClickItem={handleAdd}
                    onFilter={props.onFilter}
                    isLoading={props.isLoading}
                    placeholder={props.placeholder}
                    onListOptions={handlePutActions}
                    isDisabled={isSelected || props.isDisabled}
                />
                {isSelected && (
                    <Button
                        isLight
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        className="p-0 top-8 right-2 absolute"
                        onClick={() => {
                            setText("")
                            handleAdd(defaultProfessional)
                            setIsSelected(false)
                        }}
                    >
                        <XCircleIcon className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 h-6 w-6" aria-hidden="true" />
                    </Button>
                )}
            </div>
            <WindowModal
                max
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                id={props.id + "-window-modal-register-professional"}
                onClose={() => {
                    setIsRegister(false)
                }}
                headerBottom={(
                    <div className="p-4 pb-0">
                        <ProfessionalActionBarForm
                            onSet={setProfessional}
                            professional={professional}
                            isLoading={props.isLoading}
                            onAfterSave={handleAfterSave}
                            onSetIsLoading={props.onSetLoading}
                            onShowMessage={props.onShowMessage}
                        />
                    </div>
                )}
            >
                <>
                    {isOpen && (
                        <ProfessionalDataForm
                            onSet={setProfessional}
                            professional={professional}
                            title="Informações pessoais"
                            onShowMessage={props.onShowMessage}
                            subtitle="Dados importantes sobre o usuário" />
                    )}
                </>
            </WindowModal>
        </>
    )
}
