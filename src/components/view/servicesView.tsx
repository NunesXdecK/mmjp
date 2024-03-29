import { useState } from "react"
import InfoHolderView from "./infoHolderView"
import { Service } from "../../interfaces/objectInterfaces"
import PlaceholderItemList from "../list/placeholderItemList"
import { handleMountNumberCurrency, handleValueStringToFloat } from "../../util/maskUtil"
import FormRow from "../form/formRow"
import FormRowColumn from "../form/formRowColumn"

interface ServicesViewProps {
    id?: string,
    title?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    elementId?: number,
    dataInside?: boolean,
    hideBorder?: boolean,
    services?: Service[],
}

export default function ServicesView(props: ServicesViewProps) {
    const [services, setServices] = useState<Service[]>(props.services ?? [])

    const classNameHolder = "flex flex-row justify-between w-full break-all"
    const classNameContent = "px-1 text-center w-full self-center"
    const classNameContentTitle = "px-1 text-left w-full"
    const classNameCenter = "text-center"

    const handleCalculateTotal = (value: string, quantity: string) => {
        let valueFinal = 0
        let quantityFinal = 0
        try {
            if (value.length) {
                valueFinal = handleValueStringToFloat(value)
            }
            if (quantity.length) {
                quantityFinal = parseInt(quantity)
            }
        } catch (err) {
            console.error(err)
        }
        const v = (valueFinal * quantityFinal).toFixed(2)
        return v
    }

    return (
        <InfoHolderView
            hideBorder={props.hideBorder}
            classNameTitle={props.classNameTitle}
            title={props.title ?? "Serviços"}
            classNameHolder={props.classNameHolder}
            classNameContentHolder={props.classNameContentHolder}
        >
            {services?.length === 0 ? (
                <>
                    <PlaceholderItemList />
                    <PlaceholderItemList />
                    <PlaceholderItemList />
                    <PlaceholderItemList />
                </>
            ) : (
                <>
                    <div>
                        <FormRow>
                            <FormRowColumn unit="3" >
                                <strong>Titulo</strong>
                            </FormRowColumn>
                            <FormRowColumn unit="1" className={classNameCenter}>
                                <strong>Valor</strong>
                            </FormRowColumn>
                            <FormRowColumn unit="1" className={classNameCenter}>
                                <strong>Quantidade</strong>
                            </FormRowColumn>
                            <FormRowColumn unit="1" className={classNameCenter}>
                                <strong>Total</strong>
                            </FormRowColumn>
                        </FormRow>
                        {services.map((element, index) => (
                            <FormRow key={index}>
                                <FormRowColumn unit="3">
                                    {element.title && (<p>{element.title}</p>)}
                                </FormRowColumn>
                                <FormRowColumn unit="1" className={classNameCenter}>
                                    {element.value && (<p>{element.value}</p>)}
                                </FormRowColumn>
                                <FormRowColumn unit="1" className={classNameCenter}>
                                    {element.quantity && (<p>{element.quantity}</p>)}
                                </FormRowColumn>
                                <FormRowColumn unit="1" className={classNameCenter}>
                                    {handleMountNumberCurrency(handleCalculateTotal(element.value, element.quantity), ".", ",", 3, 2)}
                                </FormRowColumn>
                            </FormRow>
                        ))}
                    </div>
                    {/*
                    <div className={classNameHolder}>
                        <div className={classNameContentTitle}>
                            <strong>Titulo</strong>
                        </div>
                        <div className={classNameContent}>
                            <strong>Valor</strong>
                        </div>
                        <div className={classNameContent}>
                            <strong>Quantidade</strong>
                        </div>
                        <div className={classNameContent}>
                            <strong>Total</strong>
                        </div>
                    </div>
                    {services.map((element, index) => (
                        <div key={index} className={classNameHolder}>
                            <div className={classNameContentTitle}>
                                {element.title && (<p>{element.title}</p>)}
                            </div >
                            <div className={classNameContent}>
                                {element.value && (<p>{element.value}</p>)}
                            </div>
                            <div className={classNameContent}>
                                {element.quantity && (<p>{element.quantity}</p>)}
                            </div>
                            <div className={classNameContent}>
                                {handleMountNumberCurrency(handleCalculateTotal(element.value, element.quantity), ".", ",", 3, 2)}
                            </div>
                        </div>
                    ))}
                            */}
                </>
            )}
        </InfoHolderView>
    )
}
