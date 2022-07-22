import Form from "./form";
import FormRow from "./formRow";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import ProjectStageDataForm from "./projectStageDataForm";
import { defaultProjectStage, ProjectStage } from "../../interfaces/objectInterfaces";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import { FeedbackMessage } from "../modal/feedbackMessageModal";

interface ProjectStageFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    isLoading?: boolean,
    projectStages?: ProjectStage[],
    onSetProjectStages?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectStageForm(props: ProjectStageFormProps) {
    const handleSetText = (object, index) => {
        if (props.onSetProjectStages) {
            props.onSetProjectStages([
                ...props.projectStages.slice(0, index),
                object,
                ...props.projectStages.slice(index + 1, props.projectStages.length),
            ])
        }
    }

    const handeOnDelete = async (index: number) => {
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        let localProjectStages = [...props.projectStages]
        let localProjectStage = localProjectStages[index]
        let canDelete = true

        if (localProjectStage.id && localProjectStage.id !== "") {
            const res = await fetch("api/projectStage", {
                method: "DELETE",
                body: JSON.stringify({ token: "tokenbemseguro", id: localProjectStage.id }),
            }).then((res) => res.json())

            if (res.status !== "SUCCESS") {
                canDelete = false
                feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
            }
        }

        if (canDelete) {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
            localProjectStages.splice(index, 1)
            if (props.onSetProjectStages) {
                props.onSetProjectStages(localProjectStages)
            }
        }

        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    return (
        <Form
            title={props.title}
            subtitle={props.subtitle}
        >
            <FormRow>
                <FormRowColumn unit="6" className="flex justify-end">
                    <Button
                        isLoading={props.isLoading}
                        isDisabled={props.isLoading}
                        onClick={() => {
                            if (props.onSetProjectStages) {
                                props.onSetProjectStages([...props.projectStages, { ...defaultProjectStage, dateString: handleUTCToDateShow(handleNewDateToUTC() + ""), index: props.projectStages?.length }])
                            }
                        }}>
                        Adicionar etapa
                    </Button>
                </FormRowColumn>
            </FormRow>

            {props?.projectStages?.map((element, index) => (
                <ProjectStageDataForm
                    key={index}
                    index={index}
                    onDelete={handeOnDelete}
                    onSetText={handleSetText}
                    isLoading={props.isLoading}
                    projectStages={props.projectStages}
                />
            ))}

        </Form>
    )
}