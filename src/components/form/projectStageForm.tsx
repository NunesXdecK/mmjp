import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import SelectProjectForm from "./selectProjectForm";
import InputTextArea from "../inputText/inputTextArea";
import { handleNewDateToUTC } from "../../util/dateUtils";
import SelectProfessionalForm from "./selectProfessionalForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { handlePrepareProjectStageForDB } from "../../util/converterUtil";
import { handleProjectStageValidationForDB } from "../../util/validationUtil";
import { defaultProjectStage, ProjectStage } from "../../interfaces/objectInterfaces";
import { ProfessionalConversor, ProjectConversor, ProjectStageConversor } from "../../db/converters";
import { db, PROFESSIONAL_COLLECTION_NAME, PROJECT_COLLECTION_NAME, PROJECT_STAGE_COLLECTION_NAME } from "../../db/firebaseDB";

interface ProjectStageFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    projectStage?: ProjectStage,
    onBack?: (object) => void,
    onAfterSave?: (object) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectStageForm(props: ProjectStageFormProps) {
    const projectStageCollection = collection(db, PROJECT_STAGE_COLLECTION_NAME).withConverter(ProjectStageConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    const [projectStage, setProjectStage] = useState<ProjectStage>(props?.projectStage ?? defaultProjectStage)
    const [isFormValid, setIsFormValid] = useState(handleProjectStageValidationForDB(projectStage).validation)

    const [projects, setProjects] = useState(props?.projectStage?.project?.id ? [props.projectStage.project] : [])
    const [responsibles, setResponsibles] = useState(props?.projectStage?.responsible?.id ? [props.projectStage.responsible] : [])

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSetProjectStageTitle = (value) => { setProjectStage({ ...projectStage, title: value }) }
    const handleSetProjectStageDescription = (value) => { setProjectStage({ ...projectStage, description: value }) }

    const handleListItemClick = async (projectStage: ProjectStage) => {
        setIsLoading(true)
        if (props.onSelectPerson) {
            props.onSelectPerson(projectStage)
        }
        setProjectStage(projectStage)
        setIsOpen(false)
        setIsFormValid(true)
        setIsLoading(false)
    }

    const handleSave = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }

        let projectStageForDB = { ...projectStage }
        const isValid = handleProjectStageValidationForDB(projectStageForDB)
        if (isValid.validation) {
            let nowID = projectStageForDB?.id ?? ""

            if (projects?.length > 0) {
                const docRef = doc(projectCollection, projects[0]?.id)
                projectStageForDB = { ...projectStageForDB, project: docRef }
            }

            if (responsibles?.length > 0) {
                const docRef = doc(professionalCollection, responsibles[0]?.id)
                projectStageForDB = { ...projectStageForDB, responsible: docRef }
            }

            projectStageForDB = handlePrepareProjectStageForDB(projectStageForDB)

            console.log(projectStageForDB)

            const isSave = nowID === ""
            
            if (isSave) {
                try {
                    const docRef = await addDoc(projectStageCollection, projectStageForDB)
                    setProjectStage({ ...projectStage, id: docRef.id })
                    feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
                    handleListItemClick(defaultProjectStage)
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                    console.error("Error adding document: ", e)
                }
            } else {
                try {
                    projectStageForDB = { ...projectStageForDB, dateLastUpdateUTC: handleNewDateToUTC() }
                    const docRef = doc(projectStageCollection, nowID)
                    await updateDoc(docRef, projectStageForDB)
                    feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
                    handleListItemClick(defaultProjectStage)
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

            <SelectProfessionalForm
                isLoading={isLoading}
                isMultipleSelect={false}
                professionals={responsibles}
                title="Profissional responsavel"
                subtitle="Selecione o responsavel"
                onShowMessage={props.onShowMessage}
                buttonTitle="Pesquisar profissional"
                onSetProfessionals={setResponsibles}
                validationMessage="Esta pessoa já é um profissional"
            />

            <form
                onSubmit={handleSave}>
                <Form
                    title={props.title}
                    subtitle={props.subtitle}>

                    <FormRow>
                        <FormRowColumn unit="4">
                            <InputText
                                id="title"
                                isLoading={isLoading}
                                title="Titulo da etapa"
                                value={projectStage.title}
                                validation={NOT_NULL_MARK}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectStageTitle}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O titulo da etapa não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="6">
                            <InputTextArea
                                id="description"
                                title="Descrição"
                                isLoading={isLoading}
                                isDisabled={props.isForDisable}
                                value={projectStage.description}
                                onSetText={handleSetProjectStageDescription}
                                onValidate={handleChangeFormValidation}
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