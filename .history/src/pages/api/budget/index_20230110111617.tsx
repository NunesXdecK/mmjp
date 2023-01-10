import prisma from "../../../prisma/prisma"
import { Budget, BudgetPayment, BudgetService } from "../../../interfaces/objectInterfaces"

const handleAddBudget = async (budget: Budget) => {
    if (!budget) {
        return 0
    }
    let id = budget?.id ?? 0
    let data: any = {
        title: budget.title,
        status: budget.status,
        dateDue: budget.dateString,
        description: budget.description,
        personId: "cpf" in budget?.clients[0] ? budget?.clients[0]?.id : null,
        companyId: "cnpj" in budget?.clients[0] ? budget?.clients[0]?.id : null,
    }
    let dataBudgetService: any[] = []
    budget?.services?.map(async (element: BudgetService, index) => {
        dataBudgetService = [
            ...dataBudgetService,
            {
                where: {
                    budgetId: id,
                    index: element.index,
                },
                create: {
                    title: element.title,
                    value: element.value,
                    index: element.index,
                    quantity: element.quantity,
                },
                update: {
                    title: element.title,
                    value: element.value,
                    index: element.index,
                    quantity: element.quantity,
                }
            }]
    })
    let dataBudgetPayment: any[] = []
    budget?.payments?.map(async (element: BudgetPayment, index) => {
        dataBudgetPayment = [
            ...dataBudgetPayment,
            {
                where: {
                    budgetId: id,
                    index: element.index,
                },
                create: {
                    title: element.title,
                    value: element.value,
                    index: element.index,
                    dateDue: element.dateDue,
                },
                update: {
                    title: element.title,
                    value: element.value,
                    index: element.index,
                    dateDue: element.dateDue,
                }
            }]
    })
    try {
        data = {
            ...data,
            budgetService: { upsert: [...dataBudgetService] },
            budgetPayment: { upsert: [...dataBudgetPayment] },
        }
        if (id === 0) {
            id = await prisma.budget.create({
                data: {
                    ...data,
                },
                include: {
                    budgetService: true,
                    budgetPayment: true,
                },
            }).then(res => res.id)
        } else if (id > 0) {
            id = await prisma.budget.update({
                where: { id: id },
                data: data,
                include: {
                    budgetService: true,
                    budgetPayment: true,
                },
            }).then(res => res.id)
        }
    } catch (error) {
        console.error(error)
    }
    return id
}

const handleDelete = async (id: number) => {
    try {
        await prisma.budgetService.deleteMany({
            where: { budgetId: id },
        })
        await prisma.budgetService.deleteMany({
            where: { budgetId: id },
        })
        await prisma.budget.delete({
            where: { id: id },
        })
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export default async function handler(req, res) {
    const { method, body } = req
    const { token, data, id } = JSON.parse(body)
    let resFinal = { status: "ERROR", error: {}, id: 0, message: "" }
    switch (method) {
        case "POST":
            let budget: Budget = data
            if (token === "tokenbemseguro") {
                const resAdd = await handleAddBudget(budget).then(res => res)
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
            if (token === "tokenbemseguro") {
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
            res.setHeader("Allow", ["POST", "DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
