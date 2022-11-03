import InputText from "./inputText";
import { NUMBER_MARK } from "../../util/patternValidationUtil";

interface InputTextCurrencyProps {
    id?: string,
    value?: string,
    title?: string,
    validationMessage?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    onBlur?: (any?) => void,
    onFocus?: (any?) => void,
    onSet?: (string) => void,
    onValidate?: (boolean?) => void,
}

export default function InputTextCurrency(props: InputTextCurrencyProps) {
    return (
        <InputText
            id={props.id}
            mask="currency"
            title={props.title}
            value={props.value}
            onBlur={props.onBlur}
            onFocus={(event) => {
                if (event.target.value === "0") {
                    if (props.onSet) {
                        props.onSet("")
                    }
                }
                if (props.onFocus) {
                    props.onFocus(event)
                }
            }}
            onSetText={props.onSet}
            validation={NUMBER_MARK}
            isLoading={props.isLoading}
            isDisabled={props.isDisabled}
            onValidate={props.onValidate}
            validationMessage={props.validationMessage}
        />
    )
}
