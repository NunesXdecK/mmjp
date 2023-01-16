import prisma from "../../../prisma/prisma"

const main = async () => {
    try {
        return await prisma.project.findMany()
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
            const projects = await main().then(res => res)
            res.status(200).json({ ...resGET, list: projects })
            break
        default:
            res.setHeader("Allow", ["GET"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
