import FormRow from "../form/formRow"
import FormRowColumn from "../form/formRowColumn"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import { BudgetPayment } from "../../interfaces/objectInterfaces"
import { handleUTCToDateShow } from "../../util/dateUtils"
import InfoHolderView from "./infoHolderView"
import InfoView from "./infoView"

interface BudgetPaymentViewProps {
    id?: string,
    index?: number,
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
                <>
                    <FormRow className="-m-2 mb-2 p-2 text-gray-900 dark:text-gray-200 hidden sm:grid">
                        <FormRowColumn unit="3">{props.budgetPayment.description}</FormRowColumn>
                        <FormRowColumn unit="1" className="text-center">{handleUTCToDateShow(props.budgetPayment.dateDue?.toString())}</FormRowColumn>
                        <FormRowColumn unit="2" className="text-center">{handleMountNumberCurrency(props.budgetPayment.value.toString(), ".", ",", 3, 2)}</FormRowColumn>
                    </FormRow>

                    <InfoHolderView
                        title={(props.index > -1 ? props.index + " - " : "") + props.budgetPayment.description}
                        classNameHolder="block sm:hidden"
                    >
                        <div className="flex flex-row flex-wrap">
                            <InfoView title="Vencimento">{handleUTCToDateShow(props.budgetPayment.dateDue?.toString())}</InfoView>
                            <InfoView title="Valor">{handleMountNumberCurrency(props.budgetPayment.value.toString(), ".", ",", 3, 2)}</InfoView>
                        </div>
                    </InfoHolderView>
                </>
            )}
        </>
    )
}
