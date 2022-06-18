export interface Address {
    id?: string,
    cep?: string,
    number?: string,
    county?: string,
    district?: string,
    complement?: string,
    publicPlace?: string,
}

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
    oldData?: any,
    address?: Address,
    telephones?: string[],
}

export interface Company {
    id?: string,
    cnpj?: string,
    name?: string,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    oldData?: any,
    address?: Address,
    owners?: any[],
    telephones?: string[],
}

export interface Professional {
    id?: string,
    title?: string,
    creaNumber?: string,
    credentialCode?: string,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    person?: any,
    oldData?: any,
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
    oldData?: any,
    address?: Address,
    owners?: any[],
}

export interface Project {
    id?: string,
    dateString?: string,
    date?: number,
    number?: string,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    professional?: Professional,
    oldData?: any,
    clients?: any[],
    properties?: any[],
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
    oldData: {},
    telephones: [],
    address: defaultAddress,
}


export const defaultCompany: Company = {
    id: "",
    cnpj: "",
    name: "",
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    oldData: {},
    owners: [],
    telephones: [],
    address: defaultAddress,
}

export const defaultProfessional: Professional = {
    id: "",
    title: "",
    creaNumber: "",
    credentialCode: "",
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    oldData: {},
    person: defaultPerson,
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
    oldData: {},
    owners: [],
    address: defaultAddress,
}

export const defaultProject: Project = {
    id: "",
    number: "",
    dateString: "",
    date: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    clients: [],
    oldData: {},
    properties: [],
    professional: defaultProfessional,
}