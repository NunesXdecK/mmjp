import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import AddressForm from "./addressForm";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { handleNewDateToUTC } from "../../util/dateUtils";
import SelectPersonCompanyForm from "./selectPersonCompanyForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { CompanyConversor, PersonConversor, ProfessionalConversor, ProjectConversor, PropertyConversor } from "../../db/converters";
import { handleProjectValidationForDB } from "../../util/validationUtil";
import { defaultProject, Project } from "../../interfaces/objectInterfaces";
import { DATE_MARK, NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { COMPANY_COLLECTION_NAME, db, PERSON_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME, PROJECT_COLLECTION_NAME, PROPERTY_COLLECTION_NAME } from "../../db/firebaseDB";
import { defaultElementFromBase, ElementFromBase, handlePrepareProjectForDB } from "../../util/converterUtil";
import SelectProfessionalForm from "./selectProfessionalForm";
import SelectPropertyForm from "./selectPropertyForm";

interface ProjectFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    project?: Project,
    onBack?: (object) => void,
    onAfterSave?: (object) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectForm(props: ProjectFormProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const propertyCollection = collection(db, PROPERTY_COLLECTION_NAME).withConverter(PropertyConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    const [project, setProject] = useState<Project>(props?.project ?? defaultProject)
    const [isFormValid, setIsFormValid] = useState(handleProjectValidationForDB(project).validation)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.project?.oldData ?? defaultElementFromBase)

    const [professionals, setProfessionals] = useState(props?.project?.professional ? [props.project.professional] : [])

    const handleSetProjectNumber = (value) => { setProject({ ...project, number: value }) }
    const handleSetProjectDate = (value) => { setProject({ ...project, dateString: value }) }
    const handleSetProjectClients = (value) => { setProject({ ...project, clients: value }) }
    const handleSetProjectProperties = (value) => { setProject({ ...project, properties: value }) }

    const handleListItemClick = async (project: Project) => {
        setIsLoading(true)
        if (props.onSelectPerson) {
            props.onSelectPerson(project)
        }
        setProject(project)
        setIsOpen(false)
        setIsFormValid(true)
        setIsLoading(false)
    }

    const handleSave = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }

        let projectForDB = { ...project }
        const isValid = handleProjectValidationForDB(projectForDB)
        if (isValid.validation) {
            let nowID = projectForDB?.id ?? ""
            let clientsDocRefs = []
            let propertiesDocRefsForDB = []

            if (projectForDB.clients?.length > 0) {
                projectForDB.clients?.map((element, index) => {
                    if (element.id) {
                        let docRef = {}
                        if ("cpf" in element) {
                            docRef = doc(personCollection, element.id)
                        } else if ("cnpj" in element) {
                            docRef = doc(companyCollection, element.id)
                        }
                        clientsDocRefs = [...clientsDocRefs, docRef]
                    }
                })
                projectForDB = { ...projectForDB, clients: clientsDocRefs }
            }

            if (projectForDB.properties?.length > 0) {
                projectForDB.properties?.map((element, index) => {
                    if (element.id) {
                        const docRef = doc(propertyCollection, element.id)
                        propertiesDocRefsForDB = [...propertiesDocRefsForDB, docRef]
                    }
                })
                projectForDB = { ...projectForDB, properties: propertiesDocRefsForDB }
            }

            if (professionals?.length > 0) {
                const docRef = doc(professionalCollection, professionals[0]?.id)
                projectForDB = { ...projectForDB, professional: docRef }
            }

            projectForDB = handlePrepareProjectForDB(projectForDB)

            const isSave = nowID === ""

            if (isSave) {
                try {
                    const docRef = await addDoc(projectCollection, projectForDB)
                    setProject({ ...project, id: docRef.id })
                    feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
                    handleListItemClick(defaultProject)
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                    console.error("Error adding document: ", e)
                }
            } else {
                try {
                    projectForDB = { ...projectForDB, dateLastUpdateUTC: handleNewDateToUTC() }
                    const docRef = doc(projectCollection, nowID)
                    await updateDoc(docRef, projectForDB)
                    feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
                    handleListItemClick(defaultProject)
                } catch (e) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em atualizar!"], messageType: "ERROR" }
                    console.error("Error upddating document: ", e)
                }
            }
            {/*
        */}
            if (props.onAfterSave) {
                props.onAfterSave(feedbackMessage)
            }
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
            <form
                onSubmit={handleSave}>
                <Form
                    title={props.title}
                    subtitle={props.subtitle}>

                    <FormRow>
                        <FormRowColumn unit="4">
                            <InputText
                                id="project-number"
                                isLoading={isLoading}
                                value={project.number}
                                validation={NUMBER_MARK}
                                title="Numero do projeto"
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectNumber}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O do projeto não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                mask="date"
                                maxLength={10}
                                id="project-date"
                                isLoading={isLoading}
                                validation={DATE_MARK}
                                title="Data do projeto"
                                value={project.dateString}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectDate}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O do projeto não pode ficar sem data."
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

            <SelectPersonCompanyForm
                title="Clientes"
                isLoading={isLoading}
                isMultipleSelect={true}
                persons={project.clients}
                onShowMessage={props.onShowMessage}
                buttonTitle="Pesquisar clientes"
                subtitle="Selecione os clientes"
                onSetPersons={handleSetProjectClients}
                validationMessage="Esta pessoa, ou empresa já é um cliente"
            />

            <SelectPropertyForm
                isLoading={isLoading}
                isMultipleSelect={true}
                title="Propriedades"
                properties={project.properties}
                subtitle="Selecione a propriedade"
                onShowMessage={props.onShowMessage}
                buttonTitle="Pesquisar propriedade"
                onSetProperties={handleSetProjectProperties}
                validationMessage="Esta propriedade já está selecionada"
            />

            <SelectProfessionalForm
                isLoading={isLoading}
                isMultipleSelect={false}
                title="Profissional"
                professionals={professionals}
                subtitle="Selecione o profissional"
                onShowMessage={props.onShowMessage}
                buttonTitle="Pesquisar profissional"
                onSetProfessionals={setProfessionals}
                validationMessage="Esta pessoa já é um profissional"
            />

            <form
                onSubmit={handleSave}>
                <FormRow>
                    {props.isBack && (
                        <FormRowColumn unit="3" className="justify-self-start">
                            <Button
                                onClick={props.onBack}
                                isLoading={isLoading}
                                isDisabled={isLoading}
                            >
                                Voltar
                            </Button>
                        </FormRowColumn>
                    )}

                    <FormRowColumn unit={props.isBack ? "3" : "6"} className="justify-self-end">
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