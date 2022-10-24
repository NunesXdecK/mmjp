import FormRow from "../form/formRow"
import FormRowColumn from "../form/formRowColumn"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import { BudgetService } from "../../interfaces/objectInterfaces"

interface BudgetServiceViewProps {
    id?: string,
    budgetService?: BudgetService,
}

export default function BudgetServiceView(props: BudgetServiceViewProps) {

    const hasData =
        props.budgetService?.title?.length ||
        props.budgetService?.value?.length ||
        props.budgetService?.total?.length ||
        props.budgetService?.quantity?.length

    return (
        <>
            {hasData && (
                <FormRow className="-m-2 mb-2 p-2 flex flex-row">
                    <FormRowColumn unit="2">{props.budgetService.title}</FormRowColumn>
                    <FormRowColumn unit="1" className="text-center">{handleMountNumberCurrency(props.budgetService.value.toString(), ".", ",", 3, 2)}</FormRowColumn>
                    <FormRowColumn unit="1" className="text-center">{props.budgetService.quantity}</FormRowColumn>
                    <FormRowColumn unit="2" className="text-center">{handleMountNumberCurrency(props.budgetService.total.toString(), ".", ",", 3, 2)}</FormRowColumn>
                </FormRow>
            )}
        </>
    )
}
