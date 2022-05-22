import { Person, PersonAddress } from "../interfaces/objectInterfaces"

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

export const extratePerson = (element: ElementFromBase) => {
    let personAddress: PersonAddress = {
        publicPlace: "",
        number: "",
        district: "",
        county: "",
        cep: "",
    }

    let person: Person = {
        name: "",
        cpf: "",
        rg: "",
        rgIssuer: "",
        nationality: "",
        naturalness: "",
        maritalStatus: "",
        profession: "",
        telephones: [],
        address: personAddress,
    }

    let dateCadUTC = 0
    let dateCad = checkStringForNull(element["Data Simples"])
    if (dateCad) {
        let dateCadArray = dateCad.split("/")
        let day = parseInt(dateCadArray[0])
        let month = parseInt(dateCadArray[1])
        let year = parseInt(dateCadArray[2])
        let dateEXT = year + "-" + month + "-" + day + " 00:00:00"
        dateCadUTC = Date.parse(dateEXT)
    }

    let personCPF = checkStringForNull(element["CPF Prop."])

    if (personCPF) {
        personCPF = personCPF.replaceAll("-", "").replaceAll(".", "")
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
                personCEP = personCEP.replaceAll(".", "").replaceAll("-", "")
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
        }
    }
    return person
}

const checkStringForNull = (string) => {
    return string?.trim() ?? ""
}