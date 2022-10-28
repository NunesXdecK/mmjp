import FormRow from "../form/formRow"
import FormRowColumn from "../form/formRowColumn"
import { handleMountNumberCurrency } from "../../util/maskUtil"
import { BudgetService } from "../../interfaces/objectInterfaces"
import InfoHolderView from "./infoHolderView"
import InfoView from "./infoView"

interface BudgetServiceViewProps {
    id?: string,
    index?: number,
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
                <>
                    <FormRow className="-m-2 mb-2 p-2 hidden sm:grid">
                        <FormRowColumn unit="2">{props.budgetService.title}</FormRowColumn>
                        <FormRowColumn unit="1" className="text-center">{handleMountNumberCurrency(props.budgetService.value.toString(), ".", ",", 3, 2)}</FormRowColumn>
                        <FormRowColumn unit="1" className="text-center">{props.budgetService.quantity}</FormRowColumn>
                        <FormRowColumn unit="2" className="text-center">{handleMountNumberCurrency(props.budgetService.total.toString(), ".", ",", 3, 2)}</FormRowColumn>
                    </FormRow>


                    <InfoHolderView
                        title={(props.index > -1 ? props.index + " - " : "") + props.budgetService.title}
                        classNameHolder="block sm:hidden"
                    >
                        <div className="flex flex-row  flex-wrap">
                            <InfoView title="Valor">{handleMountNumberCurrency(props.budgetService.value.toString(), ".", ",", 3, 2)}</InfoView>
                            <InfoView title="Quantidade">{props.budgetService.quantity}</InfoView>
                            <InfoView title="Total">{handleMountNumberCurrency(props.budgetService.total.toString(), ".", ",", 3, 2)}</InfoView>
                        </div>
                    </InfoHolderView>
                </>
            )}
        </>
    )
}
