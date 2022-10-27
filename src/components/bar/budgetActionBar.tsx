import ActionBar from "./actionBar";
import Button from "../button/button";
import MenuButton from "../button/menuButton";
import DropDownButton from "../button/dropDownButton";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleGetDateFormatedToUTC } from "../../util/dateUtils";
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
        let budget = props.budget
        if (status?.length > 0) {
            budget = { ...budget, status: status }
        }
        let resProject = await handleSaveBudgetInner(budget, true)
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
            if (budget.dateString.length > 0) {
                budget = { ...budget, date: handleGetDateFormatedToUTC(budget.dateString) }
            }
            props.onAfterSave(feedbackMessage, budget)
        }
    }

    return (
        <ActionBar className={props.className + " bg-slate-50"}>
            <div className="w-full flex flex-row justify-between">
                <Button
                    isLoading={props.isLoading}
                    onClick={handleSave}
                >
                    Salvar
                </Button>
                <DropDownButton
                    isLeft
                    title="...">
                    <div className="w-full flex flex-col">
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.budget.status !== "ORÇAMENTO"}
                            isDisabled={props.budget.status !== "ORÇAMENTO"}
                            onClick={() => {
                                handleSave("FINALIZADO")
                            }}
                        >
                            Iniciar projeto
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.budget.status === "ORÇAMENTO"}
                            isDisabled={props.budget.status === "ORÇAMENTO"}
                            onClick={() => {
                                handleSave("ORÇAMENTO")
                            }}
                        >
                            Reativar orçamento
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                        >
                            Imprimir orçamento
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                        >
                            Imprimir contrato
                        </MenuButton>
                        <MenuButton
                            isLoading={props.isLoading}
                            isHidden={props.budget.status !== "ORÇAMENTO"}
                            isDisabled={props.budget.status !== "ORÇAMENTO"}
                            onClick={() => {
                                handleSave("ARQUIVADO")
                            }}
                        >
                            Arquivar orçamento
                        </MenuButton>
                    </div>
                </DropDownButton>
            </div>
        </ActionBar>
    )
}
