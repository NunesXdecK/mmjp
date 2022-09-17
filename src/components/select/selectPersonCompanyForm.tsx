import List from "../list/list";
import Form from "../form/form";
import FormRow from "../form/formRow";
import Button from "../button/button";
import IOSModal from "../modal/iosModal";
import PersonForm from "../form/personForm";
import { useEffect, useState } from "react";
import CompanyForm from "../form/companyForm";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import FormRowColumn from "../form/formRowColumn";
import FeedbackMessageText from "../modal/feedbackMessageText";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { defaultFeedbackMessage, FeedbackMessage } from "../modal/feedbackMessageModal";
import { Company, defaultCompany, defaultPerson, Person } from "../../interfaces/objectInterfaces";
import { handleMaskCNPJ, handleMaskCPF, handleRemoveCNPJMask, handleRemoveCPFMask } from "../../util/maskUtil";
import { handleValidationOnlyNumbersNotNull, handleValidationOnlyTextNotNull } from "../../util/validationUtil";
import PersonView from "../view/personView";
import CompanyView from "../view/companyView";

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
    onFinishAdd?: (any?) => void,
    onSetLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
    onSetPersonsAndCompanies?: (array) => void,
    onValidate?: (any) => boolean,
}

export default function SelectPersonCompanyForm(props: SelectPersonCompanyFormProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const [isRegisterPerson, setIsRegisterPerson] = useState(false)
    const [isRegisterCompany, setIsRegisterCompany] = useState(false)

    const [editIndex, setEditIndex] = useState(-1)

    const [element, setElement] = useState<Person | Company>({ name: "" })
    const [person, setPerson] = useState<Person>(defaultPerson)
    const [company, setCompany] = useState<Person>(defaultCompany)

    const [personsAndCompanies, setPersonsAndCompanies] = useState<Person[]>([])

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
        return listItemsFiltered
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

    const handleRemove = () => {
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
        setElement({ name: "" })
    }

    const handlePutActions = (index) => {
        return (
            <>
                {!props.isLocked && (
                    <>
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
                    </>
                )}
            </>
        )
    }

    useEffect(() => {
        if (isOpen && isFirst) {
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

                {props.personsAndCompanies?.map((element: Person | Company, index) => (
                    <form key={index + element.dateInsertUTC}
                        onSubmit={(event) => {
                            event.preventDefault()
                            setElement(element)
                            setIsOpenDelete(true)
                        }}>
                        <FormRow>
                            <FormRowColumn unit="3">
                                <InputText
                                    title="Nome"
                                    isDisabled={true}
                                    value={element.name}
                                    isLoading={props.isLoading}
                                    id={"person-company-name-" + index}
                                />
                            </FormRowColumn>
                            <FormRowColumn unit="3" className="flex flex-col sm:flex-row">
                                {"cpf" in element && (
                                    <>
                                        <InputText
                                            mask="cpf"
                                            title="CPF"
                                            isDisabled={true}
                                            isLoading={props.isLoading}
                                            id={"person-company-cpf-" + index}
                                            value={handleMaskCPF(element.cpf)}
                                        />
                                    </>
                                )}
                                {"cnpj" in element && (
                                    <>
                                        <InputText
                                            mask="cnpj"
                                            title="CNPJ"
                                            isDisabled={true}
                                            isLoading={props.isLoading}
                                            id={"person-company-cnpj-" + index}
                                            value={handleMaskCNPJ(element.cnpj)}
                                        />
                                    </>
                                )}
                                <div className="min-w-fit flex-col mt-4 sm:mt-0 self-end hidden sm:block">
                                    {handlePutActions(index)}
                                </div>
                            </FormRowColumn>
                            <FormRowColumn unit="6" className="flex justify-end sm:hidden">
                                {handlePutActions(index)}
                            </FormRowColumn>
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
                <>
                    {isOpen && (
                        <>
                            {!isRegisterPerson && !isRegisterCompany && (
                                <List
                                    canSelect
                                    autoSearch
                                    onSelectClick={handleAdd}
                                    isLoading={props.isLoading}
                                    onFilterList={handleFilterList}
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
                                        return (
                                            <>
                                                {element && "cpf" in element && (
                                                    <PersonView
                                                        title=""
                                                        hideData
                                                        hideBorder
                                                        hidePaddingMargin
                                                        person={element}
                                                    />
                                                )}
                                                {element && "cnpj" in element && (
                                                    <CompanyView
                                                        title=""
                                                        hideData
                                                        hideBorder
                                                        company={element}
                                                        hidePaddingMargin
                                                    />
                                                )}
                                            </>
                                        )
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
                        </>
                    )}
                </>
            </IOSModal>

            <WindowModal
                isOpen={isOpenDelete}
                setIsOpen={setIsOpenDelete}>
                <p className="text-center">Deseja realmente deletar {element.name}?</p>
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
                            handleRemove()
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
