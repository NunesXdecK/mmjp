import List from "../list/list";
import Form from "../form/form";
import FormRow from "../form/formRow";
import Button from "../button/button";
import IOSModal from "../modal/iosModal";
import PersonForm from "../form/personForm";
import { useEffect, useState } from "react";
import CompanyForm from "../form/companyForm";
import InputText from "../inputText/inputText";
import FormRowColumn from "../form/formRowColumn";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { Company, defaultCompany, defaultPerson, Person } from "../../interfaces/objectInterfaces";
import { handleMaskCNPJ, handleMaskCPF, handleRemoveCNPJMask, handleRemoveCPFMask } from "../../util/maskUtil";
import { handleValidationOnlyNumbersNotNull, handleValidationOnlyTextNotNull } from "../../util/validationUtil";

interface SelectPersonCompanyFormProps {
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
    personsAndCompanies?: Person[],
    onValidate?: (any) => boolean,
    onSetLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onSetPersonsAndCompanies?: (array) => void,
}

export default function SelectPersonCompanyForm(props: SelectPersonCompanyFormProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const [isRegisterPerson, setIsRegisterPerson] = useState(false)
    const [isRegisterCompany, setIsRegisterCompany] = useState(false)

    const [editIndex, setEditIndex] = useState(-1)

    const [person, setPerson] = useState<Person>(defaultPerson)
    const [company, setCompany] = useState<Person>(defaultCompany)

    const [personsAndCompanies, setPersonsAndCompanies] = useState<Person[]>([])
    const [personsAndCompaniesForShow, setPersonsAndCompaniesForShow] = useState<Person[]>([])

    const handleNewClickPerson = () => {
        setIsRegisterCompany(false)
        setIsRegisterPerson(true)
        setPerson(defaultPerson)
    }

    const handleNewClickCompany = () => {
        setIsRegisterCompany(true)
        setIsRegisterPerson(false)
        setCompany(defaultCompany)
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setPersonsAndCompanies([])
        setPersonsAndCompaniesForShow([])
        setPerson(defaultPerson)
        setCompany(defaultCompany)
        setIsFirst(true)
        setIsRegisterPerson(false)
        setIsRegisterCompany(false)
    }

    const handleFilterList = (string) => {
        let listItems = [...personsAndCompanies]
        let listItemsFiltered: (Person | Company)[] = []
        listItemsFiltered = listItems.filter((element: (Person | Company), index) => {
            if ("cpf" in element) {
                if (handleValidationOnlyNumbersNotNull(handleRemoveCPFMask(string))) {
                    return handleRemoveCPFMask(element.cpf).includes(handleRemoveCPFMask(string))
                }
                if (handleValidationOnlyTextNotNull(string)) {
                    return element.name.toLowerCase().includes(string.toLowerCase())
                }
            } else if ("cnpj" in element) {
                if (handleValidationOnlyNumbersNotNull(handleRemoveCPFMask(string))) {
                    return handleRemoveCPFMask(element.cnpj).includes(handleRemoveCPFMask(string))
                }
                if (handleValidationOnlyTextNotNull(string)) {
                    return element.name.toLowerCase().includes(string.toLowerCase())
                }
            }
            return true
        })
        setPersonsAndCompaniesForShow((old) => listItemsFiltered)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, element) => {
        handleAdd(element)
        handleBackClick()
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleAdd = (personOrCompany) => {
        let localPersonsAndCompanies = props.personsAndCompanies
        let canAdd = true

        localPersonsAndCompanies?.map((element: (Person | Company), index) => {
            if ("cpf" in element && "cpf" in personOrCompany) {
                if (handleRemoveCPFMask(element.cpf) === handleRemoveCPFMask(personOrCompany.cpf)) {
                    canAdd = false
                }
            } else if ("cnpj" in element && "cnpj" in personOrCompany) {
                if (handleRemoveCNPJMask(element.cnpj) === handleRemoveCNPJMask(personOrCompany.cnpj)) {
                    canAdd = false
                }
            }
        })

        if (props.onValidate) {
            canAdd = props.onValidate(personOrCompany)
        }

        if (canAdd) {
            if (props.isMultipleSelect) {
                if (editIndex > -1) {
                    localPersonsAndCompanies = [
                        ...localPersonsAndCompanies.slice(0, editIndex),
                        personOrCompany,
                        ...localPersonsAndCompanies.slice(editIndex + 1, localPersonsAndCompanies.length),
                    ]
                } else {
                    localPersonsAndCompanies = [...localPersonsAndCompanies, personOrCompany]
                }
            } else {
                localPersonsAndCompanies = [personOrCompany]
            }
            setEditIndex(-1)
            if (props.onSetPersonsAndCompanies) {
                props.onSetPersonsAndCompanies(localPersonsAndCompanies)
                setIsOpen(false)
            }
        } else {
            let feedbackMessage: FeedbackMessage = { messages: [props?.validationMessage], messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
    }

    const handleRemove = (event, element) => {
        event.preventDefault()
        if (!props.isMultipleSelect) {
            props.onSetPersonsAndCompanies([])
        } else {
            let localPersonsAndCompanies = props.personsAndCompanies
            if (localPersonsAndCompanies.length > -1) {
                let index = localPersonsAndCompanies.indexOf(element)
                localPersonsAndCompanies.splice(index, 1)
                if (props.onSetPersonsAndCompanies) {
                    props.onSetPersonsAndCompanies(localPersonsAndCompanies)
                }
            }
        }
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/personsAndCompanies").then((res) => res.json()).then((res) => {
                if (res.list.length) {
                    setPersonsAndCompanies(res.list)
                    setPersonsAndCompaniesForShow(res.list)
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
                                    } else {
                                        setIsOpen(true)
                                    }
                                }}
                            >
                                {props.buttonTitle}
                            </Button>
                            {isInvalid && (
                                <span className="mt-2 text-red-600">{props.validationMessageButton}</span>
                            )}
                        </FormRowColumn>
                    </FormRow>
                )}

                {props.personsAndCompanies?.map((element: Person | Company, index) => (
                    <form key={index + element.dateInsertUTC}
                        onSubmit={(event) => handleRemove(event, element)}>
                        <FormRow>
                            <FormRowColumn unit="2">
                                <InputText
                                    title="Nome"
                                    isDisabled={true}
                                    value={element.name}
                                    isLoading={props.isLoading}
                                    id={"person-company-name-" + index}
                                />
                            </FormRowColumn>
                            {"cpf" in element && (
                                <FormRowColumn unit="2">
                                    <InputText
                                        mask="cpf"
                                        title="CPF"
                                        isDisabled={true}
                                        isLoading={props.isLoading}
                                        id={"person-company-cpf-" + index}
                                        value={handleMaskCPF(element.cpf)}
                                    />
                                </FormRowColumn>
                            )}
                            {"cnpj" in element && (
                                <FormRowColumn unit="2">
                                    <InputText
                                        mask="cnpj"
                                        title="CNPJ"
                                        isDisabled={true}
                                        isLoading={props.isLoading}
                                        id={"person-company-cnpj-" + index}
                                        value={handleMaskCNPJ(element.cnpj)}
                                    />
                                </FormRowColumn>
                            )}
                            {!props.isLocked && (
                                <FormRowColumn unit="2"
                                    className="flex flex-row gap-2 self-end justify-self-end">
                                    <Button
                                        type="button"
                                        isLoading={props.isLoading}
                                        isDisabled={props.isLoading}
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
                onClose={() => {
                    setIsRegisterPerson(false)
                    setIsRegisterCompany(false)
                }}
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                {!isRegisterPerson && !isRegisterCompany && (
                    <List
                        canSelect
                        autoSearch
                        onSelectClick={handleAdd}
                        isLoading={props.isLoading}
                        onFilterList={handleFilterList}
                        list={personsAndCompaniesForShow}
                        title={"Lista de pessoas e empresas"}
                        onCustomNewButton={() => {
                            return (
                                <div className="self-center text-right">
                                    <Button
                                        isLoading={props.isLoading}
                                        isDisabled={props.isLoading}
                                        onClick={handleNewClickPerson}>
                                        Nova pessoa
                                    </Button>
                                    <Button
                                        className="mt-2"
                                        isLoading={props.isLoading}
                                        isDisabled={props.isLoading}
                                        onClick={handleNewClickCompany}>
                                        Nova empresa
                                    </Button>
                                </div>)
                        }}
                        onTitle={(element: (Person | Company)) => {
                            return (<p>{element.name}</p>)
                        }}
                        onInfo={(element: (Person | Company)) => {
                            return (<p>{element.name}</p>)
                        }}
                        onShowMessage={props.onShowMessage}
                    />
                )}
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
            </IOSModal>
        </>
    )
}
