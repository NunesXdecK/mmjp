import { Person } from "../../../interfaces/objectInterfaces"
import prisma from "../../../prisma/prisma"

const handleAdd = async (person: Person) => {
    if (!person) {
        return 0
    }
    const data: any = {
        rg: person.rg,
        cpf: person.cpf,
        name: person.name,
        rgIssuer: person.rgIssuer,
        profession: person.profession,
        clientCode: person.clientCode,
        naturalness: person.naturalness,
        description: person.description,
        nationality: person.nationality,
        dateInsert: person.dateInsertUTC,
        maritalStatus: person.maritalStatus,
        dateUpdate: person.dateLastUpdateUTC,
    }
    let id = person?.id ?? 0
    try {
        if (person?.id === 0) {
            id = await prisma.person.create({
                data: data,
            }).then(res => res.id)
        } else if (person?.id > 0) {
            id = await prisma.person.update({
                where: { id: person.id },
                data: data,
            }).then(res => res.id)
        }
    } catch (error) {
        console.error(error)
    }
    return id
}

const handleDelete = async (id: number) => {
    try {
        await prisma.person.delete({
            where: { id: id },
        })
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export default async function handler(req, res) {
    const { method, body } = req
    const { token, data, id } = JSON.parse(body)
    let resFinal = { status: "ERROR", error: {}, id: 0, message: "" }
    switch (method) {
        case "POST":
            let person: Person = data
            if (token === "tokenbemseguro") {
                const resAdd = await handleAdd(person).then(res => res)
                if (resAdd === 0) {
                    resFinal = { ...resFinal, status: "ERROR" }
                } else {
                    resFinal = { ...resFinal, status: "SUCCESS", id: resAdd }
                }
            } else {
                resFinal = { ...resFinal, status: "ERROR", message: "Token invalido!" }
            }
            res.status(200).json(resFinal)
            break
        case "DELETE":
            if (token === "tokenbemseguro") {
                const resDelete = await handleDelete(id).then(res => res)
                if (resDelete) {
                    resFinal = { ...resFinal, status: "SUCCESS" }
                } else {
                    resFinal = { ...resFinal, status: "ERROR" }
                }
            } else {
                resFinal = { ...resFinal, status: "ERROR", message: "Token invalido!" }
            }
            res.status(200).json(resFinal)
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
