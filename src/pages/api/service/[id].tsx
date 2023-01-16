import prisma from "../../../prisma/prisma"

export const handleGetService = async (id: number) => {
    try {
        const service = await prisma.service.findFirst({
            where: {
                id: id,
            },
            include: {
                servicestage: true,
                serviceimmobile: {
                    include: {
                        immobile: true,
                    }
                }
            }
        })
        console.log(service)
        return {
            ...service,
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
                const data = await handleGetService(parseInt(id))
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
