import { handleNewDateToUTC, handleUTCToDateShow } from "./dateUtils"
import { defaultPerson, defaultAddress, defaultProfessional, defaultImmobile, Person, Address, Professional, Immobile, Company, defaultCompany, Project, ServiceStage, ServicePayment, Service, User, SubjectMessage, LoginToken } from "../interfaces/objectInterfaces"
import { handleMaskCNPJ, handleMaskCPF, handleMaskTelephone, handleMountMask, handleMountNumberCurrency, handleRemoveCEPMask, handleRemoveCNPJMask, handleRemoveCPFMask, handleRemoveCurrencyMask, handleRemoveDateMask, handleRemoveTelephoneMask, handleValueStringToFloat } from "./maskUtil"
import { COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../db/firebaseDB"

export interface ElementFromBase {
    "Nome Prop."?: string,
    "CPF Prop."?: string,
    "RG Prop."?: string,
    "Nacionalidade Prop."?: string,
    "Naturalidade Prop."?: string,
    "Estado Civíl Prop."?: string,
    "Profissão Prop."?: string,
    "Telefone Prop."?: string,
    "Logradouro End."?: string,
    "Numero End."?: string,
    "Bairro End."?: string,
    "CEP End."?: string,
    "Município/UF End."?: string,
    "Lote"?: string,
    "Data"?: string,
    "Data Simples"?: string,
    "Nome Prof."?: string,
    "CPF Prof."?: string,
    "RG Prof."?: string,
    "Título Prof."?: string,
    "CREA Prof."?: string,
    "Cod. Credenciado"?: string,
    "Endereço Prof."?: string,
    "Bairro Prof."?: string,
    "Cidade/UF Prof."?: string,
    "CEP"?: string,
    "Telefone Prof. "?: string
}

export const defaultElementFromBase: ElementFromBase = {
    "Nome Prop.": "",
    "CPF Prop.": "",
    "RG Prop.": "",
    "Nacionalidade Prop.": "",
    "Naturalidade Prop.": "",
    "Estado Civíl Prop.": "",
    "Profissão Prop.": "",
    "Telefone Prop.": "",
    "Logradouro End.": "",
    "Numero End.": "",
    "Bairro End.": "",
    "CEP End.": "",
    "Município/UF End.": "",
    "Lote": "",
    "Data": "",
    "Data Simples": "",
    "Nome Prof.": "",
    "CPF Prof.": "",
    "RG Prof.": "",
    "Título Prof.": "",
    "CREA Prof.": "",
    "Cod. Credenciado": "",
    "Endereço Prof.": "",
    "Bairro Prof.": "",
    "Cidade/UF Prof.": "",
    "CEP": "",
    "Telefone Prof. ": "",
}

const getUTCDate = (element: ElementFromBase) => {
    let dateCadUTC = 0
    let dateCad = checkStringForNull(element["Data Simples"])
    if (dateCad) {
        let dateCadArray = dateCad.split("/")
        let day = parseInt(dateCadArray[0])
        let month = parseInt(dateCadArray[1])
        let year = parseInt(dateCadArray[2])
        let dateEXT = year + "-" + month + "-" + day + " 10:00:00"
        dateCadUTC = Date.parse(dateEXT)
    }
    return dateCadUTC
}

const checkStringForNull = (string) => {
    return string?.trim() ?? ""
}

export const handlePreparePersonForShow = (person: Person) => {
    if (person?.address && person?.address?.cep) {
        person = { ...person, address: { ...person.address, cep: handleMountMask(handleRemoveCEPMask(person.address.cep), "99999-999") } }
    }

    let telephonesWithMask = []
    if (person.telephones && person.telephones.length) {
        person?.telephones?.map((element, index) => {
            telephonesWithMask = [...telephonesWithMask, handleMaskTelephone(element)]
        })
    }

    person = {
        ...person
        , cpf: handleMaskCPF(person?.cpf)
        , telephones: telephonesWithMask
    }
    return person
}

export const handlePrepareSubjectMessageForDB = (subjectMessage: SubjectMessage) => {
    if (subjectMessage.dateInsertUTC === 0) {
        subjectMessage = { ...subjectMessage, dateInsertUTC: handleNewDateToUTC() }
    }

    if (subjectMessage && "id" in subjectMessage && subjectMessage.id.length) {
        subjectMessage = { ...subjectMessage, dateLastUpdateUTC: handleNewDateToUTC() }
    }
    subjectMessage = {
        ...subjectMessage,
        text: subjectMessage.text.trim()
    }
    return subjectMessage
}

export const handlePreparePersonForDB = (person: Person) => {
    if (person.address && person.address?.cep) {
        person = { ...person, address: { ...person.address, cep: handleRemoveCEPMask(person.address.cep) } }
    }

    if (person.dateInsertUTC === 0) {
        person = { ...person, dateInsertUTC: handleNewDateToUTC() }
    }

    if (person && "id" in person && person.id.length) {
        person = { ...person, dateLastUpdateUTC: handleNewDateToUTC() }
    }

    let telephonesWithNoMask = []
    if (person.telephones && person.telephones.length) {
        person.telephones?.map((element, index) => {
            telephonesWithNoMask = [...telephonesWithNoMask, handleRemoveTelephoneMask(element)]
        })
    }
    if (person.oldData) {
        delete person.oldData
    }

    person = {
        ...person
        , cpf: handleRemoveCPFMask(person.cpf)
        , telephones: telephonesWithNoMask
    }
    return person
}

export const handlePrepareCompanyForShow = (company: Company) => {
    if (company.address && company.address?.cep) {
        company = { ...company, address: { ...company.address, cep: handleMountMask(handleRemoveCEPMask(company.address.cep), "99999-999") } }
    }

    let telephonesWithMask = []
    if (company.telephones && company.telephones.length) {
        company.telephones?.map((element, index) => {
            telephonesWithMask = [...telephonesWithMask, handleMaskTelephone(element)]
        })
    }

    let personsWithMask = []
    if (company.owners && company.owners.length) {
        company.owners?.map((element, index) => {
            personsWithMask = [...personsWithMask, handlePreparePersonForShow(element)]
        })
    }
    company = {
        ...company
        , cnpj: handleMaskCNPJ(company.cnpj)
        , telephones: telephonesWithMask
        , owners: personsWithMask
    }
    return company
}

export const handlePrepareCompanyForDB = (company: Company) => {
    if (company.address && company.address?.cep) {
        company = { ...company, address: { ...company.address, cep: handleRemoveCEPMask(company.address.cep) } }
    }

    if (company.dateInsertUTC === 0) {
        company = { ...company, dateInsertUTC: handleNewDateToUTC() }
    }

    if (company && "id" in company && company.id.length) {
        company = { ...company, dateLastUpdateUTC: handleNewDateToUTC() }
    }

    let telephonesWithNoMask = []
    if (company.telephones && company.telephones.length) {
        company.telephones?.map((element, index) => {
            telephonesWithNoMask = [...telephonesWithNoMask, handleRemoveTelephoneMask(element)]
        })
    }

    let owners = []
    if (company.owners && company.owners.length) {
        company.owners?.map((element, index) => {
            if (element && "id" in element && element.id.length) {
                owners = [...owners, { id: element.id }]
            }
        })
    }

    if (company.oldData) {
        delete company.oldData
    }

    company = {
        ...company,
        owners: owners,
        telephones: telephonesWithNoMask,
        cnpj: handleRemoveCNPJMask(company.cnpj),
    }
    return company
}

export const handlePrepareUserForDB = (user: User) => {
    if (user.dateInsertUTC === 0) {
        user = { ...user, dateInsertUTC: handleNewDateToUTC() }
    }
    if (user && "id" in user && user.id.length) {
        user = { ...user, dateLastUpdateUTC: handleNewDateToUTC() }
    }
    if (user.person?.id?.length) {
        user = { ...user, person: { id: user.person.id } }
    } else {
        user = { ...user, person: {} }
    }
    return user
}

export const handlePrepareLoginTokenForDB = (loginToken: LoginToken) => {
    if (loginToken.dateInsertUTC === 0) {
        loginToken = { ...loginToken, dateInsertUTC: handleNewDateToUTC() }
    }
    if (loginToken && "id" in loginToken && loginToken.id.length) {
        loginToken = { ...loginToken, dateLastUpdateUTC: handleNewDateToUTC() }
    }
    if (loginToken.user?.id?.length) {
        loginToken = { ...loginToken, user: { id: loginToken.user.id } }
    } else {
        loginToken = { ...loginToken, user: {} }
    }
    return loginToken
}

export const handlePrepareProfessionalForDB = (professional: Professional) => {
    if (professional.dateInsertUTC === 0) {
        professional = { ...professional, dateInsertUTC: handleNewDateToUTC() }
    }

    if (professional && "id" in professional && professional.id.length) {
        professional = { ...professional, dateLastUpdateUTC: handleNewDateToUTC() }
    }

    if (professional.person?.id?.length) {
        professional = { ...professional, person: { id: professional.person.id } }
    } else {
        professional = { ...professional, person: {} }
    }

    if (professional.oldData) {
        delete professional.oldData
    }
    return professional
}

export const handlePrepareImmobileForDB = (immobile: Immobile) => {
    if (immobile.dateInsertUTC === 0) {
        immobile = { ...immobile, dateInsertUTC: handleNewDateToUTC() }
    }
    if (immobile && "id" in immobile && immobile.id.length) {
        immobile = { ...immobile, dateLastUpdateUTC: handleNewDateToUTC() }
    }
    if (immobile.oldData) {
        delete immobile.oldData
    }
    let owners = []
    if (immobile.owners && immobile.owners.length) {
        immobile.owners?.map((element, index) => {
            if (element && "id" in element && element.id.length) {
                if ("cpf" in element) {
                    owners = [...owners, { id: element.id, cpf: "" }]
                } else if ("cnpj" in element) {
                    owners = [...owners, { id: element.id, cnpj: "" }]
                }
            } else if (element?._key?.path?.segments[5]?.length
                && element?._key?.path?.segments[6]?.length) {
                let database = element?._key?.path?.segments[5] ?? ""
                let id = element?._key?.path?.segments[6] ?? ""
                if (database?.includes(PERSON_COLLECTION_NAME)) {
                    if (id?.length) {
                        owners = [...owners, { id: id, cpf: "" }]
                    }
                } else if (database?.includes(COMPANY_COLLECTION_NAME)) {
                    if (id?.length) {
                        owners = [...owners, { id: id, cnpj: "" }]
                    }
                }
            }
        })
    }
    immobile = {
        ...immobile,
        owners: owners,
        address: { ...immobile.address, cep: handleRemoveCEPMask(immobile.address?.cep) }
    }
    return immobile
}

export const handlePrepareProjectForDB = (project: Project) => {
    if (project.dateInsertUTC === 0) {
        project = { ...project, dateInsertUTC: handleNewDateToUTC() }
    }
    if (project && "id" in project && project.id.length) {
        project = { ...project, dateLastUpdateUTC: handleNewDateToUTC() }
    }
    if (project.dateString?.length === 10) {
        const dateText = handleRemoveDateMask(project.dateString)
        if (dateText.length === 8) {
            const day = dateText.substring(0, 2)
            const month = dateText.substring(2, 4)
            const year = dateText.substring(4, dateText.length)
            const utcString = new Date(month + " " + day + " " + year).toUTCString()
            project = { ...project, dateDue: Date.parse(utcString) }
        }
    }
    if (project.dateDue === 0) {
        project = { ...project, dateDue: handleNewDateToUTC() }
    }
    let clients = []
    if (project.clients && project.clients.length) {
        project.clients?.map((element, index) => {
            if (element && "id" in element && element.id.length) {
                if ("cpf" in element) {
                    clients = [...clients, { id: element.id, cpf: "" }]
                } else if ("cnpj" in element) {
                    clients = [...clients, { id: element.id, cnpj: "" }]
                }
            }
        })
    }
    if (project.dateString) {
        delete project.dateString
    }
    if (project.oldData) {
        delete project.oldData
    }
    project = {
        ...project,
        clients: clients,
        title: project.title.trim(),
    }
    return project
}

export const handlePrepareServiceForDB = (service: Service) => {
    if (service.title.length) {
        service = { ...service, title: service.title?.trim() }
    }
    if (service.value.length) {
        service = { ...service, value: handleRemoveCurrencyMask(service.value) }
    }
    if (service.description.length) {
        service = { ...service, description: service.description?.trim() }
    }
    if (service.dateInsertUTC === 0) {
        service = { ...service, dateInsertUTC: handleNewDateToUTC() }
    } else {
        service = { ...service, dateLastUpdateUTC: handleNewDateToUTC() }
    }
    if (service.dateString?.length === 10) {
        const dateText = handleRemoveDateMask(service.dateString)
        if (dateText.length === 8) {
            const day = dateText.substring(0, 2)
            const month = dateText.substring(2, 4)
            const year = dateText.substring(4, dateText.length)
            const utcString = new Date(month + " " + day + " " + year).toUTCString()
            service = { ...service, dateDue: Date.parse(utcString) }
            delete service.dateString
        }
    }
    if (service.professional?.id?.length) {
        service = { ...service, professional: { id: service.professional.id } }
    } else {
        service = { ...service, professional: {} }
    }
    if (service.project?.id?.length) {
        service = { ...service, project: { id: service.project.id } }
    } else {
        service = { ...service, project: {} }
    }
    let immobilesTarget = []
    if (service.immobilesTarget && service.immobilesTarget.length) {
        service.immobilesTarget?.map((element, index) => {
            if (element && "id" in element && element.id.length) {
                immobilesTarget = [...immobilesTarget, { id: element.id }]
            }
        })
    }
    let immobilesOrigin = []
    if (service.immobilesOrigin && service.immobilesOrigin.length) {
        service.immobilesOrigin?.map((element, index) => {
            if (element && "id" in element && element.id.length) {
                immobilesOrigin = [...immobilesOrigin, { id: element.id }]
            }
        })
    }
    let serviceStages = []
    if (service.serviceStages && service.serviceStages.length) {
        service.serviceStages?.map((element, index) => {
            let serviceStage: ServiceStage = handlePrepareServiceStageForDB(element)
            if (serviceStage && "id" in serviceStage && serviceStage.id.length) {
                serviceStage = { ...serviceStage, id: serviceStage.id }
            }
            serviceStages = [...serviceStages, serviceStage]
        })
    }
    let servicePayments = []
    if (service.servicePayments && service.servicePayments.length) {
        service.servicePayments?.map((element, index) => {
            let servicePayment: ServicePayment = handlePrepareServicePaymentForDB(element)
            if (servicePayment && "id" in servicePayment && servicePayment.id.length) {
                servicePayment = { ...servicePayment, id: servicePayment.id }
            }
            servicePayments = [...servicePayments, servicePayment]
        })
    }
    {/*
    let serviceStages = []
    service.serviceStages.map((element, index) => {
        if (element && "id" in element && element.id.length) {
            serviceStages = [...serviceStages, { id: element.id }]
        }
    })
    let servicePayments = []
    service.servicePayments.map((element, index) => {
        if (element && "id" in element && element.id.length) {
            servicePayments = [...servicePayments, { id: element.id }]
        }
    })
    if (service.serviceStages) {
        delete service.serviceStages
    }
    if (service.servicePayments) {
        delete service.servicePayments
    }
*/}

    service = {
        ...service,
        serviceStages: serviceStages,
        servicePayments: servicePayments,
        immobilesTarget: immobilesTarget,
        immobilesOrigin: immobilesOrigin,
    }

    return service
}

export const handlePrepareServiceStageForDB = (serviceStage: ServiceStage) => {
    if (serviceStage.title.length) {
        serviceStage = { ...serviceStage, title: serviceStage.title?.trim() }
    }
    if (serviceStage.description.length) {
        serviceStage = { ...serviceStage, description: serviceStage.description?.trim() }
    }
    if (serviceStage.dateInsertUTC === 0) {
        serviceStage = { ...serviceStage, dateInsertUTC: handleNewDateToUTC() }
    } else {
        serviceStage = { ...serviceStage, dateLastUpdateUTC: handleNewDateToUTC() }
    }
    if (serviceStage.dateString?.length === 10) {
        const dateText = handleRemoveDateMask(serviceStage.dateString)
        if (dateText.length === 8) {
            const day = dateText.substring(0, 2)
            const month = dateText.substring(2, 4)
            const year = dateText.substring(4, dateText.length)
            const utcString = new Date(month + " " + day + " " + year).toUTCString()
            serviceStage = { ...serviceStage, dateDue: Date.parse(utcString) }
            delete serviceStage.dateString
        }
    }
    if (serviceStage.responsible?.id?.length) {
        serviceStage = { ...serviceStage, responsible: { id: serviceStage.responsible.id } }
    } else {
        serviceStage = { ...serviceStage, responsible: {} }
    }
    if (serviceStage.service?.id?.length) {
        serviceStage = { ...serviceStage, service: { id: serviceStage.service.id } }
    } else {
        serviceStage = { ...serviceStage, service: {} }
    }
    return serviceStage
}

export const handlePrepareServicePaymentForDB = (servicePayment: ServicePayment) => {
    if (servicePayment.value.length) {
        servicePayment = { ...servicePayment, value: handleRemoveCurrencyMask(servicePayment.value) }
    }
    if (servicePayment.description.length) {
        servicePayment = { ...servicePayment, description: servicePayment.description?.trim() }
    }
    if (servicePayment.dateInsertUTC === 0) {
        servicePayment = { ...servicePayment, dateInsertUTC: handleNewDateToUTC() }
    } else {
        servicePayment = { ...servicePayment, dateLastUpdateUTC: handleNewDateToUTC() }
    }
    if (servicePayment.dateString?.length === 10) {
        const dateText = handleRemoveDateMask(servicePayment.dateString)
        if (dateText.length === 8) {
            const day = dateText.substring(0, 2)
            const month = dateText.substring(2, 4)
            const year = dateText.substring(4, dateText.length)
            const utcString = new Date(month + " " + day + " " + year).toUTCString()
            servicePayment = { ...servicePayment, dateDue: Date.parse(utcString) }
            delete servicePayment.dateString
        }
    }
    if (servicePayment.service?.id?.length) {
        servicePayment = { ...servicePayment, service: { id: servicePayment.service.id } }
    } else {
        servicePayment = { ...servicePayment, service: {} }
    }
    return servicePayment
}

export const handlePrepareServicePaymentStageForDB = (service: Service, list: (ServicePayment | ServiceStage)[]) => {
    let elements = []
    if (list && list.length) {
        list?.map((element: (ServicePayment | ServiceStage), index) => {
            if ("title" in element) {
                element = { ...element, title: element.title?.trim() }
            }

            if (element.dateInsertUTC === 0) {
                element = { ...element, dateInsertUTC: handleNewDateToUTC() }
            } else {
                element = { ...element, dateLastUpdateUTC: handleNewDateToUTC() }
            }

            if (element.dateString?.length === 10) {
                const dateText = handleRemoveDateMask(element.dateString)
                if (dateText.length === 8) {
                    const day = dateText.substring(0, 2)
                    const month = dateText.substring(2, 4)
                    const year = dateText.substring(4, dateText.length)
                    const utcString = new Date(month + " " + day + " " + year).toUTCString()
                    element = { ...element, dateDue: Date.parse(utcString) }
                    delete element.dateString
                }
            }
            elements = [...elements, { ...element, service: service, description: element.description?.trim(), index: index }]
        })
    }
    return elements
}

export const handlePrepareServiceForShow = (service: Service) => {
    return {
        ...service,
        dateString: handleUTCToDateShow(service.dateDue?.toString()),
        total: handleMountNumberCurrency(service.total, ".", ",", 3, 2),
        value: handleMountNumberCurrency((service.value).toString(), ".", ",", 3, 2),
        serviceStages: handlePrepareServicePaymentStageForShow(service.serviceStages),
        servicePayments: handlePrepareServicePaymentStageForShow(service.servicePayments),
    }
}

const handleSortByIndex = (elementOne, elementTwo) => {
    let indexOne = 0
    let indexTwo = 0
    if (elementOne && "index" in elementOne) {
        indexOne = elementOne.index
    }
    if (elementTwo && "index" in elementTwo) {
        indexTwo = elementTwo.index
    }
    return indexOne - indexTwo
}

export const handlePrepareServicePaymentStageForShow = (list: (ServicePayment | ServiceStage)[]) => {
    let localList = []
    if (list && list.length > 0) {
        list?.map((element: (ServicePayment | ServiceStage), index) => {
            if ("value" in element) {
                element = { ...element, value: handleMountNumberCurrency((element.value).toString(), ".", ",", 3, 2) }
            }
            localList = [...localList, {
                ...element,
                dateString: handleUTCToDateShow(element.dateDue?.toString())
            }]
        })
        if (localList && localList.length > 0) {
            localList = localList.sort(handleSortByIndex)
        }
    }
    return localList
}

export const extratePersonAddress = (element: ElementFromBase) => {
    let address: Address = defaultAddress
    if (element["Logradouro End."]) {
        let cep = checkStringForNull(element["CEP End."])
        if (cep) {
            cep = handleRemoveCEPMask(cep)
        }
        let publicPlace = checkStringForNull(element["Logradouro End."])
        let number = checkStringForNull(element["Numero End."])
        let district = checkStringForNull(element["Bairro End."])
        let county = checkStringForNull(element["Município/UF End."])

        address = {
            ...address,
            publicPlace: publicPlace,
            number: number,
            district: district,
            county: county,
            cep: cep,
        }
    }
    return address
}

export const extratePerson = (element: ElementFromBase) => {
    let person: Person = defaultPerson
    let personAddress: Address = extratePersonAddress(element)

    let cpf = checkStringForNull(element["CPF Prop."])

    if (cpf) {
        cpf = handleRemoveCPFMask(cpf)
    }

    let rg = checkStringForNull(element["RG Prop."])
    let rgIssuer = ""

    if (rg) {
        if (rg.indexOf(" ") > -1) {
            let rgArray = rg?.split(" ")
            rgIssuer = checkStringForNull(rgArray[1])
            rg = checkStringForNull(rgArray[0])
        }
    }

    let telephones = []
    let telephone = checkStringForNull(element["Telefone Prop."])

    if (telephone) {
        if (telephone.indexOf("/") > -1) {
            telephones = telephone.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "").split("/")
        } else {
            telephones = [...telephones, telephone.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "")]
        }
    }

    let name = checkStringForNull(element["Nome Prop."])
    let nationality = checkStringForNull(element["Nacionalidade Prop."])
    let naturalness = checkStringForNull(element["Naturalidade Prop."])
    let maritalStatus = checkStringForNull(element["Estado Civíl Prop."])
    let profession = checkStringForNull(element["Profissão Prop."])

    person = {
        ...person,
        name: name,
        cpf: cpf,
        rg: rg,
        rgIssuer: rgIssuer,
        nationality: nationality,
        naturalness: naturalness,
        maritalStatus: maritalStatus,
        profession: profession,
        dateInsertUTC: getUTCDate(element),
        telephones: telephones,
        address: personAddress,
        oldData: element,
    }

    return person
}

