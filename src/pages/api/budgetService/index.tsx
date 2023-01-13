import prisma from "../../../prisma/prisma"
import { handleRemoveCurrencyMask } from "../../../util/maskUtil"
import { BudgetService } from "../../../interfaces/objectInterfaces"

const handleAddBudgetService = async (budgetService: BudgetService, budgetId: number) => {
    if (!budgetService) {
        return 0
    }
    let id = budgetService?.id ?? 0
    let data: any = {
        budgetId: budgetId,
        title: budgetService.title,
        value: handleRemoveCurrencyMask(budgetService.value),
        quantity: parseFloat(budgetService.quantity) ?? 0.0,
    }
    try {
        if (id === 0) {
            id = await prisma.budgetService.create({
                data: {
                    ...data,
                }
            }).then(res => res.id)
        } else if (id > 0) {
            data = {
                ...data,
            }
            id = await prisma.budgetService.update({
                where: { id: id },
                data: data,
            }).then(res => res.id)
        }
    } catch (error) {
        console.error(error)
    }
    return id
}
const handleDelete = async (id) => {
    try {
        await prisma.budgetService.delete({
            where: {
                id: id
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
    const { token, id, data } = JSON.parse(body)
    let resFinal = { status: "ERROR", error: {}, id: 0, message: "" }
    switch (method) {
        case "POST":
            let budgetService: BudgetService = data
            if (token === "tokenbemseguro" && id > 0) {
                const resAdd = await handleAddBudgetService(budgetService, id).then(res => res)
                if (resAdd === 0) {
                    resFinal = { ...resFinal, status: "ERROR" }
                } else {
                    resFinal = { ...resFinal, status: "SUCCESS", id: resAdd }
                }
            } else {
                resFinal = { ...resFinal, status: "ERROR", message: "Token invalido!" }
            }
            res.status(200).json(resFinal)
            break
        case "DELETE":
            if (token === "tokenbemseguro" && id > -1) {
                const resDelete = await handleDelete(id).then(res => res)
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
            res.setHeader("Allow", ["DELETE", "POST"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
