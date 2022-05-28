export const handleRemoveTelephoneMask = (text: string) => {
    return text.replaceAll(" ", "").replaceAll(".", "").replaceAll("-", "")
}

export const handleMountMask = (text: string, mask: string) => {
    let lastDigit = 0
    let maskedText = ""
    let maskLength = mask.length
    let length = text.length

    if (length > 2) {
        for (let i = 1; i <= length; i++) {
            const textChar = text.substring(i, i - 1)
            for (let im = 1; im <= maskLength; im++) {
                const maskChar = mask.substring(im, im - 1)
                if (maskChar === "9" && im > lastDigit) {
                    maskedText = maskedText + textChar
                    lastDigit = im
                    break
                } else if (maskChar !== "9" && maskedText.indexOf(maskChar) === -1) {
                    maskedText = maskedText + maskChar
                }
            }
        }
    } else {
        maskedText = text
    }
    return maskedText
}