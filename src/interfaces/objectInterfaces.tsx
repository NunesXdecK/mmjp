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
    oldPerson?: object,
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
    lote?: string,
    land?: string,
    county?: string,
    area?: number,
    perimeter?: number,
    dateInsertUTC?: number,
    owners?: any[],
}

export interface Process {
    id?: string,
    number?: string,
    date?: number,
    client?: any,
    property?: any,
    professional?: any,
}