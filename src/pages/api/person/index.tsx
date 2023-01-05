import prisma from "../../../prisma/prisma"
import { Person, Telephone } from "../../../interfaces/objectInterfaces"

const handleAddPerson = async (person: Person) => {
    if (!person) {
        return 0
    }
    let data: any = {
        rg: person.rg,
        cpf: person.cpf,
        name: person.name,
        rgIssuer: person.rgIssuer,
        profession: person.profession,
        clientCode: person.clientCode,
        naturalness: person.naturalness,
        description: person.description,
        nationality: person.nationality,
        maritalStatus: person.maritalStatus,
    }
    let dataAddress: any = [{
        cep: person?.address?.cep,
        number: person?.address?.number,
        county: person?.address?.county,
        district: person?.address?.district,
        complement: person?.address?.complement,
        publicPlace: person?.address?.publicPlace,
    }]
    let dataTelephone = []
    person?.telephones?.map(async (element: Telephone, index) => {
        dataTelephone = [
            ...dataTelephone,
            {
                companyId: null,
                type: element.type,
                value: element.value,
            }]
    })
    let id = person?.id ?? 0
    try {
        if (id === 0) {
            data = {
                ...data,
                address: { create: [...dataAddress] },
                telephone: { create: [...dataTelephone] },
            }
            id = await prisma.person.create({
                data: {
                    ...data,
                },
                include: {
                    address: true,
                    telephone: true,
                },
            }).then(res => res.id)
        } else if (id > 0) {
            data = {
                ...data,
                address: {
                    updateMany: {
                        data: dataAddress[0],
                        where: { personId: id },
                    }
                },
            }
            id = await prisma.person.update({
                where: { id: id },
                data: data,
                include: {
                    address: true,
                },
            }).then(res => res.id)
        }
    } catch (error) {
        console.error(error)
    }
    return id
}

const handleDelete = async (id: number) => {
    try {
        await prisma.address.deleteMany({
            where: { personId: id },
        })
        await prisma.telephone.deleteMany({
            where: { personId: id },
        })
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
                const resAdd = await handleAddPerson(person).then(res => res)
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
            res.setHeader("Allow", ["POST", "DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