export const extrateProfessional = (element: ElementFromBase) => {
    let professional: Professional = defaultProfessional
    let professionalPerson: Person = defaultPerson
    let professionalAddress: Address = defaultAddress

    let professionalCPF = checkStringForNull(element["CPF Prof."])
    if (professionalCPF) {
        professionalCPF = professionalCPF.replaceAll("-", "").replaceAll(".", "")
    }

    let professionalRG = checkStringForNull(element["RG Prof."])
    let professionalRGIssuer = ""
    if (professionalRG) {
        let professionalRGArray = professionalRG?.replaceAll("-", "").replaceAll(".", "")
        if (professionalRG.indexOf(" ") > -1) {
            professionalRGArray = professionalRG?.split(" ")
            professionalRGIssuer = checkStringForNull(professionalRGArray[1])
            professionalRG = checkStringForNull(professionalRGArray[0])
        }
    }

    let professionalTelephones = []
    let professionalTelephone = checkStringForNull(element["Telefone Prof."])
    if (professionalTelephone) {
        if (professionalTelephone.indexOf("/") > -1) {
            professionalTelephones = professionalTelephone.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "").split("/")
        } else {
            professionalTelephones = [...professionalTelephones, professionalTelephone.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "")]
        }
    }

    let profissionalPublicPlace = checkStringForNull(element["Endereço Prof."])
    if (profissionalPublicPlace) {
        let profissionalCEP = checkStringForNull(element["CEP"])

        if (profissionalCEP) {
            profissionalCEP = handleRemoveCEPMask(profissionalCEP)
        }

        let profissionalPublicPlaceArray = []
        let profissionalNumber = ""
        if (profissionalPublicPlace) {
            if (profissionalPublicPlace?.indexOf(", nº") > -1) {
                profissionalPublicPlaceArray = profissionalPublicPlace?.split(", nº")
            } else if (profissionalPublicPlace?.indexOf(",nº") > -1) {
                profissionalPublicPlaceArray = profissionalPublicPlace?.split(",nº")
            }
            if (profissionalPublicPlaceArray?.length > 0) {
                profissionalPublicPlace = profissionalPublicPlaceArray[0]
                profissionalNumber = profissionalPublicPlaceArray[1]
            }
        }

        let profissionalDistrict = checkStringForNull(element["Bairro Prof."])
        let profissionalCounty = checkStringForNull(element["Cidade/UF Prof."])

        professionalAddress = {
            ...professionalAddress,
            cep: profissionalCEP,
            number: profissionalNumber,
            county: profissionalCounty,
            district: profissionalDistrict,
            publicPlace: profissionalPublicPlace,
        }
    }

    professionalPerson = {
        ...professionalPerson,
        rg: professionalRG,
        cpf: professionalCPF,
        address: professionalAddress,
        rgIssuer: professionalRGIssuer,
        telephones: professionalTelephones,
        name: checkStringForNull(element["Nome Prof."]),
    }

    professional = {
        ...professional,
        person: professionalPerson,
        dateInsertUTC: getUTCDate(element),
        title: checkStringForNull(element["Título Prof."]),
        creaNumber: checkStringForNull(element["CREA Prof."]),
        credentialCode: checkStringForNull(element["Cod. Credenciado"]),
        oldData: element,
    }

    return professional
}

