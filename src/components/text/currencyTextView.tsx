interface CurrencyTextViewProps {
    className?: string,
    children?: string | number,
}

export default function CurrencyTextView(props: CurrencyTextViewProps) {
    let numberMasked = ""
    if (props.children) {
        const localText = props.children.toString().replaceAll(".", "").replaceAll(",", "")
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
        <span className={props.className}>{numberMasked}</span>
    )
}