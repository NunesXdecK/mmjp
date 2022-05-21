export const PersonConversor = {
    toFirestore(person) {
        return {
            name: person.name,
            cpf: person.cpf,
            rg: person.rg,
            rgIssuer: person.rgIssuer,
            nationality: person.nationality,
            naturalness: person.naturalness,
            maritalStatus: person.maritalStatus,
            dateInsertUTC: person.dateInsertUTC,
            profession: person.profession,
            telephones: person.telephones,
            address: person.address,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id,
            name: data.name,
            cpf: data.cpf,
            rg: data.rg,
            rgIssuer: data.rgIssuer,
            nationality: data.nationality,
            naturalness: data.naturalness,
            maritalStatus: data.maritalStatus,
            dateInsertUTC: data.dateInsertUTC,
            profession: data.profession,
            telephones: data.telephones,
            address: data.address,
        }
    }
}

export const ProfessionalConversor = {
    toFirestore(professional) {
        return {
            title: professional.title,
            creaNumber: professional.creaNumber,
            credentialCode: professional.credentialCode,
            person: professional.person,
            dateInsertUTC: professional.dateInsertUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id,
            title: data.title,
            creaNumber: data.creaNumber,
            credentialCode: data.credentialCode,
            person: data.person,
            dateInsertUTC: data.dateInsertUTC,
        }
    }
}

export const PropertyConversor = {
    toFirestore(property) {
        return {
            lote: property.lote,
            land: property.land,
            county: property.county,
            area: property.area,
            perimeter: property.perimeter,
            person: property.person,
            dateInsertUTC: property.dateInsertUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id,
            lote: data.lote,
            land: data.land,
            county: data.county,
            area: data.area,
            perimeter: data.perimeter,
            person: data.person,
            dateInsertUTC: data.dateInsertUTC,
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
            id: snapshot?.id,
            date: data.date,
            number: data.number,
            client: data.client,
            property: data.property,
            professional: data.professional,
        }
    }
}