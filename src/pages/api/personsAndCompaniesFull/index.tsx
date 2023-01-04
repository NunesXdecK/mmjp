import prisma from "../../../prisma/prisma"

const main = async () => {
    try {
        const persons = await prisma.person.findMany()
        const companies = await prisma.company.findMany()
        return [...persons, ...companies]
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
            const result = await main().then(res => res)
            res.status(200).json({ ...resGET, list: result })
            break
        default:
            res.setHeader("Allow", ["GET"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
