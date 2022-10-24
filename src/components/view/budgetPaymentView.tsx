import FormRow from "../form/formRow"
import FormRowColumn from "../form/formRowColumn"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import { BudgetPayment } from "../../interfaces/objectInterfaces"
import { handleUTCToDateShow } from "../../util/dateUtils"

interface BudgetPaymentViewProps {
    id?: string,
    budgetPayment?: BudgetPayment,
}

export default function BudgetPaymentView(props: BudgetPaymentViewProps) {

    const hasData =
        props.budgetPayment?.description?.length ||
        props.budgetPayment?.value?.length ||
        props.budgetPayment?.dateDue > 0

    return (
        <>
            {hasData && (
                <FormRow className="-m-2 mb-2 p-2 flex flex-row">
                    <FormRowColumn unit="3">{props.budgetPayment.description}</FormRowColumn>
                    <FormRowColumn unit="1" className="text-center">{handleUTCToDateShow(props.budgetPayment.dateDue.toString())}</FormRowColumn>
                    <FormRowColumn unit="2" className="text-center">{handleMountNumberCurrency(props.budgetPayment.value.toString(), ".", ",", 3, 2)}</FormRowColumn>
                </FormRow>
            )}
        </>
    )
}
