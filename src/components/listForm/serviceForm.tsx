import Button from "../button/button";
import ServiceDataForm from "./serviceDataForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { defaultService, Service } from "../../interfaces/objectInterfaces";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import Form from "../form/form";
import FormRow from "../form/formRow";
import FormRowColumn from "../form/formRowColumn";

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
    const handleSetText = (object, index) => {
        if (props.onSetServices) {
            props.onSetServices([
                ...props.services.slice(0, index),
                object,
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
                />
            ))}
        </Form>
    )
}