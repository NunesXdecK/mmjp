import prisma from "../../../prisma/prisma"
import { handleMaskCEP } from "../../../util/maskUtil"

export const handleGetPerson = async (id: number) => {
    try {
        const person = await prisma.person.findFirst({
            where: {
                id: id,
            },
            include: {
                address: true,
                telephone: true,
            }
        })
        return {
            ...person,
            telephones: person?.telephone,
            address: { ...person?.address[0], cep: handleMaskCEP(person?.address[0]?.cep) },
        }
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
            res.setHeader("Allow", ["GET"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
