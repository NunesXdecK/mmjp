import ActionBar from "./actionBar";
import Button from "../button/button";
import MenuButton from "../button/menuButton";
import DropDownButton from "../button/dropDownButton";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleValidationNotNull, ValidationReturn } from "../../util/validationUtil";
import { Payment, defaultPayment, PaymentStatus } from "../../interfaces/objectInterfaces";

interface PaymentActionBarFormProps {
    className?: string,
    projectId?: number,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    payment?: Payment,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any, boolean) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export const handlePaymentValidationForDB = (payment: Payment, isForValidService?) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let valueCheck = handleValidationNotNull(payment.value)
    let titleCheck = handleValidationNotNull(payment.title)
    let projectCheck = true
    if (!valueCheck) {
        validation = { ...validation, messages: [...validation.messages, "O pagamento " + (payment.title) + " está com o valor em branco."] }
    }
    if (!titleCheck) {
        validation
            = { ...validation, messages: [...validation.messages, "O pagamento " + (payment.title) + " está com a descrição em branco."] }
    }
    if (isForValidService) {
        projectCheck = payment?.project?.id > 0 ?? false
        if (!projectCheck) {
            validation = { ...validation, messages: [...validation.messages, "O pagamento " + (payment.title) + " precisa de um serviço referente."] }
        }
    }
    validation = { ...validation, validation: titleCheck && valueCheck && projectCheck }
    return validation
}

export const handlePaymentForDB = (payment: Payment) => {
    payment = {
        ...payment,
        description: payment.description?.trim(),
    }
    return payment
}

export const handleSavePaymentInner = async (payment, history) => {
    let res = { status: "ERROR", id: 0 }
    payment = handlePaymentForDB(payment)
    try {
        const saveRes = await fetch("api/payment", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: payment, history: history }),
        }).then((res) => res.json())
        res = { ...res, status: saveRes.status, id: saveRes.id }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
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

    const handleSave = async (status: PaymentStatus, isForCloseModal) => {
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
        if (props.projectId > 0) {
            payment = { ...payment, project: { id: props.projectId } }
        }
        let res = await handleSavePaymentInner(payment, true)
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            handleSetIsLoading(false)
            return
        }
        payment = { ...payment, id: res.id }
        handleSetIsLoading(false)
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (props.isMultiple && props.onSet) {
            props.onSet(defaultPayment)
        } else if (isForCloseModal) {
            props.onSet(payment)
        }
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, payment, isForCloseModal)
        }
    }

    return (
        <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
            <div className="w-full flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(props.payment.status, true)}
                    >
                        Salvar
                    </Button>
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(props.payment.status, false)}
                    >
                        Salvar e sair
                    </Button>
                    <div className="hidden sm:flex sm:flex-row gap-2 flex-wrap">
                        <Button
                            isLoading={props.isLoading}
                            isHidden={props.payment.status === "PAGO"}
                            isDisabled={props.payment.status === "PAGO"}
                            onClick={() => {
                                handleSave("PAGO", true)
                            }}
                        >
                            Finalizar pagamento
                        </Button>
                        <Button
                            isLoading={props.isLoading}
                            isHidden={props.payment.status === "EM ABERTO"}
                            isDisabled={props.payment.status === "EM ABERTO"}
                            onClick={() => {
                                handleSave("EM ABERTO", true)
                            }}
                        >
                            Reativar pagamento
                        </Button>
                    </div>
                </div>
                <div className="block sm:hidden">
                    <DropDownButton
                        isLeft
                        title="..."
                        isLoading={props.isLoading}
                    >
                        <div className="w-full flex flex-col">
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.payment.status === "PAGO"}
                                isDisabled={props.payment.status === "PAGO"}
                                onClick={() => {
                                    handleSave("PAGO", true)
                                }}
                            >
                                Finalizar pagamento
                            </MenuButton>
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.payment.status === "EM ABERTO"}
                                isDisabled={props.payment.status === "EM ABERTO"}
                                onClick={() => {
                                    handleSave("EM ABERTO", true)
                                }}
                            >
                                Reativar pagamento
                            </MenuButton>
                        </div>
                    </DropDownButton>
                </div>
            </div>
        </ActionBar>
    )
}
