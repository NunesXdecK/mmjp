import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import PersonForm from "./personForm";
import CompanyForm from "./companyForm";
import IOSModal from "../modal/iosModal";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import PersonCompanyList from "../list/personCompanyList";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleMaskCNPJ, handleMaskCPF, handleRemoveCPFMask } from "../../util/maskUtil";
import { Company, defaultCompany, defaultPerson, Person } from "../../interfaces/objectInterfaces";

interface SelectPersonCompanyFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    buttonTitle?: string,
    validationMessage?: string,
    isLocked?: boolean,
    isLoading?: boolean,
    isMultipleSelect?: boolean,
    persons?: Person[],
    onSetPersons?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectPersonCompanyForm(props: SelectPersonCompanyFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isRegisterPerson, setIsRegisterPerson] = useState(false)
    const [isRegisterCompany, setIsRegisterCompany] = useState(false)

    const [person, setPerson] = useState<Person>(defaultPerson)
    const [company, setCompany] = useState<Person>(defaultCompany)

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
        setPerson(defaultPerson)
        setCompany(defaultCompany)
        setIsRegisterCompany(false)
        setIsRegisterPerson(false)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, element) => {
        handleAdd(element)
        handleBackClick()
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleAdd = (person) => {
        let localPersons = props.persons
        let canAdd = true

        if (props.isMultipleSelect) {
            localPersons?.map((element, index) => {
                if (handleRemoveCPFMask(element.cpf) === handleRemoveCPFMask(person.cpf)) {
                    canAdd = false
                }
            })
        }

        if (canAdd) {
            if (props.isMultipleSelect) {
                localPersons = [...localPersons, person]
            } else {
                localPersons = [person]
            }
            if (props.onSetPersons) {
                props.onSetPersons(localPersons)
                setIsOpen(false)
            }
        } else {
            let feedbackMessage: FeedbackMessage = { messages: [props?.validationMessage], messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
    }

    const handleRemovePerson = (event, person) => {
        event.preventDefault()
        if (!props.isMultipleSelect) {
            props.onSetPersons([])
        } else {
            let localPersons = props.persons
            if (localPersons.length > -1) {
                let index = localPersons.indexOf(person)
                localPersons.splice(index, 1)
                if (props.onSetPersons) {
                    props.onSetPersons(localPersons)
                }
            }
        }
    }

    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>

                {!props.isLocked && (
                    <FormRow>
                        <FormRowColumn unit="6" className="justify-self-end">
                            <Button
                                type="submit"
                                isLoading={props.isLoading}
                                isDisabled={props.isLoading}
                                onClick={() => setIsOpen(true)}
                            >
                                {props.buttonTitle}
                            </Button>
                        </FormRowColumn>
                    </FormRow>
                )}

                {props.persons?.map((element: Person | Company, index) => (
                    <form key={index + element.dateInsertUTC}
                        onSubmit={(event) => handleRemovePerson(event, element)}>
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
                                <FormRowColumn unit="1"
                                    className="self-end justify-self-end">
                                    <Button
                                        type="submit"
                                        color="red"
                                        isLoading={props.isLoading}
                                        isDisabled={props.isLoading}
                                    >
                                        X
                                    </Button>
                                </FormRowColumn>
                            )}

                        </FormRow>
                    </form>
                ))}
            </Form>

            <IOSModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>

                {!isRegisterPerson && !isRegisterCompany && (
                    <PersonCompanyList
                        haveNew={true}
                        onNewClickPerson={handleNewClickPerson}
                        onNewClickCompany={handleNewClickCompany}
                        onListItemClick={handleAdd}
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
