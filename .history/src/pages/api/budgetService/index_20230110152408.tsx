import prisma from "../../../prisma/prisma"

const handleDelete = async (budgetId, index) => {
    try {
        await prisma.budgetService.delete({
            where: {
                budgetId_index: {
                    index: index,
                    budgetId: budgetId,
                }
            },
        })
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export default async function handler(req, res) {
    const { method, body } = req
    const { token, budgetId, index } = JSON.parse(body)
    let resFinal = { status: "ERROR", error: {}, id: 0, message: "" }
    switch (method) {
        case "DELETE":
            if (token === "tokenbemseguro" && budgetId > 0 && index > 0) {
                const resDelete = await handleDelete(budgetId, index).then(res => res)
                if (resDelete) {
                    resFinal = { ...resFinal, status: "SUCCESS" }
                } else {
                    resFinal = { ...resFinal, status: "ERROR" }
                }
            } else {
                resFinal = { ...resFinal, status: "ERROR", message: "Token invalido!" }
            }
            res.status(200).json(resFinal)
            break
        default:
            res.setHeader("Allow", ["DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
