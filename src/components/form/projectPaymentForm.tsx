import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import InputTextWithButton from "../inputText/inputTextWithButton";
import Form from "./form";

export default function ProjectPaymentForm(props) {

    function addPayment(text, cleanFunction) {
        let localPayments = [...props.stages]
        if (localPayments.indexOf(text) === -1) {
            localPayments.push(text)
            props.setStages(localPayments)
            cleanFunction("")
        }
    }

    function handleRemovePayment(text) {
        let localPayments = [...props.stages]
        if (localPayments.length > -1) {
            const index = localPayments.indexOf(text)
            localPayments.splice(index, 1)
            props.setStages(localPayments)
        }
    }

    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>

                <InputTextWithButton
                    onClick={addPayment}>
                    <PlusIcon className="text-green-600 block h-6 w-6" aria-hidden="true" />
                </InputTextWithButton>

                {props.stages.map((element, index) => (
                    <InputTextWithButton
                        index={index}
                        value={element}
                        disabled={true}
                        key={index + element}
                        onClick={handleRemovePayment}>
                        <TrashIcon className="text-red-600 block h-6 w-6" aria-hidden="true" />
                    </InputTextWithButton>
                ))}
            </Form>
        </>
    )
}
