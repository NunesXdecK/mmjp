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
    if (id > 0) {
        let dataAddress: any = {
            personId: id,
            cep: person?.address?.cep,
            number: person?.address?.number,
            county: person?.address?.county,
            district: person?.address?.district,
            complement: person?.address?.complement,
            publicPlace: person?.address?.publicPlace,
        }
        try {
            const address = await prisma.address.findFirst({
                where: {
                    personId: id,
                }
            })
            let addressId = address?.id ?? person?.address?.id
            if (addressId === 0) {
                addressId = await prisma.address.create({
                    data: dataAddress,
                }).then(res => res.id)
            } else if (addressId > 0) {
                addressId = await prisma.address.update({
                    where: { id: addressId },
                    data: dataAddress,
                }).then(res => res.id)
            }
        } catch (error) {
            console.error(error)
        }
        if (person?.telephones?.length > 0) {
            await Promise.all(
                person?.telephones?.map(async (element: Telephone, index) => {
                    let dataTelephone: any = {
                        personId: id,
                        type: element.type,
                        value: element.value,
                    }
                    try {
                        const telephone = await prisma.telephone.findFirst({
                            where: {
                                personId: id,
                                type: element.type,
                                value: element.value,
                            }
                        })
                        let telephoneId = telephone?.id ?? element?.id
                        if (telephoneId === 0) {
                            telephoneId = await prisma.telephone.create({
                                data: dataTelephone,
                            }).then(res => res.id)
                        }
                    } catch (error) {
                        console.error(error)
                    }
                })
            )
        }
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
