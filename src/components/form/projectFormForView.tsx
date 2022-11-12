import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { handleUTCToDateShow } from "../../util/dateUtils";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { defaultProject, Project } from "../../interfaces/objectInterfaces";

interface ProjectFormForViewProps {
    title?: string,
    subtitle?: string,
    project?: Project,
}

export default function ProjectFormForView(props: ProjectFormForViewProps) {
    const [project, setProject] = useState<Project>(props?.project ?? defaultProject)

    return (
        <Form
            title={props.title}
            subtitle={props.subtitle}>
            <FormRow>
                <FormRowColumn unit="3">
                    <InputTextAutoComplete
                        id="title"
                        isDisabled
                        value={project.title}
                        title="Titulo do projeto"
                    />
                </FormRowColumn>

                <FormRowColumn unit="2">
                    <InputText
                        id="number"
                        isDisabled
                        title="Numero"
                        value={project.number}
                    />
                </FormRowColumn>

                <FormRowColumn unit="1">
                    <InputText
                        mask="date"
                        isDisabled
                        title="Data"
                        maxLength={10}
                        id="project-date"
                        value={handleUTCToDateShow(project.dateDue?.toString())}
                    />
                </FormRowColumn>
            </FormRow>
        </Form>
    )
}