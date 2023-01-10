import prisma from "../../../prisma/prisma"
import { handleMaskCEP } from "../../../util/maskUtil"

export const handleGetBudget = async (id: number) => {
    try {
        let budget: any = await prisma.budget.findFirst({
            where: {
                id: id
            },
            include: {
                budgetPayment: true,
                budgetService: true,
            }
        })
        return {
            ...budget,
            clients: budget.clients ? [budget.clients] : []
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
                const data = await handleGetBudget(parseInt(id))
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