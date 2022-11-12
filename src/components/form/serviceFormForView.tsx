import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { handleUTCToDateShow } from "../../util/dateUtils";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { defaultService, Service } from "../../interfaces/objectInterfaces";

interface ServiceFormForViewProps {
    title?: string,
    subtitle?: string,
    service?: Service,
}

export default function ServiceFormForView(props: ServiceFormForViewProps) {
    const [service, setService] = useState<Service>(props?.service ?? defaultService)

    return (
        <Form
            title={props.title}
            subtitle={props.subtitle}>
            <FormRow>
                <FormRowColumn unit="3">
                    <InputTextAutoComplete
                        id="service-title"
                        isDisabled
                        value={service.title}
                        title="Titulo do projeto"
                    />
                </FormRowColumn>

                <FormRowColumn unit="2">
                    <InputText
                        id="service-total"
                        isDisabled
                        title="Valor total"
                        value={service.total}
                    />
                </FormRowColumn>

                <FormRowColumn unit="1">
                    <InputText
                        mask="date"
                        isDisabled
                        title="Data"
                        maxLength={10}
                        id="service-date"
                        value={handleUTCToDateShow(service.dateDue?.toString())}
                    />
                </FormRowColumn>
            </FormRow>
        </Form>
    )
}