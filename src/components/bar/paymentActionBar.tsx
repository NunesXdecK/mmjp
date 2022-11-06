import ActionBar from "./actionBar";
import Button from "../button/button";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleGetDateFormatedToUTC } from "../../util/dateUtils";
import { handlePaymentValidationForDB } from "../../util/validationUtil";
import { Payment, defaultPayment } from "../../interfaces/objectInterfaces";
import DropDownButton from "../button/dropDownButton";
import MenuButton from "../button/menuButton";

interface PaymentActionBarFormProps {
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    payment?: Payment,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function PaymentActionBarForm(props: PaymentActionBarFormProps) {
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

    const handleSavePaymentInner = async (payment, history) => {
        let res = { status: "ERROR", id: "", payment: payment }
        try {
            const saveRes = await fetch("api/payment", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: payment, history: history }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, payment: { ...payment, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async (status?: "NORMAL" | "ARQUIVADO" | "FINALIZADO" | "PENDENTE") => {
        const isPaymentValid = handlePaymentValidationForDB(props.payment)
        if (!isPaymentValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: [...isPaymentValid.messages], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        handleSetIsLoading(true)
        let payment: Payment = props.payment
        if (status?.length > 0) {
            payment = { ...payment, status: status }
        }
        let res = await handleSavePaymentInner(payment, true)
        payment = { ...payment, id: res.id }
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            handleSetIsLoading(false)
            return
        }
        handleSetIsLoading(false)
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (props.isMultiple && props.onSet) {
            props.onSet(defaultPayment)
        }
        if (props.onAfterSave) {
            if (payment.dateString?.length > 0) {
                payment = { ...payment, dateDue: handleGetDateFormatedToUTC(payment.dateString) }
            }
            props.onAfterSave(feedbackMessage, payment)
        }
    }

    return (
        <>
            <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
                <div className="w-full flex flex-row justify-between">
                    <Button
                        onClick={handleSave}
                        isLoading={props.isLoading}
                    >
                        Salvar
                    </Button>
                    <DropDownButton
                        isLeft
                        title="...">
                        <div className="w-full flex flex-col">
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.payment.status !== "NORMAL"}
                                isDisabled={props.payment.status !== "NORMAL"}
                                onClick={() => {
                                    handleSave("FINALIZADO")
                                }}
                            >
                                Finalizar pagamento
                            </MenuButton>
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.payment.status !== "NORMAL"}
                                isDisabled={props.payment.status !== "NORMAL"}
                                onClick={() => {
                                    handleSave("ARQUIVADO")
                                }}
                            >
                                Arquivar pagamento
                            </MenuButton>
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.payment.status === "NORMAL"}
                                isDisabled={props.payment.status === "NORMAL"}
                                onClick={() => {
                                    handleSave("NORMAL")
                                }}
                            >
                                Reativar pagamento
                            </MenuButton>
                        </div>
                    </DropDownButton>
                </div>
            </ActionBar>
        </>
    )
}
