import { Company, Person, Professional, Project, ServicePayment, ServiceStage, Immobile, Service } from "../interfaces/objectInterfaces"
import { handleRemoveCNPJMask } from "./maskUtil"
import { CNPJ_PATTERN, CPF_PATTERN, ONLY_CHARACTERS_PATTERN, ONLY_CHARACTERS_PATTERN_TWO, ONLY_SPECIAL_FOR_NUMBER_PATTERN } from "./patternValidationUtil"

interface ValidationReturn {
    messages: string[],
    validation: boolean,
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
    let personCheck = professional?.person?.id?.length > 0 ?? false
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
    let cnpjCheck = true

    if (!nameCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo nome está em branco."] }
    }


    if (!handleValidationCPF(company?.cnpj)) {
        validation = { ...validation, messages: [...validation.messages, "O campo CNPJ está invalido."] }
        cnpjCheck = false
    }

    validation = { ...validation, validation: nameCheck && cnpjCheck }
    return validation
}

export const handleImmobileValidationForDB = (immobile: Immobile) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let nameCheck = handleValidationNotNull(immobile.name)
    let ownersCheck = immobile?.owners?.length > 0 ?? false
    let ownersOnBaseCheck = true

    if (!nameCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo nome está em branco."] }
    }

    if (!ownersCheck) {
        validation = { ...validation, messages: [...validation.messages, "O imóvel precisa de ao menos um proprietário."] }
    }

    immobile.owners.map((element, index) => {
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
    let nameCheck = handleValidationNotNull(project.title)
    let clientsCheck = project?.clients?.length > 0 ?? false
    let professionalCheck = project?.professional?.id?.length > 0 ?? false
    let clientsOnBaseCheck = true

    if (!nameCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo titulo está em branco."] }
    }

    if (!professionalCheck) {
        validation = { ...validation, messages: [...validation.messages, "O projeto precisa de ao menos um profissional."] }
    }

    if (!clientsCheck) {
        validation = { ...validation, messages: [...validation.messages, "O projeto precisa de ao menos um cliente."] }
    }


    project.clients.map((element, index) => {
        if (!handleValidationNotNull(element.id)) {
            clientsOnBaseCheck = false
            validation = { ...validation, messages: [...validation.messages, "O cliente não está cadastrado na base."] }
        }
    })
    {/*
    let immobilesTargetCheck = project?.immobilesTarget?.length > 0 ?? false
    let immobilesOriginOnBaseCheck = true
    let immobilesTargetOnBaseCheck = true
    if (!immobilesTargetCheck) {
        validation = { ...validation, messages: [...validation.messages, "O projeto precisa de ao menos um imóvel alvo."] }
    }
    project.immobilesTarget.map((element, index) => {
        if (!handleValidationNotNull(element.id)) {
            immobilesTargetOnBaseCheck = false
            validation = { ...validation, messages: [...validation.messages, "O imóvel alvo " + element.name + " não está cadastrado na base."] }
        }
    })
    
    project.immobilesOrigin.map((element, index) => {
        if (!handleValidationNotNull(element.id)) {
            immobilesOriginOnBaseCheck = false
            validation = { ...validation, messages: [...validation.messages, "O imóvel de origem " + element.name + " não está cadastrado na base."] }
        }
    })
*/}

    validation = { ...validation, validation: nameCheck && clientsCheck && clientsOnBaseCheck }
    return validation
}

export const handleServiceValidationForDB = (service: Service) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let titleCheck = handleValidationNotNull(service.title)

    if (!titleCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo titulo está em branco."] }
    }

    validation = { ...validation, validation: titleCheck }
    return validation
}

export const handleServiceStageValidationForDB = (serviceStage: ServiceStage) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let titleCheck = handleValidationNotNull(serviceStage.title)

    if (!titleCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo titulo está em branco."] }
    }

    validation = { ...validation, validation: titleCheck }
    return validation
}

export const handleServicePaymentValidationForDB = (servicePayment: ServicePayment) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let valueCheck = handleValidationNotNull(servicePayment.value)
    let descriptionCheck = handleValidationNotNull(servicePayment.description)
    let serviceCheck = servicePayment?.service?.id?.length > 0 ?? false

    if (!valueCheck) {
        validation = { ...validation, messages: [...validation.messages, "O valor está em branco."] }
    }

    if (!descriptionCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo descrição está em branco."] }
    }

    if (!serviceCheck) {
        validation = { ...validation, messages: [...validation.messages, "O pagamento precisa de um projeto referente."] }
    }

    validation = { ...validation, validation: descriptionCheck && valueCheck && serviceCheck }
    return validation
}