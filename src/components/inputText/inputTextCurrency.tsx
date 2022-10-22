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
    onSet?: (string) => void,
    onValidate?: (boolean?) => void,
}

export default function InputTextCurrency(props: InputTextCurrencyProps) {
    let numberMasked = ""
    if (props.value) {
        const localText = props.value.toString().replaceAll(".", "").replaceAll(",", "")
        const length = localText.length
        const lengthBetween = length - 2
        const digOneCount = Math.floor(lengthBetween / 3)
        let lastPos = 0
        let posToSub = []
        for (let i = 0; i < digOneCount; i++) {
            lastPos = lastPos + 3
            posToSub = [...posToSub, (lastPos + 2)]
        }
        for (let i = length; i > 0; i--) {
            const char = localText.substring(i, i - 1)
            const iz = (length - i) + 1
            if (iz === (2 + 1)) {
                numberMasked = "," + numberMasked
            }

            if (posToSub.includes(iz)) {
                numberMasked = "." + char + numberMasked
            } else {
                numberMasked = char + numberMasked
            }
        }
        if (numberMasked.substring(0, 1) === "." || numberMasked.substring(0, 1) === ",") {
            numberMasked = numberMasked.substring(1, numberMasked.length)
        }
    }
    return (
        <InputText
            id={props.id}
            title={props.title}
            value={numberMasked}
            onBlur={props.onBlur}
            onSetText={props.onSet}
            validation={NUMBER_MARK}
            isLoading={props.isLoading}
            isDisabled={props.isDisabled}
            onValidate={props.onValidate}
            validationMessage={props.validationMessage}
        />
    )
}
