export interface Person {
    id?: string,
    rg?: string,
    cpf?: string,
    name?: string,
    rgIssuer?: string,
    profession?: string,
    nationality?: string,
    naturalness?: string,
    maritalStatus?: string,
    dateInsertUTC?: number,
    telephones?: string[],
    address?: PersonAddress,
    oldData?: object,
}

export interface PersonAddress {
    id?: string,
    cep?: string,
    number?: string,
    county?: string,
    district?: string,
    complement?: string,
    publicPlace?: string,
}

export interface Professional {
    id?: string,
    title?: string,
    creaNumber?: string,
    credentialCode?: string,
    dateInsertUTC?: number,
    person?: any,
}

export interface Property {
    id?: string,
    name?: string,
    land?: string,
    area?: string,
    county?: string,
    perimeter?: string,
    dateInsertUTC?: number,
    owners?: any[],
    oldData?: object,
}

export interface Process {
    id?: string,
    number?: string,
    date?: number,
    dateInsertUTC?: number,
    client?: Person,
    property?: Property,
    professional?: Professional,
}

export const defaultPersonAddress: PersonAddress = {
    cep: "",
    number: "",
    county: "",
    district: "",
    complement: "",
    publicPlace: "",
}

export const defaultPerson: Person = {
    id: "",
    rg: "",
    cpf: "",
    name: "",
    rgIssuer: "",
    profession: "",
    nationality: "",
    naturalness: "",
    maritalStatus: "",
    dateInsertUTC: 0,
    telephones: [],
    address: defaultPersonAddress,
    oldData: {},
}

export const defaultProperty: Property = {
    id: "",
    name: "",
    land: "",
    county: "",
    area: "",
    perimeter: "",
    dateInsertUTC: 0,
    owners: [],
    oldData: {},
}