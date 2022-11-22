import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { NavBarPath } from "../bar/navBar"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import { PlusIcon } from "@heroicons/react/solid"
import FormRowColumn from "../form/formRowColumn"
import PaymentDataForm from "../form/paymentDataForm"
import { handleUTCToDateShow } from "../../util/dateUtils"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import PaymentStatusButton from "../button/paymentStatusButton"
import ProjectNumberListItem from "../list/projectNumberListItem"
import { Payment, defaultPayment } from "../../interfaces/objectInterfaces"
import PaymentActionBarForm, { handleSavePaymentInner } from "../bar/paymentActionBar"

interface PaymentPageProps {
    id?: string,
    projectId?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canUpdate?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    prevPath?: NavBarPath[],
    onSetPage?: (any) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function PaymentPage(props: PaymentPageProps) {
    const [payment, setPayment] = useState<Payment>(defaultPayment)
    const [payments, setPayments] = useState<Payment[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo || props.projectId === undefined)
    const [isForShow, setIsForShow] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setPayment(defaultPayment)
        setIndex(-1)
        setIsForShow(false)
        setIsRegister(false)
    }

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleDeleteClick = async (payment, index) => {
        handleSetIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/payment", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: payment.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const list = [
            ...payments.slice(0, (index - 1)),
            ...payments.slice(index, payments.length),
        ]
        setPayments(list)
        handleSetIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleStatusClick = async (element, value) => {
        const payment = {
            ...element,
            status: value,
            dateString: handleUTCToDateShow(element.dateDue)
        }
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
        handleSetIsLoading(true)
        const res = await handleSavePaymentInner(payment, true)
        handleSetIsLoading(false)
        if (res.status === "ERROR") {
            handleShowMessage(feedbackMessage)
            return
        }
        feedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleAfterSave(feedbackMessage, payment, true)
    }

    const handleNewClick = async () => {
        setPayment({
            ...defaultPayment,
            status: "EM ABERTO",
            dateString: "",
        })
        setIsRegister(true)
        setIndex(-1)
    }

    const handleCloseModal = (value) => {
        setIsRegister(value)
        setIsForShow(value)
    }

    const handleShowClick = (project) => {
        handleSetIsLoading(true)
        setPayment({ ...defaultPayment, ...project })
        setIsForShow(true)
        handleSetIsLoading(false)
    }

    const handleEditClick = async (payment, index?) => {
        handleSetIsLoading(true)
        setIsForShow(false)
        let localPayment: Payment = await fetch("api/payment/" + payment?.id).then((res) => res.json()).then((res) => res.data)
        localPayment = {
            ...localPayment,
            index: payments.length,
            dateString: handleUTCToDateShow(localPayment?.dateDue?.toString()),
            value: handleMountNumberCurrency(localPayment?.value?.toString(), ".", ",", 3, 2),
        }
        handleSetIsLoading(false)
        setIsRegister(true)
        setPayment(localPayment)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, payment: Payment, isForCloseModal) => {
        let localIndex = -1
        payments.map((element, index) => {
            if (element.id === payment.id) {
                localIndex = index
            }
        })
        let list: Payment[] = [
            payment,
            ...payments,
        ]
        if (localIndex > -1) {
            list = [
                payment,
                ...payments.slice(0, localIndex),
                ...payments.slice(localIndex + 1, payments.length),
            ]
        }
        setPayments((old) => list)
        handleShowMessage(feedbackMessage)
        if (!isForCloseModal) {
            handleBackClick()
            setIndex((old) => -1)
        } else {
            setIndex((old) => 1)
        }
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handlePutModalTitle = (short: boolean) => {
        return (
            <>
                <Button
                    ignoreClass
                    onClick={() => handleCloseModal(false)}
                    className="hover:text-blue-200"
                >
                </Button>
                {short ? "P" : "Pagamento"}
                {payment.id?.length > 0 ? "-" : ""}
                {payment.title}
            </>
        )
    }

    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="2">Titulo</FormRowColumn>
                <FormRowColumn unit="1">Projeto</FormRowColumn>
                <FormRowColumn unit="1">Valor</FormRowColumn>
                <FormRowColumn unit="1">Status</FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">Prazo</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: Payment) => {
        return (
            <FormRow>
                <FormRowColumn unit="2">{element.title}</FormRowColumn>
                <FormRowColumn unit="1"><ProjectNumberListItem id={element.project.id} /></FormRowColumn>
                <FormRowColumn unit="1">{handleMountNumberCurrency(element.value.toString(), ".", ",", 3, 2)}</FormRowColumn>
                <FormRowColumn unit="1">
                    <PaymentStatusButton
                        id={element.id}
                        payment={element}
                        value={element.status}
                        onAfter={handleAfterSave}
                        isDisabled={props.isDisabled || props.isStatusDisabled}
                        onClick={async (value) => {
                            handleStatusClick(element, value)
                        }}
                    />
                </FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">{handleUTCToDateShow(element.dateDue?.toString())}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.projectId?.length > 0) {
                fetch("api/payments/" + props.projectId).then((res) => res.json()).then((res) => {
                    setPayments(res.list ?? [])
                    setIsFirst(old => false)
                    handleSetIsLoading(false)
                })
            } else if (props.projectId === undefined) {
                fetch("api/payments").then((res) => res.json()).then((res) => {
                    setPayments(res.list ?? [])
                    setIsFirst(old => false)
                    handleSetIsLoading(false)
                })
            }
        }
    })

    return (
        <>
            <ActionBar className="flex flex-row justify-end">
                <Button
                    isLoading={props.isLoading}
                    onClick={handleNewClick}
                    isHidden={!props.canSave}
                    isDisabled={props.isDisabled}
                >
                    <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                </Button>
            </ActionBar>
            <ListTable
                list={payments}
                isActive={index}
                title="Pagamentos"
                isLoading={props.isLoading}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                onShowClick={handleShowClick}
                onEditClick={handleEditClick}
                isDisabled={props.isDisabled}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />

            <WindowModal
                max
                id="payment-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                title={(handlePutModalTitle(false))}
                headerBottom={(
                    <div className="p-4 pb-0">
                        {isRegister && (
                            <PaymentActionBarForm
                                payment={payment}
                                onSet={setPayment}
                                isLoading={props.isLoading}
                                projectId={props.projectId}
                                onSetIsLoading={handleSetIsLoading}
                                onAfterSave={handleAfterSave}
                                onShowMessage={handleShowMessage}
                            />
                        )}
                        {isForShow && (
                            <ActionBar
                                className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"
                            >
                                <Button
                                    isLoading={props.isLoading}
                                    onClick={() => {
                                        handleEditClick(payment)
                                    }}
                                >
                                    Editar
                                </Button>
                            </ActionBar>
                        )}
                    </div>
                )}
            >
                <>
                    {isRegister && (
                        <PaymentDataForm
                            payment={payment}
                            onSet={setPayment}
                            isLoading={props.isLoading}
                            isDisabled={payment.status === "PAGO"}
                        />
                    )}
                    {isForShow && (
                        <></>
                    )}
                </>
            </WindowModal>
        </>
    )
}
