import { CPF_PATTERN, ONLY_CHARACTERS_PATTERN, ONLY_CHARACTERS_PATTERN_TWO } from "./patternValidationUtil"

interface ValidationReturn {
    messages: string[],
    validation: boolean,
}

export const handlePersonValidationForDB = (person) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let nameCheck = true
    let cpfCheck = true

    if (!handleValidationOnlyTextNotNull(person?.name)) {
        validation = { ...validation, messages: [...validation.messages, "O campo nome está em branco."] }
        nameCheck = false
    }

    if (!handleValidationCPF(person?.cpf)) {
        validation = { ...validation, messages: [...validation.messages, "O campo CPF está invalido."] }
        cpfCheck = false
    }

    validation = { ...validation, validation: nameCheck && cpfCheck }

    return validation
}

export const handleValidationCPF = (text) => {
    let test = false
    if (text) {
        text = text?.trim()
        text = text?.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
        test = new RegExp(CPF_PATTERN).test(text)
    }
    return test
}

export const handleValidationOnlyNumbersNotNull = (text) => {
    let test = false
    if (text) {
        test = text?.trim()
        test = new RegExp(ONLY_CHARACTERS_PATTERN_TWO).test(text)
    }
    return test
}

export const handleValidationOnlyTextNotNull = (text) => {
    let test = false
    if (text) {
        text = text?.replaceAll(ONLY_CHARACTERS_PATTERN_TWO, '')
        test = text?.trim() !== ""
    }
    return test
}