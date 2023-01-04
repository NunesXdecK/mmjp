import prisma from "../../../prisma/prisma"
import { Immobile, defaultImmobile } from "../../../interfaces/objectInterfaces"

export default async function handler(req, res) {
    const { query, method } = req
    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            const { id } = query
            try {
                if (id && parseInt(id)) {
                    let immobile: Immobile = defaultImmobile
                    immobile = await prisma.immobile.findFirst({
                        where: {
                            id: parseInt(id)
                        }
                    })
                    resGET = { ...resGET, status: "SUCCESS", data: { ...immobile } }
                } else {
                    resGET = { ...resGET, status: "ERROR", message: "ID invalido!" }
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
