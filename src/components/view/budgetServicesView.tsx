import FormRow from "../form/formRow"
import InfoHolderView from "./infoHolderView"
import FormRowColumn from "../form/formRowColumn"
import BudgetServiceView from "./budgetServiceView"
import { BudgetService } from "../../interfaces/objectInterfaces"

interface BudgetServiceViewProps {
    id?: string,
    title?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    hideBorder?: boolean,
    hidePaddingMargin?: boolean,
    budgetServices?: BudgetService[],
}

export default function BudgetServicesView(props: BudgetServiceViewProps) {
    const hasData = props.budgetServices?.length > 0

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
                    <FormRow className="-m-2 mb-2 p-2 bg-gray-200 hidden sm:grid">
                        <FormRowColumn unit="2">Nome</FormRowColumn>
                        <FormRowColumn unit="1" className="text-center">Valor</FormRowColumn>
                        <FormRowColumn unit="1" className="text-center">Quantidade</FormRowColumn>
                        <FormRowColumn unit="2" className="text-center">Total</FormRowColumn>
                    </FormRow>
                    {props.budgetServices.map((element, index) => (
                        <BudgetServiceView
                            budgetService={element}
                            key={"budget-services-" + props.id + "-" + index}
                        />
                    ))}
                </InfoHolderView>
            )}
        </>
    )
}
