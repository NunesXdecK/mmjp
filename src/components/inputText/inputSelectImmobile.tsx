import Button from "../button/button";
import { useEffect, useState } from "react";
import WindowModal from "../modal/windowModal";
import ImmobileForm from "../form/immobileForm";
import { XCircleIcon } from "@heroicons/react/outline";
import { PlusCircleIcon } from "@heroicons/react/solid";
import InputTextAutoComplete from "./inputTextAutocomplete";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces";
import ImmobileActionBarForm from "../bar/immobileActionBar";
import ImmobileDataForm from "../form/immobileDataForm";

interface InputSelectImmobileProps {
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
    immobiles?: Immobile[],
    onSet?: (any) => void,
    onBlur?: (any?) => void,
    onFinishAdd?: (any?) => void,
    onSetLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onValidate?: (any) => boolean,
    onFilter?: ([], string) => any[],
}

export default function InputSelectImmobile(props: InputSelectImmobileProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFirst, setIsFirst] = useState(true)
    const [isSelected, setIsSelected] = useState(props.value?.length > 0)
    const [isRegister, setIsRegister] = useState(false)

    const [text, setText] = useState<string>(props.value ?? "")
    const [immobile, setImmobile] = useState<Immobile>(defaultImmobile)

    const [immobiles, setImmobiles] = useState<Immobile[]>([])

    const handleNewClick = () => {
        setIsOpen(true)
        setIsRegister(false)
        setImmobile(defaultImmobile)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setImmobiles([])
        setImmobile(defaultImmobile)
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

    const handleAdd = (immobile: Immobile) => {
        let canAdd = true
        if (props.onValidate) {
            canAdd = props.onValidate(immobile)
        }

        if (canAdd) {
            if (!props.notSet) {
                setText(immobile.name)
                setIsSelected(true)
            } else {
                setText("")
            }
            if (props.onSet) {
                props.onSet(immobile)
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
                    Novo imóvel
                </div>
            </Button>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/immobiles").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setImmobiles(res.list)
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
                    sugestions={immobiles}
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
                            handleAdd(defaultImmobile)
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
                id={props.id + "-window-modal-register-immobile"}
                onClose={() => {
                    setIsRegister(false)
                }}
                headerBottom={(
                    <div className="p-4 pb-0">
                        <ImmobileActionBarForm
                            immobile={immobile}
                            onSet={setImmobile}
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
                        <ImmobileDataForm
                            immobile={immobile}
                            onSet={setImmobile}
                            title="Informações pessoais"
                            onShowMessage={props.onShowMessage}
                            subtitle="Dados importantes sobre o usuário" />
                    )}
                </>
            </WindowModal>
        </>
    )
}
