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
    oldData?: any,
    person?: Person,
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
    isBlocked?: boolean,
    person?: any,
}

export interface LoginToken {
    token?: string,
    validationDue?: string,
    id?: number,
    userId?: number,
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
    person?: any,
    oldData?: any,
}

export interface ImmobilePoint {
    type?: string,
    epoch?: string,
    pointId?: string,
    gnssType?: string,
    eastingX?: string,
    northingY?: string,
    frequency?: string,
    description?: string,
    posnQuality?: string,
    storedStatus?: string,
    solutionType?: string,
    elipseHeightZ?: string,
    heightQuality?: string,
    ambiguityStatus?: string,
    posnHeightQuality?: string,
    id?: number,
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
    status?: ImmobileStatus,
    address?: Address,
    oldData?: any,
    owners?: any[],
    points?: any[],
    immobileOwner?: any[],
    immobilePoint?: any[],
}

export interface Budget {
    title?: string,
    dateDue?: string,
    description?: string,
    status?: BudgetStatus,
    id?: number,
    services?: BudgetService[],
    payments?: BudgetPayment[],
    clients?: (Person | Company)[],
}

export interface BudgetService {
    title?: string,
    value?: string,
    total?: string,
    quantity?: string,
    id?: number,
    index?: number,
}

export interface BudgetPayment {
    value?: string,
    title?: string,
    dateDue?: string,
    id?: number,
    index?: number,
}

export interface Project {
    title?: string,
    number?: string,
    dateDue?: string,
    description?: string,
    id?: number,
    priority?: number,
    priorityView?: number,
    budget?: Budget,
    status?: ProjectStatus,
    oldData?: any,
    clients?: any[],
    services?: Service[],
    payments?: Payment[],
}

export interface Service {
    title?: string,
    value?: string,
    total?: string,
    dateDue?: string,
    quantity?: string,
    dateString?: string,
    description?: string,
    id?: number,
    index?: number,
    priority?: number,
    projectId?: number,
    priorityView?: number,
    status?: ServiceStatus,
    project?: any,
    professional?: any,
    serviceStages?: any[],
    servicePayments?: any[],
    immobilesOrigin?: any[],
    immobilesTarget?: any[],
}

export interface ServiceStage {
    title?: string,
    dateDue?: string,
    description?: string,
    id?: number,
    index?: number,
    priority?: number,
    serviceId?: number,
    priorityView?: number,
    status?: ServiceStageStatus,
    service?: any,
    responsible?: any,
}

export interface Payment {
    value?: string,
    title?: string,
    dateDue?: string,
    description?: string,
    id?: number,
    index?: number,
    priority?: number,
    projectId?: number,
    project?: Project,
    status?: PaymentStatus,
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
    isBlocked: true,
    person: {},
}

export const defaultLoginToken: LoginToken = {
    token: "",
    validationDue: "0",
    id: 0,
    userId: 0,
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
    oldData: {},
    address: defaultAddress,
    owners: [],
    points: [],
    immobileOwner: [],
    immobilePoint: [],
}

export const defaultImmobilePoint: ImmobilePoint = {
    type: "",
    epoch: "",
    pointId: "",
    eastingX: "",
    gnssType: "",
    northingY: "",
    frequency: "",
    description: "",
    posnQuality: "",
    storedStatus: "",
    solutionType: "",
    elipseHeightZ: "",
    heightQuality: "",
    ambiguityStatus: "",
    posnHeightQuality: "",
    id: 0,
    immobile: {},
}

export const defaultBudget: Budget = {
    id: 0,
    title: "",
    dateDue: "",
    description: "",
    status: "ORÇAMENTO",
    clients: [],
    services: [],
    payments: [],
}

export const defaultBudgetService: BudgetService = {
    title: "",
    value: "0",
    total: "0",
    quantity: "1",
    id: 0,
    index: -1,
}

export const defaultBudgetPayment: BudgetPayment = {
    value: "0",
    title: "",
    dateDue: "",
    id: 0,
    index: -1,
}

export const defaultProject: Project = {
    title: "",
    number: "",
    dateDue: "",
    description: "",
    status: "PARADO",
    id: 0,
    priority: 0,
    priorityView: 0,
    oldData: {},
    clients: [],
}

export const defaultService: Service = {
    title: "",
    value: "0",
    total: "0",
    dateDue: "",
    quantity: "1",
    dateString: "",
    description: "",
    status: "PARADO",
    id: 0,
    index: -1,
    priority: 0,
    priorityView: 0,
    project: defaultProject,
    professional: defaultProfessional,
    serviceStages: [],
    servicePayments: [],
    immobilesOrigin: [],
    immobilesTarget: [],
}

export const defaultServiceStage: ServiceStage = {
    title: "",
    dateDue: "",
    description: "",
    status: "PARADO",
    id: 0,
    index: -1,
    priority: 0,
    priorityView: 0,
    service: defaultService,
    responsible: defaultProfessional,
}

export const defaultPayment: Payment = {
    title: "",
    value: "0",
    dateDue: "",
    description: "",
    status: "EM ABERTO",
    index: -1,
    id: 0,
    priority: 0,
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