export const extrateCompany = (element: ElementFromBase) => {
    let company: Company = defaultCompany
    let address: Address = extratePersonAddress(element)

    let cnpj = checkStringForNull(element["CPF Prop."])

    if (cnpj) {
        cnpj = handleRemoveCNPJMask(cnpj)
    }

    let telephones = []
    let telephone = checkStringForNull(element["Telefone Prop."])

    if (telephone) {
        if (telephone.indexOf("/") > -1) {
            telephones = telephone.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "").split("/")
        } else {
            telephones = [...telephones, telephone.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "")]
        }
    }

    let name = checkStringForNull(element["Nome Prop."])

    company = {
        ...company,
        cnpj: cnpj,
        name: name,
        dateInsertUTC: getUTCDate(element),
        telephones: telephones,
        address: address,
        oldData: element,
    }

    return company
}
export const extrateImmobile = (element: ElementFromBase) => {
    let immobile: Immobile = defaultImmobile
    let immobileAddress: Address = defaultAddress
    {/*
let immobileAddress: Address = extratePersonAddress(element)
*/}

    let areaImmobile = ""
    if (element["Área"]) {
        let areaImmobileString = element["Área"]?.trim() ?? ""
        areaImmobileString = areaImmobileString.replaceAll(".", "").replace(",", ".")
        areaImmobile = areaImmobileString
    }

    let perimeterImmobile = ""
    if (element["Perímetro"]) {
        let perimeterImmobileString = element["Perímetro"]?.trim() ?? ""
        perimeterImmobileString = perimeterImmobileString.replaceAll(".", "").replace(",", ".")
        areaImmobile = perimeterImmobileString
    }

    let name = ""
    if (element["Lote"]) {
        name = element["Lote"]?.trim() ?? ""
    }

    let land = ""
    if (element["Gleba"]) {
        land = element["Gleba"]?.trim() ?? ""
    }

    let county = ""
    if (element["Município/UF"]) {
        county = element["Município/UF"]?.trim() ?? ""
    }

    immobile = {
        ...immobile,
        name: name,
        land: land,
        county: county,
        area: areaImmobile,
        address: immobileAddress,
        perimeter: perimeterImmobile,
        owners: [extratePerson(element)],
        dateInsertUTC: getUTCDate(element),
    }

    return immobile
}