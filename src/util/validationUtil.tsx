import { CPF_PATTERN, ONLY_CHARACTERS_PATTERN, ONLY_CHARACTERS_PATTERN_TWO } from "./patternValidationUtil"
interface ValidationReturn {
    messages: string[],
    validation: boolean,
}
export const handlePersonValidationForDB = (person) => {
    let validation: ValidationReturn = {validation: false, messages: []} 
    let nameCheck = true
    let cpfCheck = true

    if (!handleValidationTextNotNull(person?.name)) {
        validation = {...validation, messages: [...validation.messages, "O campo nome está em branco."]}
        nameCheck = false
    }
    
    if (!handleValidationCPF(person?.cpf)) {
        validation = {...validation, messages: [...validation.messages, "O campo CPF está invalido."]}
        cpfCheck = false
    }
    
    validation = {...validation, validation: nameCheck && cpfCheck}
    
    return validation
}

export const handleValidationCPF = (text) => {
    text = text?.trim()
    text = text?.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
    const test = new RegExp(CPF_PATTERN).test(text)
    return test
}

export const handleValidationTextNotNull = (text) => {
    text = text?.replaceAll(ONLY_CHARACTERS_PATTERN_TWO, '')
    const test = text?.trim() !== ""
    return test
}