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
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            rg: data.rg,
            cpf: data.cpf,
            name: data.name,
            id: snapshot?.id,
            address: data.address,
            rgIssuer: data.rgIssuer,
            profession: data.profession,
            telephones: data.telephones,
            nationality: data.nationality,
            naturalness: data.naturalness,
            maritalStatus: data.maritalStatus,
            dateInsertUTC: data.dateInsertUTC,
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
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id,
            title: data.title,
            person: data.person,
            creaNumber: data.creaNumber,
            dateInsertUTC: data.dateInsertUTC,
            credentialCode: data.credentialCode,
        }
    }
}

export const PropertyConversor = {
    toFirestore(property) {
        return {
            name: property.name,
            land: property.land,
            area: parseFloat(property.area),
            county: property.county,
            owners: property.owners,
            perimeter: parseFloat(property.perimeter),
            dateInsertUTC: property.dateInsertUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            name: data.name,
            land: data.land,
            area: data.area + "",
            id: snapshot?.id,
            county: data.county,
            owners: data.owners,
            perimeter: data.perimeter + "",
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