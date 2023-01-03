import prisma from "../../../prisma/prisma"
import { Person } from "../../../interfaces/objectInterfaces"

export const handleGetPerson = async (id: number) => {
    try {
        const person: Person = await prisma.person.findFirst({
            where: {
                id: id,
            }
        })
        const addressData = await prisma.address.findFirst({
            where: {
                personId: id,
            }
        })
        const telephoneData = await prisma.telephone.findMany({
            where: {
                personId: id,
            }
        })
        return { ...person, address: addressData, telephones: telephoneData }
    } catch (err) {
        console.error(err)
    }
    return { id: 0 }
}

export default async function handler(req, res) {
    const { query, method } = req
    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            const { id } = query
            if (id && parseInt(id)) {
                const data = await handleGetPerson(parseInt(id))
                if (data?.id > 0) {
                    resGET = { ...resGET, status: "SUCCESS", data: data }
                } else {
                    resGET = { ...resGET, status: "ERROR", message: "Não encontrado" }
                }
            } else {
                resGET = { ...resGET, status: "ERROR", message: "ID invalido!" }
            }
            res.status(200).json(resGET)
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
