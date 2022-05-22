export interface Person {
    id?: string,
    name?: string,
    cpf?: string,
    rg?: string,
    rgIssuer?: string,
    nationality?: string,
    naturalness?: string,
    maritalStatus?: string,
    profession?: string,
    dateInsertUTC?: number,
    address?: PersonAddress,
    telephones?: string[],
    oldPerson?: object,
}

export interface PersonAddress {
    id?: string,
    publicPlace?: string,
    number?: string,
    district?: string,
    county?: string,
    cep?: string,
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
    lote?: string,
    land?: string,
    county?: string,
    area?: number,
    perimeter?: number,
    person?: any,
    dateInsertUTC?: number,
}

export interface Process {
    id?: string,
    date?: number,
    number?: string,
    client?: any,
    property?: any,
    professional?: any,
}