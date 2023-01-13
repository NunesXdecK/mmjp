import ActionBar from "./actionBar";
import Button from "../button/button";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { BudgetPayment, defaultBudgetPayment } from "../../interfaces/objectInterfaces";
import { handleValidationOnlyTextNotNull, ValidationReturn } from "../../util/validationUtil";

interface BudgetPaymentActionBarFormProps {
    className?: string,
    budgetId?: number,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    budgetPayment?: BudgetPayment,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any?, boolean?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export const handleBudgetPaymentValidationForDB = (budgetPayment: BudgetPayment) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let titleCheck = true
    if (!handleValidationOnlyTextNotNull(budgetPayment?.title)) {
        validation = { ...validation, messages: [...validation.messages, "O campo nome está em branco."] }
        titleCheck = false
    }
    validation = { ...validation, validation: titleCheck }
    return validation
}

export const handleBudgetPaymentForDB = (budgetPayment: BudgetPayment) => {
    budgetPayment = {
        ...budgetPayment,
    }
    return budgetPayment
}

export const handleSaveBudgetPaymentInner = async (budgetPayment, budgetId, history) => {
    let res = { status: "ERROR", id: 0, budgetPayment: budgetPayment }
    budgetPayment = handleBudgetPaymentForDB(budgetPayment)
    try {
        const saveRes = await fetch("api/budgetPayment", {
            method: "POST",
            body: JSON.stringify({
                token: "tokenbemseguro",
                data: budgetPayment,
                id: budgetId,
                history: history
            }),
        }).then((res) => res.json())
        if (saveRes.status === "SUCCESS") {
            res = { ...res, status: "SUCCESS", id: saveRes.id, budgetPayment: { ...budgetPayment, id: saveRes.id } }
        }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export default function BudgetPaymentActionBarForm(props: BudgetPaymentActionBarFormProps) {
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
        let budgetPayment = props.budgetPayment
        const isValid = handleBudgetPaymentValidationForDB(budgetPayment)
        if (!isValid.validation) {
            handleSetIsLoading(false)
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        if (props.budgetId > 0) {
            let res = await handleSaveBudgetPaymentInner(budgetPayment, props?.budgetId ?? 0, true)
            budgetPayment = { ...budgetPayment, id: res.id }
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
            props.onSet(defaultBudgetPayment)
        } else if (isForCloseModal) {
            props.onSet(budgetPayment)
        }
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, budgetPayment, isForCloseModal)
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
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(false)}
                    >
                        Salvar e sair
                    </Button>
                </div>
            </div>
        </ActionBar>
    )
}
