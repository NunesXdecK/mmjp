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

export interface User {
    id?: string,
    email?: string,
    username?: string,
    password?: string,
    passwordConfirm?: string,
    office?: "visitante" | "secretaria" | "projetista" | "gerente" | "administrador",
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    isBlocked?: boolean,
    person?: any,
}

export interface LoginToken {
    id?: string,
    token?: string,
    validationDue?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    isBlocked?: boolean,
    user?: any,
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
    county?: string,
    process?: string,
    comarca?: string,
    perimeter?: string,
    ccirNumber?: string,
    comarcaCode?: string,
    registration?: string,
    status?: "NORMAL" | "DESMEMBRADO" | "UNIFICADO",
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    oldData?: any,
    address?: Address,
    owners?: any[],
    points?: any[],
}

export interface Budget {
    id?: string,
    title?: string,
    dateString?: string,
    status?: "ORÇAMENTO" | "ARQUIVADO" | "FINALIZADO",
    date?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    clients?: (Person | Company)[],
    services?: BudgetService[],
    payments?: BudgetPayment[],
}

export interface BudgetService {
    title?: string,
    value?: string,
    total?: string,
    quantity?: string,
    index?: number,
}

export interface BudgetPayment {
    value?: string,
    dateString?: string,
    description?: string,
    index?: number,
    dateDue?: number,
}

export interface Project {
    id?: string,
    title?: string,
    number?: string,
    dateString?: string,
    status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO",
    date?: number,
    priority?: number,
    priorityView?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    oldData?: any,
    clients?: any[],
    services?: Service[],
}

export interface Service {
    id?: string,
    title?: string,
    value?: string,
    total?: string,
    quantity?: string,
    dateString?: string,
    description?: string,
    status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO" | "PENDENTE",
    date?: number,
    index?: number,
    priority?: number,
    priorityView?: number,
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
    dateString?: string,
    description?: string,
    status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO" | "PENDENTE",
    index?: number,
    dateDue?: number,
    priority?: number,
    priorityView?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    service?: any,
    responsible?: any,
}

export interface ServicePayment {
    id?: string,
    value?: string,
    dateString?: string,
    description?: string,
    status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO" | "PENDENTE",
    index?: number,
    dateDue?: number,
    priority?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    service?: any,
}

export interface SubjectMessage {
    id?: string,
    text?: string,
    referenceId?: string,
    referenceBase?: string,
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

export const defaultLoginToken: LoginToken = {
    id: "",
    token: "",
    validationDue: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    isBlocked: false,
    user: {},
}

export const defaultUser: User = {
    id: "",
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    office: "visitante",
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    isBlocked: true,
    person: {},
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
    process: "",
    comarca: "",
    perimeter: "",
    ccirNumber: "",
    comarcaCode: "",
    registration: "",
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

export const defaultBudget: Budget = {
    id: "",
    title: "",
    dateString: "",
    status: "ORÇAMENTO",
    date: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    clients: [],
    services: [],
    payments: [],
}

export const defaultBudgetService: BudgetService = {
    title: "",
    value: "0",
    total: "0",
    quantity: "1",
    index: -1,
}

export const defaultBudgetPayment: BudgetPayment = {
    value: "0",
    dateString: "",
    description: "",
    index: -1,
    dateDue: 0,
}

export const defaultProject: Project = {
    id: "",
    title: "",
    number: "",
    dateString: "",
    status: "ORÇAMENTO",
    date: 0,
    priority: 0,
    priorityView: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    oldData: {},
    clients: [],
}

export const defaultService: Service = {
    id: "",
    title: "",
    value: "0",
    total: "0",
    quantity: "1",
    dateString: "",
    description: "",
    status: "ORÇAMENTO",
    date: 0,
    index: -1,
    priority: 0,
    priorityView: 0,
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
    status: "ORÇAMENTO",
    index: -1,
    priority: 0,
    priorityView: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    service: defaultService,
    responsible: defaultProfessional,
}

export const defaultServicePayment: ServicePayment = {
    id: "",
    value: "0",
    dateString: "",
    description: "",
    status: "ORÇAMENTO",
    index: -1,
    dateDue: 0,
    priority: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    service: defaultService,
}

export const defaultSubjectMessage: SubjectMessage = {
    id: "",
    text: "",
    referenceId: "",
    referenceBase: "",
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    user: defaultUser,
}