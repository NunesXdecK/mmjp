import Form from "./form";
import Button from "../button/button";
import ActionBar from "../bar/actionBar";
import MenuButton from "../button/menuButton";
import BudgetDataForm from "./budgetDataForm";
import { Budget, defaultBudget } from "../../interfaces/objectInterfaces";
import DropDownButton from "../button/dropDownButton";
import { handleBudgetValidationForDB } from "../../util/validationUtil";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { useState } from "react";
import InputCheckbox from "../inputText/inputCheckbox";

interface BudgetForm {
    title?: string,
    subtitle?: string,
    isDisabled?: boolean,
    budget?: Budget,
    onSet?: (any) => void,
    onAfterSave?: (object, any?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function BudgetForm(props: BudgetForm) {
    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)

    const handleValidation = (budget) => {

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
        setIsLoading(true)
        let resProject = await handleSaveBudgetInner(props.budget, true)
        if (resProject.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            setIsLoading(false)
            return
        }
        setIsLoading(false)
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (isMultiple && props.onSet) {
            props.onSet(defaultBudget)
        }
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, props.budget)
        }
    }

    const handleActionBar = () => {
        return (
            <ActionBar>
                <Button
                    onClick={handleSave}
                >
                    Salvar
                </Button>
                <DropDownButton
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
            </ActionBar>

        )
    }

    return (
        <>
            {handleActionBar()}
            <ActionBar>
                <InputCheckbox
                    id="budget-multiple"
                    value={isMultiple}
                    isLoading={isLoading}
                    onSetText={setIsMultiple}
                    title="Cadastro multiplo?"
                    isDisabled={props.isDisabled}
                />
            </ActionBar>
            <BudgetDataForm
                onSet={props.onSet}
                budget={props.budget}
                isLoading={isLoading}
                isDisabled={props.isDisabled}
            />
            {handleActionBar()}
        </>
    )
}

