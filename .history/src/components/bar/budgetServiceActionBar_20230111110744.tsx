import ActionBar from "./actionBar";
import Button from "../button/button";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { BudgetService, defaultBudgetService } from "../../interfaces/objectInterfaces";
import { handleValidationOnlyTextNotNull, ValidationReturn } from "../../util/validationUtil";

interface BudgetServiceActionBarFormProps {
    className?: string,
    budgetId?: number,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    budgetService?: BudgetService,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any?, boolean?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export const handleBudgetServiceValidationForDB = (budgetService: BudgetService) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let titleCheck = true
    if (!handleValidationOnlyTextNotNull(budgetService?.title)) {
        validation = { ...validation, messages: [...validation.messages, "O campo nome está em branco."] }
        titleCheck = false
    }
    validation = { ...validation, validation: titleCheck }
    return validation
}

export const handleBudgetServiceForDB = (budgetService: BudgetService) => {
    budgetService = {
        ...budgetService,
    }
    return budgetService
}

export const handleSaveBudgetServiceInner = async (budgetService, history) => {
    let res = { status: "ERROR", id: 0, budgetService: budgetService }
    budgetService = handleBudgetServiceForDB(budgetService)
    try {
        const saveRes = await fetch("api/budgetService", {
            method: "POST",
            body: JSON.stringify({
                token: "tokenbemseguro",
                data: budgetService,
                history: history
            }),
        }).then((res) => res.json())
        if (saveRes.status === "SUCCESS") {
            res = { ...res, status: "SUCCESS", id: saveRes.id, budgetService: { ...budgetService, id: saveRes.id } }
        }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export default function BudgetServiceActionBarForm(props: BudgetServiceActionBarFormProps) {
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

    const handleSave = async (isForCloseModal) => {
        handleSetIsLoading(true)
        let budgetService = props.budgetService
        const isValid = handleBudgetServiceValidationForDB(budgetService)
        if (!isValid.validation) {
            handleSetIsLoading(false)
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        if (props.budgetId > 0) {
            let res = await handleSaveBudgetServiceInner(budgetService, true)
            budgetService = { ...budgetService, id: res.id }
            if (res.status === "ERROR") {
                const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
                handleShowMessage(feedbackMessage)
                handleSetIsLoading(false)
                return
            }
        }
        handleSetIsLoading(false)
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (props.isMultiple && props.onSet) {
            props.onSet(defaultBudgetService)
        } else if (isForCloseModal) {
            props.onSet(budgetService)
        }
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, budgetService, isForCloseModal)
        }
    }

    return (
        <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
            <div className="w-full flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(true)}
                    >
                        Salvar
                    </Button>
                    {/*
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(false)}
                    >
                        Salvar e sair
                    </Button>
                    */}
                </div>
            </div>
        </ActionBar>
    )
}
