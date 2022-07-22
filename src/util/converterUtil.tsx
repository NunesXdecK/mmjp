import { handleNewDateToUTC, handleUTCToDateShow } from "./dateUtils"
import { defaultPerson, defaultAddress, defaultProfessional, defaultImmobile, Person, Address, Professional, Immobile, Company, defaultCompany, Project, ProjectStage, ProjectPayment } from "../interfaces/objectInterfaces"
import { handleMaskCNPJ, handleMaskCPF, handleMaskTelephone, handleMountMask, handleRemoveCEPMask, handleRemoveCNPJMask, handleRemoveCPFMask, handleRemoveDateMask, handleRemoveTelephoneMask } from "./maskUtil"

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
    person?.telephones?.map((element, index) => {
        telephonesWithMask = [...telephonesWithMask, handleMaskTelephone(element)]
    })

    person = {
        ...person
        , cpf: handleMaskCPF(person?.cpf)
        , telephones: telephonesWithMask
    }
    return person
}

export const handlePreparePersonForDB = (person: Person) => {
    if (person.address && person.address?.cep) {
        person = { ...person, address: { ...person.address, cep: handleRemoveCEPMask(person.address.cep) } }
    }

    if (person.dateInsertUTC === 0) {
        person = { ...person, dateInsertUTC: handleNewDateToUTC() }
    }

    if (person.id !== "") {
        person = { ...person, dateLastUpdateUTC: handleNewDateToUTC() }
    }

    let telephonesWithNoMask = []
    person.telephones?.map((element, index) => {
        telephonesWithNoMask = [...telephonesWithNoMask, handleRemoveTelephoneMask(element)]
    })

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
    company.telephones?.map((element, index) => {
        telephonesWithMask = [...telephonesWithMask, handleMaskTelephone(element)]
    })

    let personsWithMask = []
    company.owners?.map((element, index) => {
        personsWithMask = [...personsWithMask, handlePreparePersonForShow(element)]
    })

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

    if (company.id !== "") {
        company = { ...company, dateLastUpdateUTC: handleNewDateToUTC() }
    }

    let telephonesWithNoMask = []
    company.telephones?.map((element, index) => {
        telephonesWithNoMask = [...telephonesWithNoMask, handleRemoveTelephoneMask(element)]
    })

    if (company.oldData) {
        delete company.oldData
    }

    company = {
        ...company
        , cnpj: handleRemoveCNPJMask(company.cnpj)
        , telephones: telephonesWithNoMask
    }
    return company
}

export const handlePrepareProfessionalForDB = (professional: Professional) => {
    if (professional.dateInsertUTC === 0) {
        professional = { ...professional, dateInsertUTC: handleNewDateToUTC() }
    }

    if (professional.id !== "") {
        professional = { ...professional, dateLastUpdateUTC: handleNewDateToUTC() }
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

    if (immobile.id !== "") {
        immobile = { ...immobile, dateLastUpdateUTC: handleNewDateToUTC() }
    }

    if (immobile.oldData) {
        delete immobile.oldData
    }

    immobile = {
        ...immobile
        , address: { ...immobile.address, cep: handleRemoveCEPMask(immobile.address.cep) }
    }
    return immobile
}

export const handlePrepareProjectForDB = (project: Project) => {
    if (project.dateInsertUTC === 0) {
        project = { ...project, dateInsertUTC: handleNewDateToUTC() }
    }

    if (project.id !== "") {
        project = { ...project, dateLastUpdateUTC: handleNewDateToUTC() }
    }

    if (project.dateString?.length === 10) {
        const dateText = handleRemoveDateMask(project.dateString)
        if (dateText.length === 8) {
            const day = dateText.substring(0, 2)
            const month = dateText.substring(2, 4)
            const year = dateText.substring(4, dateText.length)
            const utcString = new Date(month + " " + day + " " + year).toUTCString()
            project = { ...project, date: Date.parse(utcString) }
        }
    }

    if (project.date === 0) {
        project = { ...project, date: handleNewDateToUTC() }
    }

    let projectPayments = handlePrepareProjectPaymentStageForDB(project, project.projectPayments)
    let projectStages = handlePrepareProjectPaymentStageForDB(project, project.projectPayments)

    if (project.dateString) {
        delete project.dateString
    }

    if (project.oldData) {
        delete project.oldData
    }

    project = {
        ...project,
        projectPayments: projectPayments,
        projectStages: projectStages,
    }
    return project
}

export const handlePrepareProjectPaymentStageForDB = (project: Project, list: (ProjectPayment | ProjectStage)[]) => {
    let elements = []
    list.map((element: (ProjectPayment | ProjectStage), index) => {
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
        elements = [...elements, { ...element, project: project, description: element.description?.trim(), index: index }]
    })
    return elements
}

export const handlePrepareProjectPaymentStageForShow = (list: (ProjectPayment | ProjectStage)[]) => {
    let localList = []
    list.map((element: (ProjectPayment | ProjectStage), index) => {
        localList = [...localList, { ...element, dateString: handleUTCToDateShow(element.dateDue.toString()) }]
    })
    return localList
}

export const handlePrepareProjectStageForDB = (projectStage: ProjectStage) => {
    if (projectStage.dateInsertUTC === 0) {
        projectStage = { ...projectStage, dateInsertUTC: handleNewDateToUTC() }
    }

    if (projectStage.id !== "") {
        projectStage = { ...projectStage, dateLastUpdateUTC: handleNewDateToUTC() }
    }

    projectStage = {
        ...projectStage
    }
    return projectStage
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