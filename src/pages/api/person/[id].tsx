import prisma from "../../../prisma/prisma"
import { Person } from "../../../interfaces/objectInterfaces"

export default async function handler(req, res) {
    const { query, method } = req
    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                if (id && parseInt(id)) {
                    const data: Person = await prisma.person.findFirst({
                        where: {
                            id: parseInt(id),
                        }
                    })
                    const addressData = await prisma.address.findFirst({
                        where: {
                            personId: parseInt(id),
                        }
                    })
                    const telephoneData = await prisma.telephone.findMany({
                        where: {
                            personId: parseInt(id),
                        }
                    })
                    if (data?.id > 0) {
                        resGET = { ...resGET, status: "SUCCESS", data: { ...data, address: addressData, telephones: telephoneData } }
                    } else {
                        resGET = { ...resGET, status: "ERROR", message: "Não encontrado" }
                    }
                } else {
                    resGET = { ...resGET, status: "ERROR", message: "Token invalido!" }
                }
            } catch (err) {
                console.error(err)
                resGET = { ...resGET, status: "ERROR", error: err }
            }
            res.status(200).json(resGET)
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
