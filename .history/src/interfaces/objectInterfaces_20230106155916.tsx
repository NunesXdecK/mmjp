export type ImmobileStatus = "NORMAL" | "DESMEMBRADO" | "UNIFICADO" | string
export type BudgetStatus = "ORÇAMENTO" | "VENCIDO" | "NEGOCIANDO" | "REJEITADO" | "APROVADO" | string
export type ProjectStatus = "PARADO" | "EM ANDAMENTO" | "PENDENTE" | "FINALIZADO" | "ARQUIVADO" | string
export type ServiceStatus = "PARADO" | "EM ANDAMENTO" | "PENDENTE" | "FINALIZADO" | string
export type ServiceStageStatus = "PARADO" | "EM ANDAMENTO" | "PENDENTE" | "FINALIZADO" | string
export type PaymentStatus = "EM ABERTO" | "ATRASADO" | "PAGO" | string
export type UserOffice = "visitante" | "secretaria" | "projetista" | "gerente" | "administrador" | string
export type TelephoneType = "comercial" | "pessoal" | "whatsapp" | "outro" | string

export interface Telephone {
    id?: number,
    personId?: number,
    companyId?: number,
    value?: string,
    type?: TelephoneType,
}

export interface Address {
    id?: number,
    cep?: string,
    number?: string,
    county?: string,
    district?: string,
    complement?: string,
    publicPlace?: string,
}

export interface Person {
    id?: number,
    clientCode?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    rg?: string,
    cpf?: string,
    name?: string,
    rgIssuer?: string,
    profession?: string,
    nationality?: string,
    naturalness?: string,
    description?: string,
    maritalStatus?: string,
    oldData?: any,
    address?: Address,
    telephones?: Telephone[],
}

export interface Company {
    cnpj?: string,
    name?: string,
    description?: string,
    id?: number,
    personId?: number,
    clientCode?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    oldData?: any,
    address?: Address,
    owners?: any[],
    telephones?: Telephone[],
}

export interface User {
    id?: number,
    email?: string,
    username?: string,
    password?: string,
    description?: string,
    passwordConfirm?: string,
    office?: UserOffice,
    personId?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    isBlocked?: boolean,
    person?: any,
}

export interface LoginToken {
    token?: string,
    validationDue?: string,
    id?: number,
    userId?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    isBlocked?: boolean,
    user?: any,
}

export interface Professional {
    title?: string,
    creaNumber?: string,
    description?: string,
    credentialCode?: string,
    id?: number,
    personId?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    person?: any,
    oldData?: any,
}

export interface ImmobilePoint {
    description?: string,
    pointId?: string,
    storedStatus?: string,
    epoch?: string,
    id?: number,
    latitudeX?: string,
    longitudeY?: string,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    immobile?: any,
}

export interface Immobile {
    name?: string,
    land?: string,
    area?: string,
    county?: string,
    process?: string,
    comarca?: string,
    perimeter?: string,
    ccirNumber?: string,
    description?: string,
    comarcaCode?: string,
    registration?: string,
    id?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    status?: ImmobileStatus,
    address?: Address,
    oldData?: any,
    owners?: any[],
    points?: any[],
    immobileOwner?: any[],
    immobilePoint?: any[],
}

export interface Budget {
    id?: string,
    title?: string,
    dateString?: string,
    status?: BudgetStatus,
    dateDue?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    services?: BudgetService[],
    payments?: BudgetPayment[],
    clients?: (Person | Company)[],
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
    title?: string,
    dateString?: string,
    index?: number,
    dateDue?: number,
}

export interface Project {
    id?: string,
    title?: string,
    number?: string,
    dateString?: string,
    description?: string,
    dateDue?: number,
    priority?: number,
    priorityView?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    budget?: Budget,
    status?: ProjectStatus,
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
    dateDue?: number,
    index?: number,
    priority?: number,
    priorityView?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    status?: ServiceStatus,
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
    index?: number,
    dateDue?: number,
    priority?: number,
    priorityView?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    status?: ServiceStageStatus,
    service?: any,
    responsible?: any,
}

export interface Payment {
    id?: string,
    value?: string,
    title?: string,
    dateString?: string,
    description?: string,
    index?: number,
    dateDue?: number,
    priority?: number,
    dateInsertUTC?: number,
    dateLastUpdateUTC?: number,
    status?: PaymentStatus,
    project?: any,
}

export interface ServicePayment {
    id?: string,
    value?: string,
    dateString?: string,
    description?: string,
    status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO" | "PENDENTE" | string,
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

export const defaultTelephone: Telephone = {
    id: 0,
    personId: 0,
    companyId: 0,
    value: "",
    type: "outro",
}

export const defaultAddress: Address = {
    id: 0,
    cep: "",
    number: "",
    county: "",
    district: "",
    complement: "",
    publicPlace: "",
}

export const defaultPerson: Person = {
    rg: "",
    cpf: "",
    name: "",
    rgIssuer: "",
    profession: "",
    description: "",
    nationality: "",
    naturalness: "",
    maritalStatus: "",
    id: 0,
    clientCode: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    oldData: {},
    telephones: [],
    address: defaultAddress,
}


export const defaultCompany: Company = {
    cnpj: "",
    name: "",
    description: "",
    id: 0,
    personId: 0,
    clientCode: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    oldData: {},
    owners: [],
    telephones: [],
    address: defaultAddress,
}

export const defaultUser: User = {
    id: 0,
    email: "",
    username: "",
    password: "",
    description: "",
    passwordConfirm: "",
    office: "visitante",
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    isBlocked: true,
    person: {},
}

export const defaultLoginToken: LoginToken = {
    token: "",
    validationDue: "0",
    id: 0,
    userId: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    isBlocked: false,
    user: defaultUser,
}

export const defaultProfessional: Professional = {
    title: "",
    creaNumber: "",
    description: "",
    credentialCode: "",
    id: 0,
    personId: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    oldData: {},
    person: defaultPerson,
}

export const defaultImmobile: Immobile = {
    name: "",
    land: "",
    area: "",
    county: "",
    process: "",
    comarca: "",
    perimeter: "",
    ccirNumber: "",
    description: "",
    comarcaCode: "",
    registration: "",
    status: "NORMAL",
    id: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    oldData: {},
    address: defaultAddress,
    owners: [],
    points: [],
    immobileOwner: [],
    immobilePoint: [],
}

export const defaultImmobilePoint: ImmobilePoint = {
    id: 0,
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
    dateDue: 0,
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
    title: "",
    dateString: "",
    index: -1,
    dateDue: 0,
}

export const defaultProject: Project = {
    id: "",
    title: "",
    number: "",
    dateString: "",
    description: "",
    status: "PARADO",
    dateDue: 0,
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
    status: "PARADO",
    dateDue: 0,
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
    status: "PARADO",
    index: -1,
    priority: 0,
    priorityView: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    service: defaultService,
    responsible: defaultProfessional,
}

export const defaultPayment: Payment = {
    id: "",
    title: "",
    value: "0",
    dateString: "",
    description: "",
    status: "EM ABERTO",
    index: -1,
    dateDue: 0,
    priority: 0,
    dateInsertUTC: 0,
    dateLastUpdateUTC: 0,
    project: defaultProject,
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