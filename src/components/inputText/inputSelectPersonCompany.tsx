import Button from "../button/button";
import PersonForm from "../form/personForm";
import { useEffect, useState } from "react";
import CompanyForm from "../form/companyForm";
import WindowModal from "../modal/windowModal";
import { XCircleIcon } from "@heroicons/react/outline";
import { PlusCircleIcon } from "@heroicons/react/solid";
import InputTextAutoComplete from "./inputTextAutocomplete";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { Company, defaultCompany, defaultPerson, Person } from "../../interfaces/objectInterfaces";

interface InputSelectPersonCompanyProps {
    id?: string,
    title?: string,
    value?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    buttonTitle?: string,
    formClassName?: string,
    validationMessage?: string,
    validationMessageButton?: string,
    isLocked?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    validationButton?: boolean,
    isMultipleSelect?: boolean,
    personsAndCompanies?: Person[],
    onSet?: (any) => void,
    onBlur?: (any?) => void,
    onFinishAdd?: (any?) => void,
    onSetLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onValidate?: (any) => boolean,
}

export default function InputSelectPersonCompany(props: InputSelectPersonCompanyProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFirst, setIsFirst] = useState(true)
    const [isSelected, setIsSelected] = useState(props.value?.length > 0)
    const [isRegisterPerson, setIsRegisterPerson] = useState(false)
    const [isRegisterCompany, setIsRegisterCompany] = useState(false)

    const [text, setText] = useState<string>(props.value ?? "")
    const [person, setPerson] = useState<Person>(defaultPerson)
    const [company, setCompany] = useState<Company>(defaultCompany)

    const [personsAndCompanies, setPersonsAndCompanies] = useState<(Person | Company)[]>([])

    const handleNewClickPerson = () => {
        setIsOpen(true)
        setIsRegisterCompany(false)
        setIsRegisterPerson(true)
        setPerson(defaultPerson)
    }

    const handleNewClickCompany = () => {
        setIsOpen(true)
        setIsRegisterCompany(true)
        setIsRegisterPerson(false)
        setCompany(defaultCompany)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setPersonsAndCompanies([])
        setPerson(defaultPerson)
        setCompany(defaultCompany)
        setIsOpen(false)
        setIsFirst(true)
        setIsRegisterPerson(false)
        setIsRegisterCompany(false)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, element) => {
        handleAdd(element)
        handleBackClick()
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleAdd = (personOrCompany) => {
        let canAdd = true
        if (props.onValidate) {
            canAdd = props.onValidate(personOrCompany)
        }

        if (canAdd) {
            setText(personOrCompany.name)
            setIsSelected(true)
            if (props.onSet) {
                props.onSet(personOrCompany)
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
            <>
                <Button
                    isLight
                    isLoading={props.isLoading}
                    isDisabled={props.isLoading}
                    id={props.id + "-auto-complete-option-new-person"}
                    className="py-4 rounded-none text-left shadow-none w-full text-gray-700 "
                    onClick={() => {
                        handleNewClickPerson()
                        if (cleanFunction) {
                            cleanFunction("")
                        }
                    }}
                >
                    <div className="w-full text-left flex flex-row gap-1">
                        <PlusCircleIcon className="text-indigo-600 block h-5 w-5" aria-hidden="true" />
                        Nova pessoa
                    </div>
                </Button>
                <Button
                    isLight
                    isLoading={props.isLoading}
                    isDisabled={props.isLoading}
                    id={props.id + "-auto-complete-option-new-company"}
                    className="py-4 rounded-none text-left shadow-none w-full text-gray-700 "
                    onClick={() => {
                        handleNewClickCompany()
                        if (cleanFunction) {
                            cleanFunction("")
                        }
                    }}
                >
                    <div className="w-full text-left flex flex-row gap-1">
                        <PlusCircleIcon className="text-indigo-600 block h-5 w-5" aria-hidden="true" />
                        Nova empresa
                    </div>
                </Button>
            </>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/personsAndCompanies").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setPersonsAndCompanies(res.list)
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
                    isLoading={props.isLoading}
                    sugestions={personsAndCompanies}
                    onListOptions={handlePutActions}
                    isDisabled={isSelected || props.isDisabled}
                />
                {isSelected && (
                    <Button
                        isLight
                        className="p-0 top-8 right-2 absolute"
                        onClick={() => {
                            setText("")
                            handleAdd(defaultPerson)
                            setIsSelected(false)
                        }}
                    >
                        <XCircleIcon className="hover:text-gray-100 text-gray-400 h-6 w-6" aria-hidden="true" />
                    </Button>
                )}
            </div>

            <WindowModal
                max
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onClose={() => {
                    setIsRegisterPerson(false)
                    setIsRegisterCompany(false)
                }}
            >
                <>
                    {isOpen && (
                        <>
                            {isRegisterPerson && (
                                <PersonForm
                                    isBack={true}
                                    person={person}
                                    canMultiple={false}
                                    onBack={handleBackClick}
                                    title="Informações pessoais"
                                    onAfterSave={handleAfterSave}
                                    onShowMessage={props.onShowMessage}
                                    subtitle="Dados importantes sobre a pessoa" />
                            )}
                            {isRegisterCompany && (
                                <CompanyForm
                                    isBack={true}
                                    company={company}
                                    canMultiple={false}
                                    onBack={handleBackClick}
                                    title="Informações pessoais"
                                    onAfterSave={handleAfterSave}
                                    onShowMessage={props.onShowMessage}
                                    subtitle="Dados importantes sobre a pessoa" />
                            )}
                        </>
                    )}
                </>
            </WindowModal>
        </>
    )
}
