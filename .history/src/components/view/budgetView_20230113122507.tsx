import InfoView from "./infoView"
import Button from "../button/button"
import PersonView from "./personView"
import CompanyView from "./companyView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { defaultBudget, Budget, Service } from "../../interfaces/objectInterfaces"
import { handleDateToShow, handleUTCToDateShow } from "../../util/dateUtils"
import SwitchTextButton from "../button/switchTextButton"
import BudgetServicesView from "./budgetServicesView"
import BudgetPaymentsView from "./budgetPaymentsView"

interface BudgetViewProps {
    id?: string,
    title?: string,
    addressTitle?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    elementId?: number,
    hideData?: boolean,
    dataInside?: boolean,
    hideBorder?: boolean,
    showMoreInfo?: boolean,
    canShowHideData?: boolean,
    hidePaddingMargin?: boolean,
    budget?: Budget,
}

export default function BudgetView(props: BudgetViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [budget, setBudget] = useState<Budget>(props.budget ?? defaultBudget)

    const hasHideData =
        budget.clients?.length > 0
    const hasData =
        hasHideData ||
        budget?.dateDue?.length > 0 ||
        budget?.title?.length > 0

    const handlePutOwner = (owner) => {
        return (
            <>
                {owner && "cpf" in owner && (
                    <PersonView
                        hideData
                        dataInside
                        addressTitle={"Endereço"}
                        elementId={owner.id ?? ""}
                        hideBorder={props.showMoreInfo}
                        canShowHideData={!props.showMoreInfo}
                        hidePaddingMargin={props.showMoreInfo}
                        title={props.showMoreInfo ? "" : "Cliente"}
                    />
                )}
                {owner && "cnpj" in owner && (
                    <CompanyView
                        hideData
                        dataInside
                        addressTitle={"Endereço"}
                        elementId={owner.id ?? ""}
                        hideBorder={props.showMoreInfo}
                        canShowHideData={!props.showMoreInfo}
                        hidePaddingMargin={props.showMoreInfo}
                        title={props.showMoreInfo ? "" : "Cliente"}
                    />
                )}
            </>
        )
    }
    const handlePutData = () => {
        let listClients = budget?.clients?.sort((elementOne, elementTwo) => {
            let dateOne = 0
            let dateTwo = 0
            if ("dateInsertUTC" in elementOne) {
                dateOne = elementOne.dateInsertUTC
            }
            if ("dateInsertUTC" in elementTwo) {
                dateTwo = elementTwo.dateInsertUTC
            }
            return dateOne - dateTwo
        }) ?? []
        let listServices = budget?.services?.sort((elementOne, elementTwo) => {
            let indexOne = 0
            let indexTwo = 0
            if ("index" in elementOne) {
                indexOne = elementOne.index
            }
            if ("index" in elementTwo) {
                indexTwo = elementTwo.index
            }
            return indexOne - indexTwo
        }) ?? []
        let listPayments = budget?.payments?.sort((elementOne, elementTwo) => {
            let indexOne = 0
            let indexTwo = 0
            if ("index" in elementOne) {
                indexOne = elementOne.index
            }
            if ("index" in elementTwo) {
                indexTwo = elementTwo.index
            }
            return indexOne - indexTwo
        }) ?? []
        return (
            <div className="w-full">
                {listClients?.map((owner, index) => (
                    <div key={index + owner.id}>
                        {handlePutOwner(owner)}
                    </div>
                ))}
                <BudgetServicesView
                    title="Serviços"
                    budgetServices={listServices}
                    id={"budget-services-" + props.budget?.id}
                />
                <BudgetPaymentsView
                    title="Pagamentos"
                    budgetPayments={listPayments}
                    id={"budget-payments-" + props.budget?.id}
                />
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props.elementId > 0 && budget?.id === 0) {
                fetch("api/budget/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setBudget(res.data)
                })
            }
        }
    })

    return (
        <>
            {budget.id === 0 ? (
                <div className="mt-6 w-full">
                    <PlaceholderItemList />
                </div>
            ) : (
                <>
                    {hasData && (
                        <>
                            <InfoHolderView
                                hideBorder={props.hideBorder}
                                classNameTitle={props.classNameTitle}
                                classNameHolder={props.classNameHolder}
                                hidePaddingMargin={props.hidePaddingMargin}
                                title={props.title ?? "Dados básicos"}
                                classNameContentHolder={props.classNameContentHolder}
                            >
                                <InfoView title="Orçamento">{budget.title}</InfoView>
                                <InfoView title="Data">{handleDateToShow(budget.dateDue)}</InfoView>
                                <ScrollDownTransition isOpen={false}>
                                    {/*
                                    <InfoView title="Data criação">{handleUTCToDateShow(budget.dateInsertUTC.toString())}</InfoView>
                                    {budget.dateLastUpdateUTC > 0 && <InfoView title="Data atualização">{handleUTCToDateShow(budget.dateLastUpdateUTC.toString())}</InfoView>}
                                    */}
                                    {props.dataInside && handlePutData()}
                                </ScrollDownTransition>
                                {props.canShowHideData && props.hideData && hasHideData && (
                                    <SwitchTextButton
                                        isSwitched={isShowInfo}
                                        onClick={() => {
                                            setIsShowInfo(!isShowInfo)
                                        }}
                                    >
                                    </SwitchTextButton>
                                )}
                            </InfoHolderView>
                            <ScrollDownTransition isOpen={isShowInfo}>
                                {!props.dataInside && handlePutData()}
                            </ScrollDownTransition>
                        </>
                    )}
                </>
            )}
        </>
    )
}
