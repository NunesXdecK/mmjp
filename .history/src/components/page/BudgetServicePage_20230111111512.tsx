import { useState } from "react"
import FormRow from "../form/formRow"
import Button from "../button/button"
import ActionBar from "../bar/actionBar"
import ListTable from "../list/listTable"
import WindowModal from "../modal/windowModal"
import FormRowColumn from "../form/formRowColumn"
import { PlusIcon } from "@heroicons/react/solid"
import NavBar, { NavBarPath } from "../bar/navBar"
import BudgetServiceForm from "../form/budgetServiceForm"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import BudgetServiceActionBarForm from "../bar/budgetServiceActionBar"
import { BudgetService, defaultBudgetService } from "../../interfaces/objectInterfaces"

interface BudgetServicePageProps {
    id?: string,
    budgetId?: number,
    canSave?: boolean,
    canDelete?: boolean,
    canUpdate?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    prevPath?: NavBarPath[],
    budgetServices?: BudgetService[],
    onSet?: (any) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function BudgetServicePage(props: BudgetServicePageProps) {
    const [budgetService, setBudgetService] = useState<BudgetService>(defaultBudgetService)
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
        setBudgetService(defaultBudgetService)
        setIndex(-1)
        setIsRegister(false)
    }

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleDeleteClick = async (budgetService, index) => {
        handleSetIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        let res = { status: "ERROR" }
        if (budgetService?.id > 0) {
            res = await fetch("api/budgetServiceService", {
                method: "DELETE",
                body: JSON.stringify({
                    token: "tokenbemseguro",
                    id: budgetService.id,
                }),
            }).then((res) => res.json())
        }
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const list = [
            ...props?.budgetServices.slice(0, (index - 1)),
            ...props?.budgetServices.slice(index, props?.budgetServices.length),
        ]
        handleOnSet(list)
        handleSetIsLoading(false)
        handleShowMessage(feedbackMessage)
    }

    const handleNewClick = async () => {
        setBudgetService({
            ...defaultBudgetService,
        })
        setIsRegister(true)
        setIndex(-1)
    }

    const handleCloseModal = (value) => {
        setIsRegister(value)
    }

    const handleEditClick = async (budgetService, index?) => {
        console.log(index)
        setIndex((index - 1))
        handleSetIsLoading(true)
        handleSetIsLoading(false)
        setIsRegister(true)
        setBudgetService(budgetService)
    }

    const handleAfterSave = (feedbackMessage: FeedbackMessage, budgetService: BudgetService, isForCloseModal) => {
        console.log(index)
        let list: BudgetService[] = [
            budgetService,
            ...props?.budgetServices,
        ]
        if (index > -1) {
            list = [
                budgetService,
                ...props?.budgetServices.slice(0, index),
                ...props?.budgetServices.slice(index + 1, props?.budgetServices.length),
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
        if (budgetService?.id > 0) {
            path = { ...path, path: "Serviço-" + budgetService.title, onClick: null }
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
                <FormRowColumn unit="3">Nome</FormRowColumn>
                <FormRowColumn unit="3">Valor</FormRowColumn>
            </FormRow>
        )
    }

    const handlePutRows = (element: BudgetService) => {
        return (
            <FormRow>
                <FormRowColumn unit="3">{element.title}</FormRowColumn>
                <FormRowColumn unit="3">{element.value}</FormRowColumn>
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
                title="Serviços"
                isActive={index}
                onSetIsActive={setIndex}
                onTableRow={handlePutRows}
                canDelete={props.canDelete}
                isLoading={props.isLoading}
                list={props.budgetServices}
                onEditClick={handleEditClick}
                isDisabled={props.isDisabled}
                onTableHeader={handlePutHeaders}
                onDeleteClick={handleDeleteClick}
            />
            <WindowModal
                max
                id="budgetService-register-modal"
                setIsOpen={handleCloseModal}
                isOpen={isRegister}
                title={(handlePutModalTitle(false))}
                headerBottom={(
                    <div className="p-4 pb-0">
                        {isRegister && (
                            <BudgetServiceActionBarForm
                                onSet={setBudgetService}
                                budgetId={props.budgetId}
                                isLoading={props.isLoading}
                                budgetService={budgetService}
                                onAfterSave={handleAfterSave}
                                onShowMessage={handleShowMessage}
                                onSetIsLoading={handleSetIsLoading}
                            />
                        )}
                    </div>
                )}
            >
                {isRegister && (
                    <BudgetServiceForm
                        onSet={setBudgetService}
                        isLoading={props.isLoading}
                        budgetService={budgetService}
                        isDisabled={props.isDisabled}
                        onShowMessage={handleShowMessage}
                    />
                )}
            </WindowModal>
        </>
    )
}
