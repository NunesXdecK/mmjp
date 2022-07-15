import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import SelectProjectForm from "./selectProjectForm";
import InputCheckbox from "../inputText/inputCheckbox";
import { handleNewDateToUTC } from "../../util/dateUtils";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleMountNumberCurrency } from "../../util/maskUtil";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { handleProjectPaymentValidationForDB } from "../../util/validationUtil";
import { ProjectConversor, ProjectPaymentConversor } from "../../db/converters";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { defaultProjectPayment, Project, ProjectPayment } from "../../interfaces/objectInterfaces";
import { db, PROJECT_COLLECTION_NAME, PROJECT_PAYMENT_COLLECTION_NAME } from "../../db/firebaseDB";

interface ProjectPaymentFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    project?: Project,
    projectPayments?: ProjectPayment[],
    onBack?: (object) => void,
    onAfterSave?: (object) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectPaymentForm(props: ProjectPaymentFormProps) {
    const projectPaymentCollection = collection(db, PROJECT_PAYMENT_COLLECTION_NAME).withConverter(ProjectPaymentConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)

    const [projectPayment, setProjectPayment] = useState<ProjectPayment>(defaultProjectPayment)
    const [isFormValid, setIsFormValid] = useState(handleProjectPaymentValidationForDB(projectPayment).validation)

    const [projectPayments, setProjectPayments] = useState<ProjectPayment[]>(props.projectPayments ?? [])
    const [projects, setProjects] = useState(props?.project?.id ? [props.project] : [])

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

    const handleEdit = (element, index) => {
        setIsFormValid(true)
        element = { ...element, index: index }
        setProjectPayment(oldProjectPayment => element)
    }

    const handleRemove = async () => {
        let localProjectPayments = projectPayments

        if (localProjectPayments.length > -1) {
            let index = localProjectPayments.indexOf(projectPayment)
            localProjectPayments.splice(index, 1)
            setProjectPayments(oldProjectPayments => localProjectPayments)
        }

        if (projectPayment.id !== "") {
            const docRef = doc(projectPaymentCollection, projectPayment.id)
            await deleteDoc(docRef)
        }

        const feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        setProjectPayment({ ...defaultProjectPayment, project: projects[0] })
        setIsOpen(false)
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleAdd = () => {
        event.preventDefault()
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }

        let projectPaymentForDB = { ...projectPayment }
        let localProjectPayments = [...projectPayments]
        if (projects?.length > 0) {
            const docRef = doc(projectCollection, projects[0]?.id)
            projectPaymentForDB = { ...projectPaymentForDB, project: docRef }
        }

        const isValid = handleProjectPaymentValidationForDB(projectPaymentForDB)
        if (isValid.validation) {
            if (projectPaymentForDB.index > -1) {
                projectPaymentForDB = { ...projectPaymentForDB, project: projects[0], description: projectPaymentForDB.description.trim() }
                const updatedProjectPaymentForDB = [
                    ...localProjectPayments.slice(0, projectPaymentForDB.index),
                    projectPaymentForDB,
                    ...localProjectPayments.slice(projectPaymentForDB.index + 1, localProjectPayments.length),
                ]
                setProjectPayments(oldProjectPayments => updatedProjectPaymentForDB)
            } else {
                projectPaymentForDB = { ...projectPaymentForDB, project: projects[0], description: projectPaymentForDB.description.trim() }
                setProjectPayments(oldProjectPayments => [...oldProjectPayments, projectPaymentForDB])
            }
            setProjectPayment({ ...defaultProjectPayment, project: projects[0] })
            feedbackMessage = { ...feedbackMessage, messages: ["Adicionado com sucesso!"], messageType: "SUCCESS" }
            document.getElementById("description")?.focus()
        } else {
            feedbackMessage = { ...feedbackMessage, messages: isValid.messages, messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
        setIsLoading(false)
    }

    const handleSave = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Não há pagamentos informados"], messageType: "WARNING" }
        let projectPaymentsForDB: ProjectPayment[] = [...projectPayments]
        let project = {}

        if (projects?.length > 0) {
            project = doc(projectCollection, projects[0]?.id)
        }

        if (projectPaymentsForDB.length > 0) {
            try {
                let messages = []
                projectPaymentsForDB.map(async (element: ProjectPayment, index) => {
                    if (element.id === "") {
                        element = { ...element, project: project, index: index, dateInsertUTC: handleNewDateToUTC() }
                        const docRef = await addDoc(projectPaymentCollection, element)
                        projectPaymentsForDB[index] = { ...element, id: docRef.id, project: projects[0] }
                        messages = [...messages, element.description + " foi salvo com sucesso!"]
                    } else {
                        if (element.dateInsertUTC === 0) {
                            element = { ...element, project: project, index: index, dateInsertUTC: handleNewDateToUTC(), dateLastUpdateUTC: handleNewDateToUTC() }
                        } else {
                            element = { ...element, project: project, index: index, dateLastUpdateUTC: handleNewDateToUTC() }
                        }
                        const docRef = doc(projectPaymentCollection, element.id)
                        await updateDoc(docRef, element)
                        projectPaymentsForDB[index] = { ...element, project: projects[0] }
                        messages = [...messages, element.description + " foi atualizado com sucesso!"]
                    }

                    if ((index + 1) === projectPaymentsForDB.length) {
                        setIsLoading(false)
                        feedbackMessage = { ...feedbackMessage, messages: messages, messageType: "SUCCESS" }
                        if (props.onShowMessage) {
                            props.onShowMessage(feedbackMessage)
                        }
                        if (props.onAfterSave) {
                            props.onAfterSave(feedbackMessage)
                        }
                    }
                })
            } catch (e) {
                feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                console.error("Error adding document: ", e)
                setIsLoading(false)
            }
            {/*
        */}
        } else {
            feedbackMessage = { ...feedbackMessage, messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    return (
        <>
            <SelectProjectForm
                isLocked
                title="Projeto"
                projects={projects}
                isLoading={isLoading}
                isBudgetAllowed={false}
                isMultipleSelect={false}
                onSetProjects={setProjects}
                subtitle="Selecione o projeto"
                buttonTitle="Adicionar projeto"
                onShowMessage={props.onShowMessage}
                validationMessage="Esta projeto já foi selecionado"
            />

            <form
                onSubmit={handleAdd}>
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
                        <FormRowColumn unit="6" className="">
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
                    <FormRow>
                        <FormRowColumn unit="6" className="flex content-end justify-end">
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                isDisabled={!isFormValid}
                            >
                                {projectPayment.index + 1 > 0 ? "Editar" : "Adicionar"}
                            </Button>
                        </FormRowColumn>
                    </FormRow>
                </Form>
            </form>

            <Form
                title="Lista de pagamentos"
                subtitle="">
                {projectPayments.map((element: ProjectPayment, index) => (
                    <FormRow className="shadow-md" key={index + element.value}>
                        <FormRowColumn unit="6" className="flex flex-col sm:flex-row justify-between content-center">
                            <div className="self-center flex sm:flex-row">
                                <span className="mr-2 self-center">{index + 1}</span>
                                {element.payed ?
                                    (<p className="px-2 py-1 ml-2 rounded-md bg-green-600 text-white self-center">Pago</p>)
                                    :
                                    (<p className="px-2 py-1 ml-2 invisible">Pago</p>)
                                }
                                {element.description && <span className="ml-2">{element.description}</span>}
                                {element.value && <span className="ml-2"> R$ {handleMountNumberCurrency(element.value, ".", ",", 3, 2)}</span>}
                            </div>
                            <div className="w-full sm:w-auto self-center mt-2 sm:mt-0 flex justify-between">
                                <Button
                                    onClick={() => handleEdit(element, index)}
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                >
                                    <PencilAltIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                </Button>
                                <Button
                                    color="red"
                                    className="ml-2"
                                    onClick={() => {
                                        setProjectPayment(element)
                                        setIsOpen(true)
                                    }}
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                >
                                    <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                </Button>
                            </div>
                        </FormRowColumn>
                    </FormRow>
                ))}
            </Form>

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
                            isDisabled={projectPayments.length === 0}
                        >
                            Salvar
                        </Button>
                    </FormRowColumn>
                </FormRow>
            </form>

            <WindowModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <p>Deseja realmente deletar este Pagamento {projectPayment.description}?</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={() => setIsOpen(false)}
                    >
                        Voltar
                    </Button>
                    <Button
                        color="red"
                        onClick={() => handleRemove()}
                    >
                        Excluir
                    </Button>
                </div>

            </WindowModal>
        </>
    )
}