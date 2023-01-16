import prisma from "../../../prisma/prisma"

const main = async (id) => {
    try {
        return await prisma.payment.findMany({
            where: {
                projectId: id,
            },
            include: {
                project: true
            }
        })
    } catch (error) {
        console.error(error)
        return []
    }
}

export default async function handler(req, res) {
    const { method, query } = req
    const { id } = query
    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            if (parseInt(id)) {
                const payments = await main(parseInt(id)).then(res => res)
                resGET = { ...resGET, list: payments }
            }
            res.status(200).json({ ...resGET })
            break
        default:
            res.setHeader("Allow", ["GET"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
