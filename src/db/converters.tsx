import { defaultAddress, defaultPerson, defaultProfessional, defaultProject } from "../interfaces/objectInterfaces"

export const PersonConversor = {
    toFirestore(data) {
        return {
            rg: data.rg,
            cpf: data.cpf,
            name: data.name,
            address: data.address,
            rgIssuer: data.rgIssuer,
            clientCode: data.clientCode,
            profession: data.profession,
            telephones: data.telephones,
            nationality: data.nationality,
            naturalness: data.naturalness,
            maritalStatus: data.maritalStatus,
            dateInsertUTC: data.dateInsertUTC,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            rg: data.rg ?? "",
            cpf: data.cpf ?? "",
            name: data.name ?? "",
            id: snapshot?.id ?? "",
            rgIssuer: data.rgIssuer ?? "",
            clientCode: data.clientCode ?? "",
            profession: data.profession ?? "",
            nationality: data.nationality ?? "",
            naturalness: data.naturalness ?? "",
            maritalStatus: data.maritalStatus ?? "",
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            address: data.address ?? defaultAddress,
            telephones: data.telephones ?? [],
        }
    }
}

export const ProfessionalConversor = {
    toFirestore(data) {
        return {
            title: data.title,
            person: data.person,
            creaNumber: data.creaNumber,
            dateInsertUTC: data.dateInsertUTC,
            credentialCode: data.credentialCode,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id ?? "",
            title: data.title ?? "",
            creaNumber: data.creaNumber ?? "",
            credentialCode: data.credentialCode ?? "",
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            person: data.person ?? defaultPerson,
        }
    }
}

export const CompanyConversor = {
    toFirestore(data) {
        return {
            name: data.name,
            cnpj: data.cnpj,
            owners: data.owners,
            address: data.address,
            clientCode: data.clientCode,
            telephones: data.telephones,
            dateInsertUTC: data.dateInsertUTC,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            name: data.name ?? "",
            cnpj: data.cnpj ?? "",
            id: snapshot?.id ?? "",
            clientCode: data.clientCode ?? "",
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            address: data.address ?? defaultAddress,
            owners: data.owners ?? [],
            telephones: data.telephones ?? [],
        }
    }
}

export const ImmobileConversor = {
    toFirestore(data) {
        return {
            name: data.name,
            land: data.land,
            area: data.area,
            status: data.status,
            county: data.county,
            owners: data.owners,
            address: data.address,
            perimeter: data.perimeter,
            dateInsertUTC: data.dateInsertUTC,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
            points: data.points,
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
            status: data.status ?? "NORMAL",
            perimeter: data.perimeter ?? "",
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            address: data.address ?? defaultAddress,
            owners: data.owners ?? [],
            points: data.points ?? [],
        }
    }
}

export const ProjectConversor = {
    toFirestore(data) {
        return {
            date: data.date,
            title: data.title,
            number: data.number,
            budget: data.budget,
            status: data.status,
            clients: data.clients,
            professional: data.professional,
            dateInsertUTC: data.dateInsertUTC,
            immobilesOrigin: data.immobilesOrigin,
            immobilesTarget: data.immobilesTarget,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id ?? "",
            title: data.title ?? "",
            number: data.number ?? "",
            status: data.status ?? "NORMAL",
            date: data.date ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            budget: data.budget ?? true,
            professional: data.professional ?? defaultProfessional,
            clients: data.clients ?? [],
            immobilesOrigin: data.immobilesOrigin ?? [],
            immobilesTarget: data.immobilesTarget ?? [],
        }
    }
}

export const ProjectStageConversor = {
    toFirestore(data) {
        return {
            title: data.title,
            index: data.index,
            status: data.status,
            project: data.project,
            updates: data.updates,
            dateDue: data.dateDue,
            finished: data.finished,
            responsible: data.responsible,
            description: data.description,
            dateInsertUTC: data.dateInsertUTC,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id ?? "",
            title: data.title ?? "",
            status: data.status ?? "NORMAL",
            description: data.description ?? "",
            index: data.index ?? 0,
            dateDue: data.dateDue ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            finished: data.finished ?? false,
            project: data.project ?? defaultProject,
            responsible: data.responsible ?? defaultProfessional,
            updates: data.updates ?? [],
        }
    }
}

export const ProjectPaymentConversor = {
    toFirestore(data) {
        return {
            value: data.value,
            payed: data.payed,
            index: data.index,
            project: data.project,
            dateDue: data.dateDue,
            description: data.description,
            dateInsertUTC: data.dateInsertUTC,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id ?? "",
            value: data.value ?? "",
            description: data.description ?? "",
            index: data.index ?? 0,
            dateDue: data.dateDue ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            payed: data.payed ?? false,
            project: data.project ?? defaultProject,
        }
    }
}