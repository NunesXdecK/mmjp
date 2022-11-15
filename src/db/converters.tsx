import { defaultAddress, defaultPerson, defaultProfessional, defaultProject, defaultService, defaultUser } from "../interfaces/objectInterfaces"

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

export const UserConversor = {
    toFirestore(data) {
        return {
            email: data.email,
            office: data.office,
            person: data.person,
            password: data.password,
            username: data.username,
            isBlocked: data.isBlocked,
            dateInsertUTC: data.dateInsertUTC,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id ?? "",
            email: data.email ?? "",
            username: data.username ?? "",
            password: data.password ?? "",
            office: data?.office ?? "visitante",
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            isBlocked: data?.isBlocked,
            person: data.person ?? defaultPerson,
        }
    }
}

export const LoginTokenConversor = {
    toFirestore(data) {
        return {
            user: data.user,
            token: data.token,
            isBlocked: data.isBlocked,
            validationDue: data.validationDue,
            dateInsertUTC: data.dateInsertUTC,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id ?? "",
            token: data.token ?? "",
            validationDue: data.validationDue ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            isBlocked: data?.isBlocked,
            user: data.user ?? defaultUser,
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

export const BudgetConversor = {
    toFirestore(data) {
        return {
            id: data.id,
            title: data.title,
            status: data.status,
            dateDue: data.dateDue,
            dateInsertUTC: data.dateInsertUTC,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
            clients: data.clients,
            services: data.services,
            payments: data.payments,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id ?? "",
            title: data.title ?? "",
            status: data.status ?? "ORÇAMENTO",
            dateDue: data.dateDue ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            clients: data.clients ?? [],
            services: data.services ?? [],
            payments: data.payments ?? [],
        }
    }
}

export const ProjectConversor = {
    toFirestore(data) {
        return {
            title: data.title,
            number: data.number,
            status: data.status,
            budget: data.budget,
            dateDue: data.dateDue,
            clients: data.clients,
            priority: data.priority,
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
            number: data.number ?? "",
            description: data.description ?? "",
            status: data.status ?? "PARADO",
            dateDue: data.dateDue ?? 0,
            priority: data.priority ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            budget: data.budget ?? { id: "" },
            clients: data.clients ?? [],
        }
    }
}

export const ServiceConversor = {
    toFirestore(data) {
        return {
            dateDue: data.dateDue,
            title: data.title,
            value: data.value,
            total: data.total,
            index: data.index,
            status: data.status,
            project: data.project,
            quantity: data.quantity,
            priority: data.priority,
            description: data.description,
            professional: data.professional,
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
            status: data.status ?? "PARADO",
            description: data.description ?? "",
            dateDue: data.dateDue ?? 0,
            index: data.index ?? 0,
            priority: data.priority ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            project: data.project ?? defaultProject,
            professional: data.professional ?? defaultProfessional,
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
            priority: data.priority,
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
            priority: data.priority ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            service: data.service ?? defaultService,
            responsible: data.responsible ?? defaultProfessional,
        }
    }
}

export const PaymentConversor = {
    toFirestore(data) {
        return {
            value: data.value,
            title: data.title,
            index: data.index,
            status: data.status,
            project: data.project,
            dateDue: data.dateDue,
            priority: data.priority,
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
            value: data.value ?? "",
            status: data.status ?? "EM ABERTO",
            description: data.description ?? "",
            index: data.index ?? 0,
            dateDue: data.dateDue ?? 0,
            priority: data.priority ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            project: data.project ?? defaultProject,
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
            priority: data.priority,
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
            priority: data.priority ?? 0,
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            service: data.service ?? defaultService,
        }
    }
}

export const SubjectMessageConversor = {
    toFirestore(data) {
        return {
            user: data.user,
            text: data.text,
            referenceId: data.referenceId,
            referenceBase: data.referenceBase,
            dateInsertUTC: data.dateInsertUTC,
            dateLastUpdateUTC: data.dateLastUpdateUTC,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot?.data(options)
        return {
            id: snapshot?.id ?? "",
            text: data.text ?? "",
            referenceId: data.referenceId ?? "",
            referenceBase: data.referenceBase ?? "",
            dateInsertUTC: data.dateInsertUTC ?? 0,
            dateLastUpdateUTC: data.dateLastUpdateUTC ?? 0,
            user: data.user ?? defaultUser,
        }
    }
}