import { defaultAddress, defaultPerson } from "../interfaces/objectInterfaces"

export const PersonConversor = {
    toFirestore(person) {
        return {
            rg: person.rg,
            cpf: person.cpf,
            name: person.name,
            address: person.address,
            rgIssuer: person.rgIssuer,
            profession: person.profession,
            telephones: person.telephones,
            nationality: person.nationality,
            naturalness: person.naturalness,
            maritalStatus: person.maritalStatus,
            dateInsertUTC: person.dateInsertUTC,
            dateLastUpdateUTC: person.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            rg: data.rg ?? "",
            cpf: data.cpf ?? "",
            name: data.name ?? "",
            id: snapshot?.id ?? "",
            address: data.address ?? defaultAddress,
            rgIssuer: data.rgIssuer ?? "",
            profession: data.profession ?? "",
            telephones: data.telephones ?? [],
            nationality: data.nationality ?? "",
            naturalness: data.naturalness ?? "",
            maritalStatus: data.maritalStatus ?? "",
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
        }
    }
}

export const ProfessionalConversor = {
    toFirestore(professional) {
        return {
            title: professional.title,
            person: professional.person,
            creaNumber: professional.creaNumber,
            dateInsertUTC: professional.dateInsertUTC,
            credentialCode: professional.credentialCode,
            dateLastUpdateUTC: professional.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id ?? "",
            title: data.title ?? "",
            person: data.person ?? defaultPerson,
            creaNumber: data.creaNumber ?? "",
            dateInsertUTC: data.dateInsertUTC ?? 0,
            credentialCode: data.credentialCode ?? "",
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
        }
    }
}

export const CompanyConversor = {
    toFirestore(company) {
        return {
            name: company.name,
            cnpj: company.cnpj,
            owners: company.owners,
            address: company.address,
            telephones: company.telephones,
            dateInsertUTC: company.dateInsertUTC,
            dateLastUpdateUTC: company.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            name: data.name ?? "",
            cnpj: data.cnpj ?? "",
            id: snapshot?.id ?? "",
            address: data.address ?? defaultAddress,
            owners: data.owners ?? [],
            telephones: data.telephones ?? [],
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
        }
    }
}

export const PropertyConversor = {
    toFirestore(property) {
        return {
            name: property.name,
            land: property.land,
            area: property.area,
            county: property.county,
            owners: property.owners,
            address: property.address,
            perimeter: property.perimeter,
            dateInsertUTC: property.dateInsertUTC,
            dateLastUpdateUTC: property.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            name: data.name ?? "",
            land: data.land ?? "",
            area: data.area ?? "",
            id: snapshot?.id ?? "",
            county: data.county ?? "",
            owners: data.owners ?? [],
            address: data.address ?? defaultAddress,
            perimeter: data.perimeter ?? "",
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
        }
    }
}

export const ProcessConversor = {
    toFirestore(process) {
        return {
            date: process.date,
            number: process.number,
            client: process.client,
            property: process.property,
            professional: process.professional,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            date: data.date,
            id: snapshot?.id,
            number: data.number,
            client: data.client,
            property: data.property,
            professional: data.professional,
        }
    }
}