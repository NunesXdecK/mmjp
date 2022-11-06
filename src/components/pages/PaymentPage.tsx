import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import { useEffect, useState } from "react"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import ProjectNumberListItem from "../list/projectNumberListItem"
import { Payment, defaultPayment } from "../../interfaces/objectInterfaces"
import { handleUTCToDateShow, handleNewDateToUTC } from "../../util/dateUtils"
import PaymentActionBarForm from "../bar/paymentActionBar"
import PaymentForm from "../form/paymentForm"
import { handleMountNumberCurrency } from "../../util/maskUtil"

interface PaymentPageProps {
    id?: string,
    projectId?: string,
    canSave?: boolean,
    getInfo?: boolean,
    canUpdate?: boolean,
    onSetPage?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function PaymentPage(props: PaymentPageProps) {
    const [payment, setPayment] = useState<Payment>(defaultPayment)
    const [payments, setPayments] = useState<Payment[]>([])
    const [index, setIndex] = useState(-1)
    const [isFirst, setIsFirst] = useState(props.getInfo)
    const [isLoading, setIsLoading] = useState(props.getInfo)
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

    const handleDeleteClick = async (payment, index) => {
        setIsLoading(true)
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
        setIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setPayment({ ...defaultPayment, dateString: handleUTCToDateShow(handleNewDateToUTC().toString()) })
        setIsRegister(true)
        setIndex(-1)
    }

    const handleCloseModal = (value) => {
        setIsRegister(value)
        setIsForShow(value)
    }

    const handleShowClick = (project) => {
        setIsLoading(true)
        setPayment({ ...defaultPayment, ...project })
        setIsForShow(true)
        setIsLoading(false)
    }

    const handleEditClick = async (payment, index?) => {
        setIsLoading(true)
        setIsForShow(false)
        let localPayment: Payment = await fetch("api/payment/" + payment.id).then((res) => res.json()).then((res) => res.data)
        localPayment = {
            ...localPayment,
            dateString: handleUTCToDateShow(localPayment.dateDue.toString()),
            value: handleMountNumberCurrency(localPayment.value.toString(), ".", ",", 3, 2),
        }
        setIsLoading(false)
        setIsRegister(true)
        setPayment(localPayment)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, payment: Payment) => {
        handleBackClick()
        let list: Payment[] = [
            payment,
            ...payments,
        ]
        if (index > -1) {
            list = [
                payment,
                ...payments.slice(0, (index - 1)),
                ...payments.slice(index, payments.length),
            ]
        }
        setIndex((old) => -1)
        setPayments((old) => list)
        handleShowMessage(feedbackMessage)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="2">Projeto</FormRowColumn>
                <FormRowColumn unit="1">Descrição</FormRowColumn>
                <FormRowColumn unit="1">Valor</FormRowColumn>
                <FormRowColumn unit="1">Status</FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">Prazo</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: Payment) => {
        return (
            <FormRow>
                <FormRowColumn unit="2"><ProjectNumberListItem id={element.project.id} /></FormRowColumn>
                <FormRowColumn unit="1">{element.description}</FormRowColumn>
                <FormRowColumn unit="1">{handleMountNumberCurrency(element.value.toString(), ".", ",", 3, 2)}</FormRowColumn>
                <FormRowColumn unit="1">
                    {element.status === "NORMAL" && (
                        <span className="rounded text-slate-600 bg-slate-300 py-1 px-2 text-xs font-bold">
                            {element.status}
                        </span>
                    )}
                    {element.status === "ARQUIVADO" && (
                        <span className="rounded text-red-600 bg-red-300 py-1 px-2 text-xs font-bold">
                            {element.status}
                        </span>
                    )}
                    {element.status === "FINALIZADO" && (
                        <span className="rounded text-green-600 bg-green-300 py-1 px-2 text-xs font-bold">
                            {element.status}
                        </span>
                    )}
                </FormRowColumn>
                <FormRowColumn className="hidden sm:block" unit="1">{handleUTCToDateShow(element.dateDue.toString())}</FormRowColumn>
            </FormRow>
        )
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/payments").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setPayments(res.list)
                }
                setIsLoading(false)
            })
        }
    })

    return (
        <>
            <div className="p-4 pb-0">
                <ActionBar className="flex flex-row justify-end">
                    <Button
                        isLoading={isLoading}
                        isHidden={!props.canUpdate}
                        onClick={() => {
                            setIndex(-1)
                            setIsFirst(true)
                            setIsLoading(true)
                            handleBackClick()
                        }}
                    >
                        <RefreshIcon className="block h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                        isLoading={isLoading}
                        onClick={handleNewClick}
                        isHidden={!props.canSave}
                    >
                        <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                    </Button>
                </ActionBar>
            </div>

            <ListTable
                list={payments}
                isActive={index}
                title="Pagamentos"
                isLoading={isLoading}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                onShowClick={handleShowClick}
                onEditClick={handleEditClick}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />

            <WindowModal
                max
                title="Pagamento"
                id="payment-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister || isForShow}
                headerBottom={(
                    <div className="p-4 pb-0">
                        <PaymentActionBarForm
                            payment={payment}
                            onSet={setPayment}
                            isLoading={isLoading}
                            onSetIsLoading={setIsLoading}
                            onAfterSave={handleAfterSave}
                            onShowMessage={handleShowMessage}
                        />
                    </div>
                )}
            >
                <PaymentForm
                    payment={payment}
                    onSet={setPayment}
                    isLoading={isLoading}
                />
            </WindowModal>
        </>
    )
}
