import Form from "./form";
import FormRow from "./formRow";
import Button from "../button/button";
import { useEffect, useState } from "react";
import FormRowColumn from "./formRowColumn";
import WindowModal from "../modal/windowModal";
import InputText from "../inputText/inputText";
import InputCheckbox from "../inputText/inputCheckbox";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import { handleProfessionalValidationForDB } from "../../util/validationUtil";
import { defaultProfessional, Professional } from "../../interfaces/objectInterfaces";
import { defaultElementFromBase, ElementFromBase, handlePrepareProfessionalForDB } from "../../util/converterUtil";
import SelectPersonForm from "../select/selectPersonForm";

interface ProfessionalFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canMultiple?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    professional?: Professional,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProfessionalForm(props: ProfessionalFormProps) {
    const [professionalOriginal, setProfessionalOriginal] = useState<Professional>(props?.professional ?? defaultProfessional)
    const [professional, setProfessional] = useState<Professional>(props?.professional ?? defaultProfessional)
    const [isFormValid, setIsFormValid] = useState(handleProfessionalValidationForDB(professional).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)
    const [isOpenExit, setIsOpenExit] = useState(false)
    const [isOpenSave, setIsOpenSave] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.professional?.oldData ?? defaultElementFromBase)

    const [persons, setPersons] = useState(props?.professional?.person?.id !== "" ? [props.professional.person] : [])

    const handleSetProfessionalTitle = (value) => { setProfessional({ ...professional, title: value }) }
    const handleSetProfessionalCreaNumber = (value) => { setProfessional({ ...professional, creaNumber: value }) }
    const handleSetProfessionalCredentialCode = (value) => { setProfessional({ ...professional, credentialCode: value }) }

    useEffect(() => {
        if (props.onBack) {
            if (professional.id !== "" && handleDiference()) {
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
        Object.keys(professionalOriginal)?.map((element, index) => {
            if (professional[element] !== professionalOriginal[element]) {
                hasDiference = true
            }
        })
        return hasDiference
    }

    const handleOnBack = () => {
        if (professional.id !== "" && handleDiference()) {
            setIsOpenExit(true)
        } else {
            props.onBack()
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleSave = async () => {
        event.preventDefault()
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }
        let professionalForDB = { ...professional }
        if (persons.length > 0) {
            professionalForDB = { ...professionalForDB, person: persons[0] }
        }
        const isValid = handleProfessionalValidationForDB(professionalForDB)
        if (isValid.validation) {
            professionalForDB = handlePrepareProfessionalForDB(professionalForDB)
            let nowID = professionalForDB?.id ?? ""
            const isSave = nowID === ""
            let res = { status: "ERROR", id: nowID, message: "" }
            if (isSave) {
                feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
            } else {
                feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
            }
            try {
                res = await fetch("api/professional", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", data: professionalForDB }),
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
                setProfessional({ ...professional, id: res.id })
                professionalForDB = { ...professionalForDB, id: res.id }

                if (isMultiple) {
                    setProfessional(defaultProfessional)
                }

                if (!isMultiple && props.onAfterSave) {
                    props.onAfterSave(feedbackMessage, professionalForDB)
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
                    if (professional.id === "") {
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
                        <FormRowColumn unit="6">
                            <InputText
                                id="professionalTitle"
                                value={professional.title}
                                isLoading={isLoading}
                                validation={NOT_NULL_MARK}
                                title="Titulo do profissional"
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProfessionalTitle}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O titulo do profissional não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="creaNumber"
                                title="Número do CREA"
                                value={professional.creaNumber}
                                isLoading={isLoading}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProfessionalCreaNumber}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O numero do crea não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="credentialCode"
                                title="Codigo credencial"
                                isLoading={isLoading}
                                value={professional.credentialCode}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProfessionalCredentialCode}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O codigo credencial não pode ficar em branco."
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

            <SelectPersonForm
                persons={persons}
                isLoading={isLoading}
                title="Dados pessoais"
                isMultipleSelect={false}
                onSetPersons={setPersons}
                subtitle="Selecione a pessoa"
                buttonTitle="Adicionar pessoa"
                onShowMessage={props.onShowMessage}
                validationMessage="Esta pessoa já é um proprietário"
            />

            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    if (professional.id === "") {
                        handleSave()
                    } else {
                        setIsOpenSave(true)
                    }
                }}>
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
                            Salvar
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