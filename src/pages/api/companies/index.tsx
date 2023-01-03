import prisma from "../../../prisma/prisma"

const main = async () => {
    try {
        return await prisma.company.findMany()
    } catch (error) {
        console.error(error)
        return []
    }
}

export default async function handler(req, res) {
    const { method } = req
    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            const companies = await main().then(res => res)
            res.status(200).json({ ...resGET, list: companies })
            break
        default:
            res.setHeader("Allow", ["GET"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
