import Button from "./button"
import { Budget } from "../../interfaces/objectInterfaces"

interface StartProjectButtonProps {
    id?: string,
    className?: string,
    isLoading?: boolean,
    canStartProject?: boolean,
    budget?: Budget,
    onClick?: (arg0) => void,
    onAfterClick?: () => void,
    onBeforeClick?: (arg0) => void,
}

export default function StartProjectButton(props: StartProjectButtonProps) {
    const handleCreateProject = async () => {
        if (props.onAfterClick) {
            props.onAfterClick()
        }
        let created = false
        const hasProject = await fetch("api/hasProject", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", id: props?.budget?.id }),
        }).then((res) => res.json()).then((res) => res.hasProject)
        if (!hasProject) {
            const res = await fetch("api/projectByBudget", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: props?.budget }),
            }).then((res) => res.json())
            created = res.id > 0
        }
        if (props.onBeforeClick) {
            props.onBeforeClick(created)
        }
    }

    return (
        <>
            {!props.canStartProject && (
                <Button
                    isLoading={props.isLoading}
                    onClick={handleCreateProject}
                    isHidden={props.budget.status !== "APROVADO"}
                    isDisabled={props.budget.status !== "APROVADO"}
                >
                    Iniciar projeto
                </Button>
            )}
        </>
    )
}
