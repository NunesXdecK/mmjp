import { ONLY_NUMBERS_PATTERN_TWO } from "./patternValidationUtil"

export const handleMaskCPF = (text) => {
    if (text) {
        const dig1 = "-"
        const dig2 = "."
        const unMaskedText = handleRemoveCPFMask(text)
        text = handleMountCPFCurrency(unMaskedText, dig1, dig2)
    }
    return text
}

export const handleMaskTelephone = (text: string) => {
    if (text) {
        text = text.trim().replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "")
        let mask = "(99) 99999-9999"
        if (text.length === 10) {
            mask = "(99) 9999-9999"
        }
        text = handleMountMask(text, mask)
    }
    return text
}

export const handleMountMask = (text: string, mask: string) => {
    let maskedText = ""
    if (text && mask) {
        let lastDigit = 0
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
    }
    return maskedText
}

export const handleMountCPFCurrency = (text, dig1, dig2) => {
    let maskedText = ""
    if (text && dig1 && dig2) {
        const length = text.length
        for (let i = length; i > 0; i--) {
            const char = text.substring(i, i - 1)
            const iz = (length - i) + 1
            if (i === (length - 2)) {
                maskedText = dig1 + maskedText
            }

            if (
                i !== 0
                && iz > 3
                && iz % 3 === 0
            ) {
                maskedText = dig2 + maskedText
            }

            maskedText = char + maskedText
        }
    }
    return maskedText
}

export const handleRemoveCPFMask = (text: string) => {
    if (text) {
        text = text.replaceAll("-", "").replaceAll(".", "")
    }
    return text
}

export const handleRemoveCEPMask = (text: string) => {
    if (text) {
        text = text.replaceAll(" ", "").replaceAll("-", "").replaceAll(".", "")
        text = text.replace(new RegExp(ONLY_NUMBERS_PATTERN_TWO), "")
    }
    return text
}

export const handleRemoveTelephoneMask = (text: string) => {
    if (text) {
        text = text.replaceAll(" ", "").replaceAll(".", "").replaceAll("-", "")
    }
    return text
}