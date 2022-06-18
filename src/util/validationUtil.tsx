import { Company, Person, Professional, Project, Property } from "../interfaces/objectInterfaces"
import { CPF_PATTERN, ONLY_CHARACTERS_PATTERN, ONLY_CHARACTERS_PATTERN_TWO } from "./patternValidationUtil"

interface ValidationReturn {
    messages: string[],
    validation: boolean,
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

export const handlePersonValidationForDB = (person: Person) => {
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

export const handleProfessionalValidationForDB = (professional: Professional) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let titleCheck = handleValidationNotNull(professional.title)
    let personCheck = professional?.person?.id !== "" ?? false
    if (!titleCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo titúlo está em branco."] }
    }
    if (!personCheck) {
        validation = { ...validation, messages: [...validation.messages, "O profissional precisa de dados básicos."] }
    }
    validation = { ...validation, validation: titleCheck && personCheck }
    return validation
}

export const handleCompanyValidationForDB = (company: Company) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let nameCheck = handleValidationNotNull(company.name)

    if (!nameCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo nome está em branco."] }
    }

    validation = { ...validation, validation: nameCheck }
    return validation
}

export const handlePropertyValidationForDB = (property: Property) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let nameCheck = handleValidationNotNull(property.name)
    let ownersCheck = property?.owners?.length > 0 ?? false
    let ownersOnBaseCheck = true

    if (!nameCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo nome está em branco."] }
    }

    if (!ownersCheck) {
        validation = { ...validation, messages: [...validation.messages, "A propriedade precisa de ao menos um proprietário."] }
    }

    property.owners.map((element, index) => {
        if (!handleValidationNotNull(element.id)) {
            ownersOnBaseCheck = false
            validation = { ...validation, messages: [...validation.messages, "O proprietário não está cadastrado na base."] }
        }
    })
    validation = { ...validation, validation: nameCheck && ownersCheck && ownersOnBaseCheck }
    return validation
}

export const handleProjectValidationForDB = (project: Project) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let nameCheck = handleValidationNotNull(project.number)
    let clientsCheck = project?.clients?.length > 0 ?? false
    let propertiesCheck = project?.properties?.length > 0 ?? false
    let professionalCheck = project?.professional?.id?.length > 0 ?? false
    let clientsOnBaseCheck = true
    let propertiesOnBaseCheck = true

    if (!nameCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo nome está em branco."] }
    }

    if (!professionalCheck) {
        validation = { ...validation, messages: [...validation.messages, "O projeto precisa de ao menos um profissional."] }
    }

    if (!clientsCheck) {
        validation = { ...validation, messages: [...validation.messages, "O projeto precisa de ao menos um cliente."] }
    }

    if (!propertiesCheck) {
        validation = { ...validation, messages: [...validation.messages, "O projeto precisa de ao menos uma propriedade."] }
    }

    project.clients.map((element, index) => {
        if (!handleValidationNotNull(element.id)) {
            clientsOnBaseCheck = false
            validation = { ...validation, messages: [...validation.messages, "O cliente não está cadastrado na base."] }
        }
    })

    project.properties.map((element, index) => {
        if (!handleValidationNotNull(element.id)) {
            propertiesOnBaseCheck = false
            validation = { ...validation, messages: [...validation.messages, "A propriedade não está cadastrado na base."] }
        }
    })
    validation = { ...validation, validation: nameCheck && clientsCheck && clientsOnBaseCheck }
    return validation
}