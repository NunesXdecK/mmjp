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
    dateLastUpdateUTC?: number,
    telephones?: string[],
    address?: Address,
    oldData?: object,
}

export interface Address {
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
    dateLastUpdateUTC?: number,
    person?: any,
    oldData?: object,
}

export interface Property {
    id?: string,
    name?: string,
    land?: string,
    area?: string,
    county?: string,
    perimeter?: string,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    owners?: any[],
    address?: Address,
    oldData?: object,
}

export interface Process {
    id?: string,
    number?: string,
    date?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    property?: Property,
    professional?: Professional,
    client?: any,
    oldData?: object,
}

export const defaultAddress: Address = {
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
    dateLastUpdateUTC: 0,
    telephones: [],
    address: defaultAddress,
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
    dateLastUpdateUTC: 0,
    owners: [],
    address: defaultAddress,
    oldData: {},
}

export const defaultProfessional: Professional = {
    id: "",
    title: "",
    creaNumber: "",
    credentialCode: "",
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    person: defaultPerson,
    oldData: {},
}