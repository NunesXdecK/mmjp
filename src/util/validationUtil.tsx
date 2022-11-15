import { handleRemoveCNPJMask } from "./maskUtil"
import { Company, Person, Professional, Project, ServicePayment, ServiceStage, Immobile, Service, User, SubjectMessage, Budget, Payment } from "../interfaces/objectInterfaces"
import { CNPJ_PATTERN, CPF_PATTERN, ONLY_CHARACTERS_PATTERN, ONLY_CHARACTERS_PATTERN_TWO, ONLY_SPECIAL_FOR_NUMBER_PATTERN } from "./patternValidationUtil"

export interface ValidationReturn {
    messages: string[],
    validation: boolean,
}

export const handleIsEqual = (objectOne, objectTwo) => {
    let isEqual = true
    try {
        if ((objectOne && Array.isArray(objectOne)) && (objectTwo && Array.isArray(objectTwo))) {
            if (objectOne?.length !== objectTwo?.length) {
                return false
            }
            objectOne.map((element, index) => {
                if (isEqual) {
                    isEqual = handleIsEqual(element, objectTwo[index])
                }
            })
        } else if ((objectOne && typeof objectOne === 'object') && (objectTwo && typeof objectTwo === 'object')) {
            let arrayOne = Object.keys(objectOne)
            let arrayTwo = Object.keys(objectTwo)
            if (arrayOne?.length !== arrayTwo?.length) {
                return false
            }
            arrayOne?.map((element, index) => {
                if (isEqual) {
                    isEqual = handleIsEqual(objectOne[element], objectTwo[element])
                }
            })
        } else if (objectOne !== null && objectTwo !== null && objectOne !== objectTwo) {
            return false
        }
    } catch (err) {
        console.error(err)
        return false
    }
    return isEqual
}

export const handleJSONcheck = (value) => {
    if (typeof value !== 'string') return false
    try {
        const result = JSON.parse(value)
        const type = Object.prototype.toString.call(result)
        return type === "[object Object]" || type === "[object Array]"
    } catch (err) {
        return false
    }
}

export const handleValidationCNPJ = (text) => {
    let test = false
    if (text) {
        text = text?.trim()
        text = handleRemoveCNPJMask(text)
        text = text?.replace(new RegExp(ONLY_SPECIAL_FOR_NUMBER_PATTERN), "")
        text = text?.replace(new RegExp(ONLY_CHARACTERS_PATTERN), "")
        test = new RegExp(CNPJ_PATTERN).test(text)
    }
    return test
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
        test = handleValidationNotNull(text)
    }
    return test
}
export const handleValidationNotNull = (text) => {
    let test = false
    if (text) {
        test = text?.trim() !== ""
    }
    return test
}

export const handleSubjectMessageValidationForDB = (subjectMessage: SubjectMessage) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let textCheck = true
    if (!handleValidationOnlyTextNotNull(subjectMessage?.text)) {
        validation = { ...validation, messages: [...validation.messages, "O mensagem está em branco."] }
        textCheck = false
    }
    validation = { ...validation, validation: textCheck }
    return validation
}