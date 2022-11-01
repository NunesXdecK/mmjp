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
import { handleUTCToDateShow } from "../../util/dateUtils"
import SwitchTextButton from "../button/switchTextButton"
import BudgetServicesView from "./budgetServicesView"
import BudgetPaymentsView from "./budgetPaymentsView"

interface BudgetViewProps {
    id?: string,
    title?: string,
    elementId?: string,
    addressTitle?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
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
        budget?.date > 0 ||
        budget?.title?.length

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
                    hideBorder
                    title="Serviços"
                    budgetServices={listServices}
                    id={"budget-services-" + props.budget?.id}
                />
                <BudgetPaymentsView
                    hideBorder
                    title="Pagamentos"
                    budgetPayments={listPayments}
                    id={"budget-payments-" + props.budget?.id}
                />
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props.elementId.length !== 0 && budget.id?.length === 0) {
                fetch("api/budget/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setBudget(res.data)
                })
            }
        }
    })

    return (
        <>
            {budget.id?.length === 0 ? (
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
                                <InfoView title="Projeto">{budget.title}</InfoView>
                                <InfoView title="Data">{handleUTCToDateShow(budget.date.toString())}</InfoView>
                                {budget.status === "FINALIZADO" && (
                                    <InfoView title="Status"><span className="rounded-sm px-2 py-1 text-green-100 bg-green-600 text-[0.8rem] font-bold">{budget.status}</span></InfoView>
                                )}
                                {budget.status === "ARQUIVADO" && (
                                    <InfoView title="Status"><span className="rounded-sm px-2 py-1 text-orange-100 bg-orange-600 text-[0.8rem] font-bold">{budget.status}</span></InfoView>
                                )}
                                <ScrollDownTransition isOpen={false}>
                                    <InfoView title="Data criação">{handleUTCToDateShow(budget.dateInsertUTC.toString())}</InfoView>
                                    {budget.dateLastUpdateUTC > 0 && <InfoView title="Data atualização">{handleUTCToDateShow(budget.dateLastUpdateUTC.toString())}</InfoView>}
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
