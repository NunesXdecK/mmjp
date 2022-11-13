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
import CompanyDataForm from "../form/companyDataForm";
import PersonDataForm from "../form/personDataForm";
import PersonActionBarForm from "../bar/personActionBar";
import CompanyActionBarForm from "../bar/companyActionBar";

interface InputSelectPersonCompanyProps {
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
    onFilter?: ([], string) => any[],
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

    const handleAdd = (personOrCompany: (Person | Company)) => {
        let canAdd = true
        if (props.onValidate) {
            canAdd = props.onValidate(personOrCompany)
        }

        if (canAdd) {
            if (!props.notSet) {
                setText(personOrCompany.name)
                setIsSelected(true)
            } else {
                setText("")
            }
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
                    className="py-4 rounded-none text-left shadow-none w-full text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 "
                    onClick={() => {
                        handleNewClickPerson()
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
                <Button
                    isLight
                    isLoading={props.isLoading}
                    isDisabled={props.isLoading}
                    id={props.id + "-auto-complete-option-new-company"}
                    className="py-4 rounded-none text-left shadow-none w-full text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => {
                        handleNewClickCompany()
                        if (cleanFunction) {
                            cleanFunction("")
                        }
                    }}
                >
                    <div className="w-full text-left flex flex-row gap-1">
                        <PlusCircleIcon className="text-indigo-600 dark:text-gray-200 block h-5 w-5" aria-hidden="true" />
                        Nova empresa
                    </div>
                </Button>
            </>
        )
    }

    useEffect(() => {
        if (isFirst) {
            let url = "api/personsAndCompanies"
            if (props.isFull) {
                url = "api/personsAndCompaniesFull"
            }
            fetch(url).then((res) => res.json()).then((res) => {
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
                    onFilter={props.onFilter}
                    isLoading={props.isLoading}
                    placeholder={props.placeholder}
                    sugestions={personsAndCompanies}
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
                            handleAdd(defaultPerson)
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
                id={props.id + "-window-modal-register-person-company"}
                onClose={() => {
                    setIsRegisterPerson(false)
                    setIsRegisterCompany(false)
                }}
                headerBottom={(
                    <>
                        {isOpen && (
                            <>
                                {isRegisterPerson && (
                                    <div className="p-4 pb-0">
                                        <PersonActionBarForm
                                            person={person}
                                            onSet={setPerson}
                                            isLoading={props.isLoading}
                                            onAfterSave={handleAfterSave}
                                            onSetIsLoading={props.onSetLoading}
                                            onShowMessage={props.onShowMessage}
                                        />
                                    </div>
                                )}
                                {isRegisterCompany && (
                                    <div className="p-4 pb-0">
                                        <CompanyActionBarForm
                                            company={company}
                                            onSet={setCompany}
                                            isLoading={props.isLoading}
                                            onAfterSave={handleAfterSave}
                                            onSetIsLoading={props.onSetLoading}
                                            onShowMessage={props.onShowMessage}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            >
                <>
                    {isOpen && (
                        <>
                            {isRegisterPerson && (
                                <PersonDataForm
                                    person={person}
                                    onSet={setPerson}
                                    title="Informações pessoais"
                                    onShowMessage={props.onShowMessage}
                                    subtitle="Dados importantes sobre o usuário" />
                            )}
                            {isRegisterCompany && (
                                <CompanyDataForm
                                    company={company}
                                    onSet={setCompany}
                                    title="Informações empresariais"
                                    onShowMessage={props.onShowMessage}
                                    subtitle="Dados importantes sobre a empresa" />
                            )}
                        </>
                    )}
                </>
            </WindowModal>
        </>
    )
}
