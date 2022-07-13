import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import IOSModal from "../modal/iosModal";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import ProjectList from "../list/projectList";
import { Project } from "../../interfaces/objectInterfaces";
import { FeedbackMessage } from "../modal/feedbackMessageModal";

interface SelectProjectFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    inputTitle?: string,
    validation?: string,
    buttonTitle?: string,
    validationMessage?: string,
    isLoading?: boolean,
    isBudgetAllowed?: boolean,
    isMultipleSelect?: boolean,
    projects?: Project[],
    onSetProjects?: (array) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SelectProjectForm(props: SelectProjectFormProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleAddProject = (project) => {
        let localProjects = props.projects
        let canAdd = true

        if (props.isMultipleSelect) {
            localProjects?.map((element, index) => {
                if (element.title === project.title) {
                    canAdd = false
                }
            })
        }

        if (canAdd) {
            if (props.isMultipleSelect) {
                localProjects = [...localProjects, project]
            } else {
                localProjects = [project]
            }
            if (props.onSetProjects) {
                props.onSetProjects(localProjects)
                setIsOpen(false)
            }
        } else {
            let feedbackMessage: FeedbackMessage = { messages: [props?.validationMessage], messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
    }

    const handleRemoveProject = (event, project) => {
        event.preventDefault()
        if (!props.isMultipleSelect) {
            props.onSetProjects([])
        } else {
            let localProjects = props.projects
            if (localProjects.length > -1) {
                let index = localProjects.indexOf(project)
                localProjects.splice(index, 1)
                if (props.onSetProjects) {
                    props.onSetProjects(localProjects)
                }
            }
        }
    }

    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>
                <FormRow>
                    <FormRowColumn unit="6" className="justify-self-end">
                        <Button
                            type="submit"
                            isLoading={props.isLoading}
                            isDisabled={props.isLoading}
                            onClick={() => setIsOpen(true)}
                        >
                            {props.buttonTitle}
                        </Button>
                    </FormRowColumn>
                </FormRow>

                {props.projects?.map((element, index) => (
                    <form key={index + element.dateInsertUTC}
                        onSubmit={(event) => handleRemoveProject(event, element)}>
                        <FormRow>
                            <FormRowColumn unit="4">
                                <InputText
                                    title="Número"
                                    isDisabled={true}
                                    value={element.number}
                                    isLoading={props.isLoading}
                                    id={"project-number-" + index}
                                />
                            </FormRowColumn>

                            <FormRowColumn unit="2"
                                className="self-end justify-self-end">
                                <Button
                                    type="submit"
                                    color="red"
                                    isLoading={props.isLoading}
                                    isDisabled={props.isLoading}
                                >
                                    X
                                </Button>
                            </FormRowColumn>
                        </FormRow>
                    </form>
                ))}
            </Form>

            <IOSModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <ProjectList
                    isBudgetAllowed={props.isBudgetAllowed}
                    onListItemClick={handleAddProject} />
            </IOSModal>
        </>
    )
}