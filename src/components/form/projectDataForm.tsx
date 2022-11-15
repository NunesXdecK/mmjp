import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import ProjectView from "../view/projectView";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { Project } from "../../interfaces/objectInterfaces";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import InputSelectPersonCompany from "../inputText/inputSelectPersonCompany";
import ServicePage from "../page/ServicePage";
import PaymentPage from "../page/PaymentPage";
import InputTextArea from "../inputText/inputTextArea";

interface ProjectDataFormProps {
    title?: string,
    subtitle?: string,
    index?: number,
    isPrint?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    project?: Project,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
}

export default function ProjectDataForm(props: ProjectDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(true)

    const handleSetTitle = (value) => { handleSet({ ...props.project, title: value }) }
    const handleSetNumber = (value) => { handleSet({ ...props.project, number: value }) }
    const handleSetDate = (value) => { handleSet({ ...props.project, dateString: value }) }
    const handleSetClient = (value) => { handleSet({ ...props.project, clients: [value] }) }
    const handleSetServices = (value) => { handleSet({ ...props.project, services: value }) }
    const handleSetDescription = (value) => { handleSet({ ...props.project, description: value }) }

    const handleSet = (value: Project) => {
        if (props.onSet) {
            if (props.index) {
                props.onSet(value, props.index)
            } else {
                props.onSet(value)
            }
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    return (
        <>
            <Form
                title={props.title ?? "Dados básicos"}
                subtitle={props.subtitle ?? "Informe os dados básicos"}
            >
                <FormRow>
                    <FormRowColumn unit="1">
                        <InputText
                            title="Status"
                            isDisabled={true}
                            id="project-status"
                            value={props.project.status}
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="1">
                        <InputText
                            title="Numero"
                            id="project-number"
                            isLoading={props.isLoading}
                            value={props.project.number}
                            onSetText={handleSetNumber}
                            onValidate={handleChangeFormValidation}
                            isDisabled={
                                props.isDisabled ||
                                (props.project.status === "FINALIZADO" || props.project.status === "ARQUIVADO")
                            }
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="4">
                        <InputTextAutoComplete
                            onBlur={props.onBlur}
                            value={props.project.title}
                            onSetText={handleSetTitle}
                            validation={NOT_NULL_MARK}
                            title="Titulo do orçamento"
                            isLoading={props.isLoading}
                            onValidate={handleChangeFormValidation}
                            id={"project-title" + (props.index ? "-" + props.index : "")}
                            validationMessage="O titulo do orçamento não pode ficar em branco."
                            sugestions={[
                                "Ambiental",
                                "Desmembramento",
                                "Georeferenciamento",
                                "União",
                                "Licenciamento"
                            ]}
                            isDisabled={
                                props.isDisabled ||
                                (props.project.status === "FINALIZADO" || props.project.status === "ARQUIVADO")
                            }
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="2">
                        <InputText
                            mask="date"
                            title="Prazo"
                            maxLength={10}
                            onBlur={props.onBlur}
                            onSetText={handleSetDate}
                            isLoading={props.isLoading}
                            value={props.project.dateString}
                            onValidate={handleChangeFormValidation}
                            id={"project-date" + (props.index ? "-" + props.index : "")}
                            isDisabled={
                                props.isDisabled ||
                                (props.project.status === "FINALIZADO" || props.project.status === "ARQUIVADO")
                            }
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="6">
                        <InputSelectPersonCompany
                            title="Cliente"
                            onBlur={props.onBlur}
                            onSet={handleSetClient}
                            isLoading={props.isLoading}
                            value={props.project.clients[0]?.name}
                            id={"project-client" + (props.index ? "-" + props.index : "")}
                            isDisabled={
                                props.isDisabled ||
                                (props.project.status === "FINALIZADO" || props.project.status === "ARQUIVADO")
                            }
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="6" className="">
                        <InputTextArea
                            title="Descrição"
                            onBlur={props.onBlur}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onSetText={handleSetDescription}
                            value={props.project.description}
                            id={"project-description" + (props.index ? "-" + props.index : "")}
                        />
                    </FormRowColumn>
                </FormRow>
            </Form>
            {props.project?.id?.length > 0 && (
                <>
                    <Form
                        title="Serviços"
                        subtitle="Adicione os serviços"
                    >
                        <ServicePage
                            canSave
                            isStatusDisabled
                            projectId={props.project.id}
                            onSetPage={handleSetServices}
                            getInfo={props.project.id.length > 0}
                            onShowMessage={props.onShowMessage}
                            isDisabled={
                                props.isDisabled ||
                                props.project?.id?.length === 0 ||
                                (props.project?.status === "FINALIZADO" || props.project?.status === "ARQUIVADO")
                            }
                        />
                    </Form>
                    <Form
                        title="Pagamentos"
                        subtitle="Adicione os pagamentos"
                    >
                        <PaymentPage
                            canSave
                            isStatusDisabled
                            projectId={props.project.id}
                            onSetPage={handleSetServices}
                            getInfo={props.project.id.length > 0}
                            onShowMessage={props.onShowMessage}
                            isDisabled={
                                props.isDisabled ||
                                props.project?.id?.length === 0 ||
                                (props.project?.status === "FINALIZADO" || props.project?.status === "ARQUIVADO")
                            }
                        />
                    </Form>
                </>
            )}
        </>
    )
}
