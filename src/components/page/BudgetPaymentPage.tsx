import { useState } from "react"
import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { PlusIcon } from "@heroicons/react/solid"
import NavBar, { NavBarPath } from "../bar/navBar"
import BudgetPaymentForm from "../form/budgetPaymentForm"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import BudgetPaymentActionBarForm from "../bar/budgetPaymentActionBar"
import { BudgetPayment, defaultBudgetPayment } from "../../interfaces/objectInterfaces"
import { handleDateToShow, handleOnlyDate } from "../../util/dateUtils"
import { handleMaskCurrency } from "../inputText/inputText"

interface BudgetPaymentPageProps {
    id?: string,
    budgetId?: number,
    canSave?: boolean,
    canDelete?: boolean,
    canUpdate?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    prevPath?: NavBarPath[],
    budgetPayments?: BudgetPayment[],
    onSet?: (any) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function BudgetPaymentPage(props: BudgetPaymentPageProps) {
    const [budgetPayment, setBudgetPayment] = useState<BudgetPayment>(defaultBudgetPayment)
    const [index, setIndex] = useState(-1)
    const [isRegister, setIsRegister] = useState(false)

    const handleOnSet = (value) => {
        if (props.onSet) {
            props.onSet(value)
        }
    }

    const handleBackClick = (event?) => {
        if (event) {
            event.preventDefault()
        }
        setBudgetPayment(defaultBudgetPayment)
        setIndex(-1)
        setIsRegister(false)
    }

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleDeleteClick = async (budgetPayment, index) => {
        handleSetIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        let res = { status: "SUCCESS" }
        if (budgetPayment?.id > 0) {
            res = await fetch("api/budgetPayment", {
                method: "DELETE",
                body: JSON.stringify({
                    token: "tokenbemseguro",
                    id: budgetPayment.id,
                }),
            }).then((res) => res.json())
        }
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
            const list = [
                ...props?.budgetPayments.slice(0, (index - 1)),
                ...props?.budgetPayments.slice(index, props?.budgetPayments.length),
            ]
            handleOnSet(list)
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        handleSetIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setBudgetPayment({
            ...defaultBudgetPayment,
        })
        setIsRegister(true)
        setIndex(-1)
    }

    const handleCloseModal = (value) => {
        setIsRegister(value)
    }

    const handleEditClick = async (budgetPayment, index?) => {
        setIndex(index)
        handleSetIsLoading(true)
        handleSetIsLoading(false)
        setIsRegister(true)
        const local = {
            ...budgetPayment,
            dateDue: handleOnlyDate(budgetPayment.dateDue)
        }
        setBudgetPayment(local)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, budgetPayment: BudgetPayment, isForCloseModal) => {
        const i = index - 1
        let list: BudgetPayment[] = [
            budgetPayment,
            ...props?.budgetPayments,
        ]
        if (i > -1) {
            list = [
                budgetPayment,
                ...props?.budgetPayments.slice(0, i),
                ...props?.budgetPayments.slice(i + 1, props?.budgetPayments.length),
            ]
        }
        handleOnSet(list)
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
        let paths = []
        let path: NavBarPath = { path: "Novo serviço", onClick: null }
        if (short) {
            //path = { ...path, path: "S" }
        }
        if (budgetPayment?.id > 0) {
            path = { ...path, path: "Serviço-" + budgetPayment.title, onClick: null }
        }
        try {
            if (props.prevPath?.length > 0) {
                let prevPath: NavBarPath = {
                    ...props.prevPath[props.prevPath?.length - 1],
                    onClick: handleBackClick,
                    path: props.prevPath[props.prevPath?.length - 1]?.path + "/",
                }
                paths = [...props.prevPath.slice(0, props.prevPath?.length - 1), prevPath,]
            }
            paths = [...paths, path]
        } catch (err) {
            console.error(err)
        }
        if (short) {
            return paths
        } else {
            return (
                <>
                    {paths?.length > 0 ? (<NavBar pathList={paths} />) : path.path}
                </>
            )
        }
    }

    const handlePutHeaders = () => {
        return (
            <FormRow>
                <FormRowColumn unit="2">Nome</FormRowColumn>
                <FormRowColumn unit="2" className="text-center">Valor</FormRowColumn>
                <FormRowColumn unit="2" className="text-center">Vencimento</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: BudgetPayment) => {
        return (
            <FormRow>
                <FormRowColumn unit="2">{element.title}</FormRowColumn>
                <FormRowColumn unit="2" className="text-center">{handleMaskCurrency(element.value)}</FormRowColumn>
                <FormRowColumn unit="2" className="text-center">{handleDateToShow(element.dateDue)}</FormRowColumn>
            </FormRow>
        )
    }

    return (
        <>
            <ActionBar
                isHidden={!props.canSave}
                className="flex flex-row justify-end"
            >
                <Button
                    onClick={handleNewClick}
                    isHidden={!props.canSave}
                    isLoading={props.isLoading}
                    isDisabled={props.isDisabled}
                >
                    <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                </Button>
            </ActionBar>
            <ListTable
                title="Pagamentos"
                isActive={index}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                canDelete={props.canDelete}
                isLoading={props.isLoading}
                list={props.budgetPayments}
                onEditClick={handleEditClick}
                isDisabled={props.isDisabled}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />
            <WindowModal
                max
                id="budgetPayment-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister}
                title={(handlePutModalTitle(false))}
                headerBottom={(
                    <div className="p-4 pb-0">
                        {isRegister && (
                            <BudgetPaymentActionBarForm
                                onSet={setBudgetPayment}
                                budgetId={props.budgetId}
                                isLoading={props.isLoading}
                                budgetPayment={budgetPayment}
                                onAfterSave={handleAfterSave}
                                onShowMessage={handleShowMessage}
                                onSetIsLoading={handleSetIsLoading}
                            />
                        )}
                    </div>
                )}
            >
                {isRegister && (
                    <BudgetPaymentForm
                        onSet={setBudgetPayment}
                        isLoading={props.isLoading}
                        budgetPayment={budgetPayment}
                        isDisabled={props.isDisabled}
                        onShowMessage={handleShowMessage}
                    />
                )}
            </WindowModal>
        </>
    )
}
