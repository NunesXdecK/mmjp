import Form from "./form";
import FormRow from "./formRow";
import Button from "../button/button";
import { useEffect, useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import SelectImmobileForm from "./selectImmobileForm";
import InputCheckbox from "../inputText/inputCheckbox";
import { handleNewDateToUTC } from "../../util/dateUtils";
import SelectProfessionalForm from "./selectProfessionalForm";
import SelectPersonCompanyForm from "./selectPersonCompanyForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleProjectValidationForDB } from "../../util/validationUtil";
import { DATE_MARK, NOT_NULL_MARK, TEXT_NOT_NULL_MARK } from "../../util/patternValidationUtil";
import { defaultProject, Professional, Project } from "../../interfaces/objectInterfaces";
import { addDoc, collection, doc, getDocs, limit, orderBy, query, updateDoc } from "firebase/firestore";
import { defaultElementFromBase, ElementFromBase, handlePrepareProjectForDB } from "../../util/converterUtil";
import { CompanyConversor, PersonConversor, ProfessionalConversor, ProjectConversor, ImmobileConversor } from "../../db/converters";
import { COMPANY_COLLECTION_NAME, db, PERSON_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME, PROJECT_COLLECTION_NAME, IMMOBILE_COLLECTION_NAME } from "../../db/firebaseDB";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";

interface ProjectFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canMultiple?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    project?: Project,
    onBack?: (object) => void,
    onAfterSave?: (object, any?) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectForm(props: ProjectFormProps) {
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const immobileCollection = collection(db, IMMOBILE_COLLECTION_NAME).withConverter(ImmobileConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    const [project, setProject] = useState<Project>(props?.project ?? defaultProject)
    const [isFormValid, setIsFormValid] = useState(handleProjectValidationForDB(project).validation)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.project?.oldData ?? defaultElementFromBase)

    const [professionals, setProfessionals] = useState(props?.project?.professional?.id ? [props.project.professional] : [])

    const handleSetProjectTitle = (value) => { setProject({ ...project, title: value }) }
    const handleSetProjectBudget = (value) => { setProject({ ...project, budget: value }) }
    const handleSetProjectNumber = (value) => { setProject({ ...project, number: value }) }
    const handleSetProjectDate = (value) => { setProject({ ...project, dateString: value }) }
    const handleSetProjectProperties = (value) => { setProject({ ...project, properties: value }) }
    const handleSetProjectClients = (value) => {
        let number = ""
        value.map((element, index) => {
            if ("clientCode" in element && element.clientCode !== "") {
                number = number + element.clientCode + "-"
            }
        })
        number = number + new Date().getFullYear() + "-"
        setProject({ ...project, clients: value, number: number })
    }

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

    useEffect(() => {
        if (project.id === "" && professionals.length === 0) {
            handlePutLastProfessional()
        }
    })

    const handlePutLastProfessional = async () => {
        const querySnapshotProfessional = await getDocs(professionalCollection)
        const queryProject = await query(projectCollection,
            orderBy("dateInsertUTC", "desc"),
            limit(1))
        const querySnapshotProject = await getDocs(queryProject)
        querySnapshotProject.forEach((doc) => {
            let project: Project = doc.data()
            querySnapshotProfessional.forEach((docProfessional) => {
                let professional: Professional = docProfessional.data()
                if (project.professional.id === professional.id) {
                    setProfessionals(prof => [professional])
                }
            })
        })
    }

    const handleSave = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }

        let projectForDB = { ...project }

        if (professionals?.length > 0) {
            const docRef = doc(professionalCollection, professionals[0]?.id)
            projectForDB = { ...projectForDB, professional: docRef }
        }

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
                        const docRef = doc(immobileCollection, element.id)
                        propertiesDocRefsForDB = [...propertiesDocRefsForDB, docRef]
                    }
                })
                projectForDB = { ...projectForDB, properties: propertiesDocRefsForDB }
            }

            projectForDB = handlePrepareProjectForDB(projectForDB)

            const isSave = nowID === ""

            if (isSave) {
                try {
                    const docRef = await addDoc(projectCollection, projectForDB)
                    setProject({ ...project, id: docRef.id })
                    projectForDB = { ...projectForDB, id: docRef.id }
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
            if (isMultiple) {
                setProject(defaultProject)
                if (props.onShowMessage) {
                    props.onShowMessage(feedbackMessage)
                }
            }

            if (!isMultiple && props.onAfterSave) {
                props.onAfterSave(feedbackMessage, projectForDB)
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
                            <InputTextAutoComplete
                                id="title"
                                isLoading={isLoading}
                                value={project.title}
                                title="Titulo do projeto"
                                validation={NOT_NULL_MARK}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectTitle}
                                onValidate={handleChangeFormValidation}
                                sugestions={["Georeferenciamento", "Ambiental", "Licenciamento"]}
                                validationMessage="O titulo do projeto não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2" className="sm:place-self-center">
                            <InputCheckbox
                                id="budget"
                                title="É orçamento?"
                                isLoading={isLoading}
                                value={project.budget}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectBudget}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="4">
                            <InputText
                                id="number"
                                isLoading={isLoading}
                                value={project.number}
                                title="Numero do projeto"
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectNumber}
                                onValidate={handleChangeFormValidation}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                mask="date"
                                maxLength={10}
                                id="project-date"
                                isLoading={isLoading}
                                title="Data do projeto"
                                value={project.dateString}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetProjectDate}
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
            </form>

            <SelectPersonCompanyForm
                title="Clientes"
                isLoading={isLoading}
                isMultipleSelect={false}
                subtitle="Selecione o cliente"
                buttonTitle="Adicionar cliente"
                onShowMessage={props.onShowMessage}
                personsAndCompanies={project.clients}
                onSetPersonsAndCompanies={handleSetProjectClients}
                validationMessage="Esta pessoa, ou empresa já é um cliente"
            />

            <SelectImmobileForm
                isLoading={isLoading}
                isMultipleSelect={true}
                title="Imóveis"
                properties={project.properties}
                subtitle="Selecione os imovéis"
                onShowMessage={props.onShowMessage}
                buttonTitle="Adicionar imóveis"
                onSetProperties={handleSetProjectProperties}
                validationMessage="Este imóvel já está selecionado"
            />

            <SelectProfessionalForm
                isLoading={isLoading}
                isMultipleSelect={false}
                title="Profissional"
                professionals={professionals}
                subtitle="Selecione o profissional"
                onShowMessage={props.onShowMessage}
                buttonTitle="Adicionar profissional"
                onSetProfessionals={setProfessionals}
                validationMessage="Esta pessoa já é um profissional"
            />



            <form
                onSubmit={handleSave}>
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