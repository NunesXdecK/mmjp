import ActionBar from "./actionBar";
import Button from "../button/button";
import MenuButton from "../button/menuButton";
import DropDownButton from "../button/dropDownButton";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleBudgetValidationForDB } from "../../util/validationUtil";
import { Budget, defaultBudget } from "../../interfaces/objectInterfaces";

interface BudgetActionBarFormProps {
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    budget?: Budget,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function BudgetActionBarForm(props: BudgetActionBarFormProps) {

    const handleSetIsLoading = (value: boolean) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleSaveBudgetInner = async (budget, history) => {
        let res = { status: "ERROR", id: "", budget: budget }
        try {
            const saveRes = await fetch("api/budget", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: budget, history: history }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, budget: { ...budget, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async (status?: "ORÇAMENTO" | "ARQUIVADO" | "FINALIZADO") => {
        const isBudgetValid = handleBudgetValidationForDB(props.budget)
        if (!isBudgetValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: [...isBudgetValid.messages], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        handleSetIsLoading(true)
        let resProject = await handleSaveBudgetInner(props.budget, true)
        if (resProject.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            handleSetIsLoading(false)
            return
        }
        handleSetIsLoading(false)
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (props.isMultiple && props.onSet) {
            props.onSet(defaultBudget)
        }
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, props.budget)
        }
    }

    return (
        <ActionBar className={props.className}>
            <div className="w-full flex flex-row justify-between">
                <Button
                    isLoading={props.isLoading}
                    isDisabled={props.isLoading}
                    onClick={handleSave}
                >
                    Salvar
                </Button>
                <DropDownButton
                    isLeft
                    title="...">
                    <div className="w-full flex flex-col">
                        <MenuButton>
                            Arquivar
                        </MenuButton>
                        <MenuButton>
                            Imprimir orçamento
                        </MenuButton>
                        <MenuButton>
                            Imprimir contrato
                        </MenuButton>
                        <MenuButton>
                            Iniciar projeto
                        </MenuButton>
                        <MenuButton>
                            Reativar orçamento
                        </MenuButton>
                    </div>
                </DropDownButton>
            </div>
        </ActionBar>

    )
}
