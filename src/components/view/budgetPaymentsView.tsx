import FormRow from "../form/formRow"
import InfoHolderView from "./infoHolderView"
import FormRowColumn from "../form/formRowColumn"
import BudgetPaymentView from "./budgetPaymentView"
import { BudgetPayment } from "../../interfaces/objectInterfaces"

interface BudgetPaymentsViewProps {
    id?: string,
    title?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideBorder?: boolean,
    hidePaddingMargin?: boolean,
    budgetPayments?: BudgetPayment[],
}

export default function BudgetPaymentsView(props: BudgetPaymentsViewProps) {
    const hasData = props.budgetPayments?.length > 0

    return (
        <>
            {hasData && (
                <InfoHolderView
                    hideBorder={props.hideBorder}
                    classNameTitle={props.classNameTitle}
                    title={props.title ?? "Dados básicos"}
                    classNameHolder={props.classNameHolder}
                    hidePaddingMargin={props.hidePaddingMargin}
                    classNameContentHolder={props.classNameContentHolder}
                >
                    <FormRow className="-m-2 mb-2 p-2 border-b border-gray-200 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hidden sm:grid">
                        <FormRowColumn unit="3">Nome</FormRowColumn>
                        <FormRowColumn unit="1" className="text-center">Vencimento</FormRowColumn>
                        <FormRowColumn unit="2" className="text-center">Valor</FormRowColumn>
                    </FormRow>
                    {props.budgetPayments.map((element, index) => (
                        <BudgetPaymentView
                            index={index + 1}
                            budgetPayment={element}
                            key={"budget-services-" + props.id + "-" + index}
                        />
                    ))}
                </InfoHolderView>
            )}
        </>
    )
}
