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
    clientCode?: string,
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
    clientCode?: string,
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

export interface ImmobilePoint {
    id?: string,
    description?: string,
    latitude?: string,
    longitude?: string,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    immobile?: any,
}

export interface Immobile {
    id?: string,
    name?: string,
    land?: string,
    area?: string,
    status?: string,
    county?: string,
    perimeter?: string,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    oldData?: any,
    address?: Address,
    owners?: any[],
    points?: any[],
}

export interface Project {
    id?: string,
    title?: string,
    number?: string,
    status?: string,
    dateString?: string,
    date?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    oldData?: any,
    professional?: any,
    clients?: any[],
    services?: Service[],
}

export interface Service {
    id?: string,
    title?: string,
    value?: string,
    status?: string,
    quantity?: string,
    dateString?: string,
    description?: string,
    date?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    project?: any,
    professional?: any,
    serviceStages?: any[],
    servicePayments?: any[],
    immobilesOrigin?: any[],
    immobilesTarget?: any[],
}

export interface ServiceStage {
    id?: string,
    title?: string,
    status?: string,
    dateString?: string,
    description?: string,
    index?: number,
    dateDue?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    service?: any,
    responsible?: any,
    updates?: [],
}

export interface ServicePayment {
    id?: string,
    value?: string,
    dateString?: string,
    description?: string,
    index?: number,
    dateDue?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    service?: any,
}

export interface Update {
    dateString?: string,
    description?: string,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    user?: any,
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
    clientCode: "",
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
    clientCode: "",
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

export const defaultImmobile: Immobile = {
    id: "",
    name: "",
    land: "",
    area: "",
    county: "",
    perimeter: "",
    status: "NORMAL",
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    oldData: {},
    address: defaultAddress,
    owners: [],
    points: [],
}

export const defaultImmobilePoint: ImmobilePoint = {
    id: "",
    latitude: "",
    longitude: "",
    description: "",
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
}

export const defaultProject: Project = {
    id: "",
    title: "",
    number: "",
    dateString: "",
    status: "ORÇAMENTO",
    date: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    oldData: {},
    professional: defaultProfessional,
    clients: [],
}

export const defaultService: Service = {
    id: "",
    title: "",
    value: "0", 
    quantity: "1",
    dateString: "",
    description: "",
    status: "NORMAL",
    date: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    project: defaultProject,
    professional: defaultProfessional,
    serviceStages: [],
    servicePayments: [],
    immobilesOrigin: [],
    immobilesTarget: [], 
}

export const defaultServiceStage: ServiceStage = {
    id: "",
    title: "",
    dateString: "",
    description: "",
    status: "NORMAL",
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    service: defaultService,
    responsible: defaultProfessional,
    updates: [],
}

export const defaultServicePayment: ServicePayment = {
    id: "",
    value: "",
    dateString: "",
    description: "",
    index: -1,
    dateDue: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    service: defaultService,
}