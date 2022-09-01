import { defaultAddress, defaultPerson, defaultProfessional, defaultProject, defaultService } from "../interfaces/objectInterfaces"

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
            points: data.points,
            address: data.address,
            comarca: data.comarca,
            process: data.process,
            perimeter: data.perimeter,
            ccirNumber: data.ccirNumber,
            comarcaCode: data.comarcaCode,
            registration: data.registration,
            dateInsertUTC: data.dateInsertUTC,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
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
            comarca: data.comarca ?? "",
            process: data.process ?? "",
            status: data.status ?? "NORMAL",
            perimeter: data.perimeter ?? "",
            ccirNumber: data.ccirNumber ?? "",
            comarcaCode: data.comarcaCode ?? "",
            registration: data.registration ?? "",
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
            status: data.status,
            clients: data.clients,
            dateInsertUTC: data.dateInsertUTC,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id ?? "",
            title: data.title ?? "",
            number: data.number ?? "",
            status: data.status ?? "ORÇAMENTO",
            date: data.date ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            clients: data.clients ?? [],
        }
    }
}

export const ServiceConversor = {
    toFirestore(data) {
        return {
            date: data.date,
            title: data.title,
            value: data.value,
            total: data.total,
            index: data.index,
            status: data.status,
            project: data.project,
            quantity: data.quantity,
            description: data.description,
            responsible: data.responsible,
            dateInsertUTC: data.dateInsertUTC,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
            immobilesOrigin: data.immobilesOrigin,
            immobilesTarget: data.immobilesTarget,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id ?? "",
            title: data.title ?? "",
            value: data.value ?? "",
            total: data.total ?? "",
            quantity: data.quantity ?? "1",
            status: data.status ?? "ORÇAMENTO",
            description: data.description ?? "",
            date: data.date ?? 0,
            index: data.index ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            project: data.project ?? defaultProject,
            responsible: data.responsible ?? defaultProfessional,
            immobilesOrigin: data.immobilesOrigin ?? [],
            immobilesTarget: data.immobilesTarget ?? [],
        }
    }
}

export const ServiceStageConversor = {
    toFirestore(data) {
        return {
            title: data.title,
            index: data.index,
            status: data.status,
            service: data.service,
            dateDue: data.dateDue,
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
            status: data.status ?? "ORÇAMENTO",
            description: data.description ?? "",
            index: data.index ?? 0,
            dateDue: data.dateDue ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            service: data.service ?? defaultService,
            responsible: data.responsible ?? defaultProfessional,
        }
    }
}

export const ServicePaymentConversor = {
    toFirestore(data) {
        return {
            value: data.value,
            index: data.index,
            status: data.status,
            service: data.service,
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
            status: data.status ?? "ORÇAMENTO",
            description: data.description ?? "",
            index: data.index ?? 0,
            dateDue: data.dateDue ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            service: data.service ?? defaultService,
        }
    }
}