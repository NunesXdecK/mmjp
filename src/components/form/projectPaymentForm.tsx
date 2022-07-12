import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import SelectProjectForm from "./selectProjectForm";
import { handleNewDateToUTC } from "../../util/dateUtils";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { handlePrepareProjectPaymentForDB } from "../../util/converterUtil";
import { handleProjectPaymentValidationForDB } from "../../util/validationUtil";
import { defaultProjectPayment, ProjectPayment } from "../../interfaces/objectInterfaces";
import { ProfessionalConversor, ProjectConversor, ProjectPaymentConversor } from "../../db/converters";
import { db, PROFESSIONAL_COLLECTION_NAME, PROJECT_COLLECTION_NAME, PROJECT_PAYMENT_COLLECTION_NAME, PROJECT_STAGE_COLLECTION_NAME } from "../../db/firebaseDB";
import InputCheckbox from "../inputText/inputCheckbox";

interface ProjectPaymentFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    projectPayment?: ProjectPayment,
    onBack?: (object) => void,
    onAfterSave?: (object) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectPaymentForm(props: ProjectPaymentFormProps) {
    const projectPaymentCollection = collection(db, PROJECT_PAYMENT_COLLECTION_NAME).withConverter(ProjectPaymentConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)

    const [projectPayment, setProjectPayment] = useState<ProjectPayment>(props?.projectPayment ?? defaultProjectPayment)
    const [isFormValid, setIsFormValid] = useState(handleProjectPaymentValidationForDB(projectPayment).validation)

    const [projects, setProjects] = useState(props?.projectPayment?.project?.id ? [props.projectPayment.project] : [])

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSetProjectPaymentValue = (value) => { setProjectPayment({ ...projectPayment, value: value }) }
    const handleSetProjectPaymentPayed = (value) => { setProjectPayment({ ...projectPayment, payed: value }) }
    const handleSetProjectPaymentDescription = (value) => { setProjectPayment({ ...projectPayment, description: value }) }

    const handleListItemClick = async (projectPayment: ProjectPayment) => {
        setIsLoading(true)
        if (props.onSelectPerson) {
            props.onSelectPerson(projectPayment)
        }
        setProjectPayment(projectPayment)
        setIsOpen(false)
        setIsFormValid(true)
        setIsLoading(false)
    }

    const handleSave = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }

        let projectPaymentForDB = { ...projectPayment }
        if (projects?.length > 0) {
            const docRef = doc(projectCollection, projects[0]?.id)
            projectPaymentForDB = { ...projectPaymentForDB, project: docRef }
        }
        const isValid = handleProjectPaymentValidationForDB(projectPaymentForDB)
        if (isValid.validation) {
            let nowID = projectPaymentForDB?.id ?? ""

            projectPaymentForDB = handlePrepareProjectPaymentForDB(projectPaymentForDB)

            const isSave = nowID === ""

            if (isSave) {
                try {
                    const docRef = await addDoc(projectPaymentCollection, projectPaymentForDB)
                    setProjectPayment({ ...projectPayment, id: docRef.id })
                    feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
                    handleListItemClick(defaultProjectPayment)
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                    console.error("Error adding document: ", e)
                }
            } else {
                try {
                    projectPaymentForDB = { ...projectPaymentForDB, dateLastUpdateUTC: handleNewDateToUTC() }
                    const docRef = doc(projectPaymentCollection, nowID)
                    await updateDoc(docRef, projectPaymentForDB)
                    feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
                    handleListItemClick(defaultProjectPayment)
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em atualizar!"], messageType: "ERROR" }
                    console.error("Error upddating document: ", e)
                }
            }
            if (props.onAfterSave) {
                props.onAfterSave(feedbackMessage)
            }
            {/*
        */}
        } else {
            feedbackMessage = { ...feedbackMessage, messages: isValid.messages, messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
        setIsLoading(false)
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    return (
        <>
            <SelectProjectForm
                title="Projeto"
                projects={projects}
                isLoading={isLoading}
                isBudgetAllowed={false}
                isMultipleSelect={false}
                onSetProjects={setProjects}
                subtitle="Selecione o projeto"
                buttonTitle="Pesquisar projeto"
                onShowMessage={props.onShowMessage}
                validationMessage="Esta projeto já foi selecionado"
            />

            <form
                onSubmit={handleSave}>
                <Form
                    title={props.title}
                    subtitle={props.subtitle}>

                    <FormRow>
                        <FormRowColumn unit="4">
                            <InputTextAutoComplete
                                id="description"
                                title="Descrição"
                                isLoading={isLoading}
                                validation={NOT_NULL_MARK}
                                isDisabled={props.isForDisable}
                                value={projectPayment.description}
                                onValidate={handleChangeFormValidation}
                                onSetText={handleSetProjectPaymentDescription}
                                sugestions={["Entrada", "Parcela"]}
                                validationMessage="A descrição não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                id="value"
                                title="Valor"
                                mask="currency"
                                isLoading={isLoading}
                                validation={NUMBER_MARK}
                                value={projectPayment.value}
                                isDisabled={props.isForDisable}
                                onValidate={handleChangeFormValidation}
                                onSetText={handleSetProjectPaymentValue}
                                validationMessage="O titulo da etapa não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>
                    <FormRow>
                        <FormRowColumn unit="1" className="sm:place-self-center">
                            <InputCheckbox
                                id="payed"
                                title="Pago?"
                                isLoading={isLoading}
                                value={projectPayment.payed}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectPaymentPayed}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <div className="hidden">
                        <Button
                            type="submit">
                        </Button>
                    </div>
                </Form>

                <FormRow className="p-2">
                    <FormRowColumn unit="6" className="flex justify-between">
                        {props.isBack && (
                            <Button
                                onClick={props.onBack}
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
        </>
    )
}