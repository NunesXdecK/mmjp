import Form from "./form";
import FormRow from "./formRow";
import Button from "../button/button";
import AddressForm from "./addressForm";
import { useEffect, useState } from "react";
import FormRowColumn from "./formRowColumn";
import ArrayTextForm from "./arrayTextForm";
import WindowModal from "../modal/windowModal";
import InputText from "../inputText/inputText";
import SelectPersonForm from "./selectPersonForm";
import InputCheckbox from "../inputText/inputCheckbox";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleCompanyValidationForDB } from "../../util/validationUtil";
import { defaultCompany, Company } from "../../interfaces/objectInterfaces";
import { CNPJ_MARK, NOT_NULL_MARK, TELEPHONE_MARK } from "../../util/patternValidationUtil";
import { defaultElementFromBase, ElementFromBase, handlePrepareCompanyForDB } from "../../util/converterUtil";

interface CompanyFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canMultiple?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    company?: Company,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function CompanyForm(props: CompanyFormProps) {
    const [companyOriginal, setCompanyOriginal] = useState<Company>(props?.company ?? defaultCompany)
    const [company, setCompany] = useState<Company>(props?.company ?? defaultCompany)
    const [isFormValid, setIsFormValid] = useState(handleCompanyValidationForDB(company).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)
    const [isOpenExit, setIsOpenExit] = useState(false)
    const [isOpenSave, setIsOpenSave] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.company?.oldData ?? defaultElementFromBase)

    const handleSetCompanyName = (value) => { setCompany({ ...company, name: value }) }
    const handleSetCompanyCnpj = (value) => { setCompany({ ...company, cnpj: value }) }
    const handleSetCompanyOwners = (value) => { setCompany({ ...company, owners: value }) }
    const handleSetCompanyAddress = (value) => { setCompany({ ...company, address: value }) }
    const handleSetCompanyClientCode = (value) => { setCompany({ ...company, clientCode: value }) }
    const handleSetCompanyTelephones = (value) => { setCompany({ ...company, telephones: value }) }

    useEffect(() => {
        if (props.onBack) {
            history.pushState(null, null, null)
            if (company.id !== "" && handleDiference()) {
                window.onbeforeunload = () => {
                    return false
                }
                document.addEventListener("keydown", (event) => {
                    if (event.keyCode === 116) {
                        event.preventDefault()
                        setIsOpenExit(true)
                    }
                })
            } else {
                window.onbeforeunload = () => { }
                document.addEventListener("keydown", (event) => { })
            }

            window.onpopstate = (event) => {
                event.preventDefault()
                event.stopPropagation()
                handleOnBack()
            }
        }
    })

    const handleDiference = (): boolean => {
        let hasDiference = false
        Object.keys(companyOriginal)?.map((element, index) => {
            if (company[element] !== companyOriginal[element]) {
                hasDiference = true
            }
        })
        return hasDiference
    }

    const handleOnBack = () => {
        if (company.id !== "" && handleDiference()) {
            setIsOpenExit(true)
        } else {
            props.onBack()
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleSave = async () => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }
        let companyForDB = { ...company }
        const isValid = handleCompanyValidationForDB(companyForDB)
        if (isValid.validation) {
            companyForDB = handlePrepareCompanyForDB(companyForDB)
            let nowID = companyForDB?.id ?? ""
            const isSave = nowID === ""
            let res = { status: "ERROR", id: nowID, message: "" }
            if (isSave) {
                feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
            } else {
                feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
            }
            try {
                res = await fetch("api/company", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", data: companyForDB }),
                }).then((res) => res.json())
            } catch (e) {
                if (isSave) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                } else {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em Atualizadar!"], messageType: "ERROR" }
                }
                console.error("Error adding document: ", e)
            }
            if (res.status === "SUCCESS") {
                setCompany({ ...company, id: res.id })
                companyForDB = { ...companyForDB, id: res.id }

                if (isMultiple) {
                    setCompany(defaultCompany)
                }

                if (!isMultiple && props.onAfterSave) {
                    props.onAfterSave(feedbackMessage, companyForDB)
                }
            } else {
                feedbackMessage = { ...feedbackMessage, messages: ["Erro!"], messageType: "ERROR" }
            }

            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        } else {
            feedbackMessage = { ...feedbackMessage, messages: isValid.messages, messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
        setIsLoading(false)
    }

    return (
        <>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    if (company.id === "") {
                        handleSave()
                    } else {
                        setIsOpenSave(true)
                    }
                }}>
                <Form
                    title={props.title}
                    subtitle={props.subtitle}>

                    {props.canMultiple && (
                        <FormRow>
                            <FormRowColumn unit="6">
                                <InputCheckbox
                                    id="multiple"
                                    value={isMultiple}
                                    isLoading={isLoading}
                                    onSetText={setIsMultiple}
                                    title="Cadastro multiplo?"
                                    isDisabled={props.isForDisable}
                                />
                            </FormRowColumn>
                        </FormRow>
                    )}

                    <FormRow>
                        <FormRowColumn unit="4">
                            <InputText
                                id="companyname"
                                value={company.name}
                                isLoading={isLoading}
                                validation={NOT_NULL_MARK}
                                title="Nome da empresa"
                                isDisabled={props.isForDisable}
                                onSetText={handleSetCompanyName}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O nome da empresa não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                id="code"
                                title="Codigo do cliente"
                                value={company.clientCode}
                                isLoading={isLoading}
                                onSetText={handleSetCompanyClientCode}
                                isDisabled={props.isForDisable}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="cnpj"
                                mask="cnpj"
                                title="CNPJ"
                                maxLength={18}
                                value={company.cnpj}
                                isLoading={isLoading}
                                validation={CNPJ_MARK}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetCompanyCnpj}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O CPNPJ não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>

                    <div className="hidden">
                        <Button
                            type="submit">
                        </Button>
                    </div>
                </Form>
            </form>

            <ArrayTextForm
                id="telephone"
                mask="telephone"
                title="Telefones"
                isLoading={isLoading}
                inputTitle="Telephone"
                texts={company.telephones}
                validation={TELEPHONE_MARK}
                onSetTexts={handleSetCompanyTelephones}
                subtitle="Informações sobre os contatos"
                validationMessage="Faltam números no telefone"
            />

            <SelectPersonForm
                title="Proprietários"
                isLoading={isLoading}
                isMultipleSelect={true}
                persons={company.owners}
                onSetLoading={setIsLoading}
                onShowMessage={props.onShowMessage}
                buttonTitle="Adicionar proprietário"
                subtitle="Selecione os proprietários"
                onSetPersons={handleSetCompanyOwners}
                validationMessage="Esta pessoa já é um proprietário"
            />

            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    if (company.id === "") {
                        handleSave()
                    } else {
                        setIsOpenSave(true)
                    }
                }}>
                <AddressForm
                    title="Endereço"
                    isLoading={isLoading}
                    address={company.address}
                    setAddress={handleSetCompanyAddress}
                    subtitle="Informações sobre o endereço"
                />

                <FormRow className="p-2">
                    <FormRowColumn unit="6" className="flex justify-between">
                        {props.isBack && (
                            <Button
                                onClick={(event) => {
                                    event.preventDefault()
                                    handleOnBack()
                                }}
                                isLoading={isLoading}
                                isDisabled={isLoading}
                            >
                                Voltar
                            </Button>
                        )}

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            isDisabled={!isFormValid}
                        >
                            {company.id === "" ? "Salvar" : "Editar"}
                        </Button>
                    </FormRowColumn>
                </FormRow>
            </form>

            <WindowModal
                isOpen={isOpenExit}
                setIsOpen={setIsOpenExit}>
                <p className="text-center">Deseja realmente sair?</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={() => setIsOpenExit(false)}
                    >
                        Voltar
                    </Button>
                    <Button
                        color="red"
                        onClick={() => {
                            if (props.onBack) {
                                props.onBack()
                            }
                        }}
                    >
                        Sair
                    </Button>
                </div>
            </WindowModal>

            <WindowModal
                isOpen={isOpenSave}
                setIsOpen={setIsOpenSave}>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    handleSave()
                    setIsOpenSave(false)
                }}>
                    <p className="text-center">Deseja realmente editar as informações?</p>
                    <div className="flex mt-10 justify-between content-between">
                        <Button
                            onClick={(event) => {
                                event.preventDefault()
                                setIsOpenSave(false)
                            }}
                        >
                            Voltar
                        </Button>
                        <Button
                            color="red"
                            type="submit"
                        >
                            Editar
                        </Button>
                    </div>
                </form>
            </WindowModal>
        </>
    )
}