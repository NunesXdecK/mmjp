import Button from "../button/button";
import IOSModal from "../modal/iosModal";
import PersonForm from "../form/personForm";
import { useEffect, useState } from "react";
import CompanyForm from "../form/companyForm";
import { PlusCircleIcon } from "@heroicons/react/solid";
import InputTextAutoComplete from "./inputTextAutocomplete";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { Company, defaultCompany, defaultPerson, Person } from "../../interfaces/objectInterfaces";
import WindowModal from "../modal/windowModal";

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
    validationButton?: boolean,
    isMultipleSelect?: boolean,
    personsAndCompanies?: Person[],
    onFinishAdd?: (any?) => void,
    onSetLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onSetPersonsAndCompanies?: (array) => void,
    onValidate?: (any) => boolean,
}

export default function InputSelectPersonCompany(props: InputSelectPersonCompanyProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFirst, setIsFirst] = useState(true)
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
            if (props.onSetPersonsAndCompanies) {
                props.onSetPersonsAndCompanies([personOrCompany])
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
                    onClick={() => {
                        handleNewClickPerson()
                        if (cleanFunction) {
                            cleanFunction("")
                        }
                    }}
                    className="py-4 rounded-none text-left shadow-none w-full text-gray-700 "
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
                    onClick={() => {
                        handleNewClickCompany()
                        if (cleanFunction) {
                            cleanFunction("")
                        }
                    }}
                    className="py-4 rounded-none text-left shadow-none w-full text-gray-700 "
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
            <InputTextAutoComplete
                value={text}
                id={props.id}
                title={props.title}
                onSetText={setText}
                onClickItem={handleAdd}
                onListOptions={handlePutActions}
                sugestions={personsAndCompanies}
            />

            <WindowModal
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
