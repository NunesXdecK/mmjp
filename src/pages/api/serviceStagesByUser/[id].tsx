import prisma from "../../../prisma/prisma"

const main = async (id: number) => {
    try {
        return await prisma.serviceStage.findMany()
    } catch (error) {
        console.error(error)
        return []
    }
}

export default async function handler(req, res) {
    const { method, query } = req
    const { id } = query
    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            const serviceStages = await main(id).then(res => res)
            res.status(200).json({ ...resGET, list: serviceStages })
            break
        default:
            res.setHeader("Allow", ["GET"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
