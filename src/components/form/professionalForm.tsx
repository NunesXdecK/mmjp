import Form from "./form";
import FormRow from "./formRow";
import { useEffect, useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import ActionButtonsForm from "./actionButtonsForm";
import InputCheckbox from "../inputText/inputCheckbox";
import SelectPersonForm from "../select/selectPersonForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import { handleProfessionalValidationForDB } from "../../util/validationUtil";
import { defaultProfessional, Professional } from "../../interfaces/objectInterfaces";
import { defaultElementFromBase, ElementFromBase, handlePrepareProfessionalForDB } from "../../util/converterUtil";

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

    const [oldData, setOldData] = useState<ElementFromBase>(props?.professional?.oldData ?? defaultElementFromBase)

    const [persons, setPersons] = useState(props?.professional?.person?.id !== "" ? [props.professional.person] : [])

    const handleSetProfessionalTitle = (value) => { setProfessional({ ...professional, title: value }) }
    const handleSetProfessionalCreaNumber = (value) => { setProfessional({ ...professional, creaNumber: value }) }
    const handleSetProfessionalCredentialCode = (value) => { setProfessional({ ...professional, credentialCode: value }) }

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
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleSave = async () => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }
        let professionalForDB = { ...professional }
        if (persons.length > 0) {
            professionalForDB = { ...professionalForDB, person: persons[0] }
        } else {
            professionalForDB = { ...professionalForDB, person: {} }
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
                    if (event) {
                        event.preventDefault()
                    }
                }}>

                <ActionButtonsForm
                    isLeftOn
                    isForBackControl
                    isDisabled={!isFormValid}
                    rightWindowText="Deseja confirmar as alterações?"
                    isForOpenLeft={professional.id !== "" && handleDiference()}
                    isForOpenRight={professional.id !== "" && handleDiference()}
                    rightButtonText={professional.id === "" ? "Salvar" : "Editar"}
                    leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                    onLeftClick={(event) => {
                        if (event) {
                            event.preventDefault()
                        }
                        handleOnBack()
                    }}
                    onRightClick={(event) => {
                        if (event) {
                            event.preventDefault()
                        }
                        handleSave()
                    }}
                />

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
                </Form>
            </form>

            <SelectPersonForm
                persons={persons}
                isLoading={isLoading}
                title="Dados pessoais"
                formClassName="p-1 m-3"
                onSetPersons={setPersons}
                subtitle="Selecione a pessoa"
                buttonTitle="Adicionar pessoa"
                onShowMessage={props.onShowMessage}
                validationButton={persons.length === 1}
                validationMessage="Esta pessoa já é um proprietário"
                validationMessageButton="Você não pode mais adicionar pessoas"
            />

            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>
                <ActionButtonsForm
                    isLeftOn
                    isDisabled={!isFormValid}
                    rightWindowText="Deseja confirmar as alterações?"
                    isForOpenLeft={professional.id !== "" && handleDiference()}
                    isForOpenRight={professional.id !== "" && handleDiference()}
                    rightButtonText={professional.id === "" ? "Salvar" : "Editar"}
                    leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                    onLeftClick={(event) => {
                        if (event) {
                            event.preventDefault()
                        }
                        handleOnBack()
                    }}
                    onRightClick={(event) => {
                        if (event) {
                            event.preventDefault()
                        }
                        handleSave()
                    }}
                />
            </form>
        </>
    )
}