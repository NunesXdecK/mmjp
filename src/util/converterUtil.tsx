import { defaultPerson, defaultProperty, Person, PersonAddress, Property } from "../interfaces/objectInterfaces"
import { handleMaskCPF, handleMaskTelephone, handleMountMask, handleRemoveCEPMask, handleRemoveCPFMask, handleRemoveTelephoneMask } from "./maskUtil"

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

const checkStringForNull = (string) => {
    return string?.trim() ?? ""
}

export const handlePreparePersonForShow = (person: Person) => {
    let telephonesWithNoMask = []
    person.telephones.map((element, index) => {
        telephonesWithNoMask = [...telephonesWithNoMask, handleMaskTelephone(element)]
    })

    person = {
        ...person
        , cpf: handleMaskCPF(person.cpf)
        , address: { ...person.address, cep: handleMountMask(handleRemoveCEPMask(person.address.cep), "99999-999") }
        , telephones: telephonesWithNoMask
    }
    return person
}

export const handlePreparePersonForDB = (person: Person) => {
    let telephonesWithNoMask = []
    person.telephones.map((element, index) => {
        telephonesWithNoMask = [...telephonesWithNoMask, handleRemoveTelephoneMask(element)]
    })

    if (person.oldData) {
        delete person.oldData
    }

    person = {
        ...person
        , cpf: handleRemoveCPFMask(person.cpf)
        , address: { ...person.address, cep: handleRemoveCEPMask(person.address.cep) }
        , telephones: telephonesWithNoMask
    }
    return person
}

export const extratePerson = (element: ElementFromBase) => {
    let person: Person = defaultPerson

    let personAddress: PersonAddress = person.address

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

    let personCPF = checkStringForNull(element["CPF Prop."])

    if (personCPF) {
        personCPF = personCPF.replaceAll("-", "").replaceAll(".", "")
    }

    let personRG = checkStringForNull(element["RG Prop."])
    let personRGIssuer = ""

    if (personRG) {
        let personRGArray = personRG?.replaceAll("-", "").replaceAll(".", "")
        if (personRG.indexOf(" ") > -1) {
            personRGArray = personRG?.split(" ")
            personRGIssuer = checkStringForNull(personRGArray[1])
            personRG = checkStringForNull(personRGArray[0])
        }
    }

    let personTelephones = []
    let personTelephone = checkStringForNull(element["Telefone Prop."])

    if (personTelephone) {
        if (personTelephone.indexOf("/") > -1) {
            personTelephones = personTelephone.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "").split("/")
        } else {
            personTelephones = [...personTelephones, personTelephone.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "")]
        }
    }

    if (element["Logradouro End."]) {
        let personCEP = checkStringForNull(element["CEP End."])

        if (personCEP) {
            personCEP = handleRemoveCEPMask(personCEP)
        }

        let publicPlace = checkStringForNull(element["Logradouro End."])
        let number = checkStringForNull(element["Numero End."])
        let district = checkStringForNull(element["Bairro End."])
        let county = checkStringForNull(element["Município/UF End."])

        personAddress = {
            ...personAddress,
            publicPlace: publicPlace,
            number: number,
            district: district,
            county: county,
            cep: personCEP,
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
        cpf: personCPF,
        rg: personRG,
        rgIssuer: personRGIssuer,
        nationality: nationality,
        naturalness: naturalness,
        maritalStatus: maritalStatus,
        profession: profession,
        dateInsertUTC: dateCadUTC,
        telephones: personTelephones,
        address: personAddress,
        oldData: element,
    }

    return person
}

export const extrateProperty = (element: ElementFromBase) => {
    let property: Property = defaultProperty

    let areaProperty = ""
    if (element["Área"]) {
        let areaPropertyString = element["Área"]?.trim() ?? ""
        areaPropertyString = areaPropertyString.replaceAll(".", "").replace(",", ".")
        areaProperty = areaPropertyString
    }

    let perimeterProperty = ""
    if (element["Perímetro"]) {
        let perimeterPropertyString = element["Perímetro"]?.trim() ?? ""
        perimeterPropertyString = perimeterPropertyString.replaceAll(".", "").replace(",", ".")
        areaProperty = perimeterPropertyString
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

    property = {
        ...property,
        name: name,
        area: areaProperty,
        perimeter: perimeterProperty,
        land: land,
        county: county,
        owners: [extratePerson(element)],
    }

    return property
}