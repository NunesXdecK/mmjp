import Button from "../button/button";
import ServiceDataForm from "./serviceDataForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { defaultService, defaultServicePayment, Service, ServicePayment, ServiceStage } from "../../interfaces/objectInterfaces";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import Form from "../form/form";
import FormRow from "../form/formRow";
import FormRowColumn from "../form/formRowColumn";
import { handleMountNumberCurrency } from "../../util/maskUtil";
import { useState } from "react";

interface ServiceFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    isLoading?: boolean,
    services?: Service[],
    onSetServices?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceForm(props: ServiceFormProps) {
    const [localService, setLocalService] = useState<Service>({})
    const handlePutPayment = (valueTotal, index) => {
        if (valueTotal > -1) {
            let list = [
                {
                    ...defaultServicePayment,
                    index: 0,
                    description: "Entrada",
                    dateString: handleUTCToDateShow(handleNewDateToUTC().toString()),
                    value: handleMountNumberCurrency((valueTotal / 2).toString(), ".", ",", 3, 2,),
                },
                {
                    ...defaultServicePayment,
                    index: 1,
                    description: "Entrega",
                    dateString: handleUTCToDateShow(handleNewDateToUTC().toString()),
                    value: handleMountNumberCurrency((valueTotal / 2).toString(), ".", ",", 3, 2),
                },
            ]
            const localService: Service = { ...props.services[index], servicePayments: list }
            setLocalService((old) => localService)
            handleSetText(localService, index, true)
        }
    }

    const handleSetText = (object, index, isUpdate?) => {
        let localObject = object
        if (isUpdate) {
            localObject = localService
        }
        console.log("oi", localObject)
        if (props.onSetServices) {
            props.onSetServices([
                ...props.services.slice(0, index),
                localObject,
                ...props.services.slice(index + 1, props.services.length),
            ])
        }
    }

    const handeOnDelete = async (index: number) => {
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        let localServices = [...props.services]
        let localService = localServices[index]
        let canDelete = true

        if (localService.id && localService.id !== "") {
            const res = await fetch("api/service", {
                method: "DELETE",
                body: JSON.stringify({ token: "tokenbemseguro", id: localService.id }),
            }).then((res) => res.json())

            if (res.status !== "SUCCESS") {
                canDelete = false
                feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
            }
        }

        if (canDelete) {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
            localServices.splice(index, 1)
            if (props.onSetServices) {
                props.onSetServices(localServices)
            }
        }

        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    return (
        <Form
            title={props.title}
            subtitle={props.subtitle}
        >
            <FormRow className="mb-2">
                <FormRowColumn unit="6" className="flex justify-end">
                    <Button
                        isLoading={props.isLoading}
                        isDisabled={props.isLoading}
                        onClick={() => {
                            if (props.onSetServices) {
                                props.onSetServices([
                                    ...props.services,
                                    {
                                        ...defaultService,
                                        index: props.services?.length,
                                        dateString: handleUTCToDateShow(handleNewDateToUTC() + ""),
                                    }])
                            }
                        }}>
                        Adicionar serviço
                    </Button>
                </FormRowColumn>
            </FormRow>

            {props?.services?.map((element, index) => (
                <ServiceDataForm
                    key={index}
                    index={index}
                    onDelete={handeOnDelete}
                    onSetText={handleSetText}
                    services={props.services}
                    isLoading={props.isLoading}
                    onSetTotalChange={handlePutPayment}
                    onShowMessage={props.onShowMessage}
                />
            ))}
        </Form>
    )
}