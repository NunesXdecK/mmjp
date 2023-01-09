import Button from "../button/button";
import { useEffect, useState } from "react";
import WindowModal from "../modal/windowModal";
import NavBar, { NavBarPath } from "../bar/navBar";
import { XCircleIcon } from "@heroicons/react/outline";
import { PlusCircleIcon } from "@heroicons/react/solid";
import InputTextAutoComplete from "./inputTextAutocomplete";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import ImmobilePointDataForm from "../form/immobilePointDataForm";
import ImmobilePointActionBarForm from "../bar/immobilePointActionBar";
import { defaultImmobilePoint, ImmobilePoint } from "../../interfaces/objectInterfaces";

interface InputSelectImmobilePointProps {
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
    isFull?: boolean,
    notSet?: boolean,
    isHidden?: boolean,
    isLocked?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    validationButton?: boolean,
    isMultipleSelect?: boolean,
    immobilePoints?: ImmobilePoint[],
    prevPath?: NavBarPath[] | any,
    onSet?: (any) => void,
    onBlur?: (any?) => void,
    onFinishAdd?: (any?) => void,
    onSetLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onValidate?: (any) => boolean,
    onFilter?: ([], string) => any[],
}

export default function InputSelectImmobilePoint(props: InputSelectImmobilePointProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFirst, setIsFirst] = useState(true)
    const [isSelected, setIsSelected] = useState(props.value?.length > 0)
    const [isRegister, setIsRegister] = useState(false)
    const [text, setText] = useState<string>(props.value ?? "")
    const [immobilePoint, setImmobilePoint] = useState<ImmobilePoint>(defaultImmobilePoint)

    const [immobilePoints, setImmobilePoints] = useState<ImmobilePoint[]>([])

    const handleNewClick = () => {
        setIsOpen(true)
        setIsRegister(false)
        setImmobilePoint(defaultImmobilePoint)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setImmobilePoints([])
        setImmobilePoint(defaultImmobilePoint)
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

    const handleAdd = (immobilePoint: ImmobilePoint) => {
        let canAdd = true
        if (props.onValidate) {
            canAdd = props.onValidate(immobilePoint)
        }

        if (canAdd) {
            if (!props.notSet) {
                setText(
                    immobilePoint.pointId
                    + (immobilePoint.epoch?.length > 0 ? ", " + immobilePoint.epoch : "")
                )
                setIsSelected(true)
            } else {
                setText("")
            }
            if (props.onSet) {
                props.onSet(immobilePoint)
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

    const handlePutModalTitle = (short: boolean) => {
        let paths = []
        let path: NavBarPath = { path: "Nova pessoa", onClick: null }
        if (short) {
            //path = { ...path, path: "S" }
        }
        if (immobilePoint?.id > 0) {
            path = { ...path, path: "Pessoa-" + immobilePoint.pointId, onClick: null }
        }
        try {
            if (props.prevPath?.length > 0) {
                let prevPath: NavBarPath = {
                    ...props.prevPath[props.prevPath?.length - 1],
                    onClick: handleBackClick,
                    path: props.prevPath[props.prevPath?.length - 1]?.path + "/",
                }
                paths = [...props.prevPath.slice(0, props.prevPath?.length - 1), prevPath,]
            }
            paths = [...paths, path]
        } catch (err) {
            console.error(err)
        }
        if (short) {
            return paths
        } else {
            return (
                <>
                    {paths?.length > 0 ? (<NavBar pathList={paths} />) : path.path}
                </>
            )
        }
    }

    const handlePutActions = (cleanFunction?) => {
        return (
            <Button
                isLight
                isLoading={props.isLoading}
                isDisabled={props.isLoading}
                id={props.id + "-auto-complete-option-new-immobilePoint"}
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
                    Nova pessoa
                </div>
            </Button>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/immobilePoints").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setImmobilePoints(res.list)
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
                    onClickItem={handleAdd}
                    onFilter={props.onFilter}
                    sugestions={immobilePoints}
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
                            handleAdd(defaultImmobilePoint)
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
                title={(handlePutModalTitle(false))}
                id={props.id + "-window-modal-register-immobilePoint"}
                onClose={() => {
                    setIsRegister(false)
                }}
                headerBottom={(
                    <div className="p-4 pb-0">
                        <ImmobilePointActionBarForm
                            immobilePoint={immobilePoint}
                            onSet={setImmobilePoint}
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
                        <ImmobilePointDataForm
                            immobilePoint={immobilePoint}
                            onSet={setImmobilePoint}
                            isLoading={props.isLoading}
                            title="Informações pessoais"
                            onShowMessage={props.onShowMessage}
                            prevPath={(handlePutModalTitle(true))}
                            subtitle="Dados importantes sobre o usuário"
                        />
                    )}
                </>
            </WindowModal>
        </>
    )
}
