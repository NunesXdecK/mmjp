import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import ProjectPaymentDataForm from "./projectPaymentDataForm";
import { defaultProjectPayment, ProjectPayment } from "../../interfaces/objectInterfaces";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";

interface ProjectPaymentFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    isLoading?: boolean,
    projectPayments?: ProjectPayment[],
    onSetProjectPayments?: (any) => void,
}

export default function ProjectPaymentForm(props: ProjectPaymentFormProps) {
    const handleSetText = (object, index) => {
        if (props.onSetProjectPayments) {
            props.onSetProjectPayments([
                ...props.projectPayments.slice(0, index),
                object,
                ...props.projectPayments.slice(index + 1, props.projectPayments.length),
            ])
        }
    }

    const handeOnDelete = (index: number) => {
        let localProjectPayments = [...props.projectPayments]
        localProjectPayments.splice(index, 1)
        if (props.onSetProjectPayments) {
            props.onSetProjectPayments(localProjectPayments)
        }
    }

    return (
        <Form
            title={props.title}
            subtitle={props.subtitle}
        >
            <FormRow>
                <FormRowColumn unit="6" className="flex justify-end">
                    <Button
                        onClick={() => {
                            if (props.onSetProjectPayments) {
                                props.onSetProjectPayments([...props.projectPayments, { ...defaultProjectPayment, dateString: handleUTCToDateShow(handleNewDateToUTC() + ""), index: props.projectPayments?.length }])
                            }
                        }}>
                        Adicionar pagamento
                    </Button>
                </FormRowColumn>
            </FormRow>

            {props?.projectPayments?.map((element, index) => (
                <ProjectPaymentDataForm
                    key={index}
                    index={index}
                    onDelete={handeOnDelete}
                    onSetText={handleSetText}
                    isLoading={props.isLoading}
                    projectPayments={props.projectPayments}
                />
            ))}

        </Form>
    )
}