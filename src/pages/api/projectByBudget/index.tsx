import prisma from "../../../prisma/prisma"
import { Budget, BudgetPayment, BudgetService } from "../../../interfaces/objectInterfaces"
import { handleRemoveCurrencyMask } from "../../../util/maskUtil"

const handleAddProject = async (budget: Budget) => {
    if (!budget) {
        return 0
    }
    //mount project number
    const year = new Date().getFullYear()
    const clientCode = (
        "cpf" in budget?.clients[0] ? budget?.clients[0]?.clientCode :
            "cnpj" in budget?.clients[0] ? budget?.clients[0]?.clientCode : ""
    )
    let number = ""
    number = number + year + "-"
    number = number + clientCode + "-"
    let numberOfProjectsInYear = "1"
    try {
        const search = clientCode + " & " + year
        const res = await prisma.project.findMany({
            where: {
                number: {
                    search: search,
                }
            }
        })
        numberOfProjectsInYear = (res?.length + 1).toString() ?? "1"
    } catch (error) {
        console.error(error)
    }
    number = number + numberOfProjectsInYear

    let professionalID = 0
    try {
        const resProfessional = await prisma.professional.findFirst({
            orderBy: {
                dateUpdate: "desc",
            }
        })
        professionalID = resProfessional?.id ?? null
    } catch (error) {
        console.error(error)
    }

    let id = 0
    let data: any = {
        number: number,
        status: "PARADO",
        title: budget.title,
        budgetId: budget.id,
        description: budget.description,
        dateDue: budget?.dateDue?.length > 0 ? new Date(budget.dateDue) : null,
        personId: "cpf" in budget?.clients[0] ? budget?.clients[0]?.id : null,
        companyId: "cnpj" in budget?.clients[0] ? budget?.clients[0]?.id : null,
    }
    let dataBudgetService: any[] = []
    budget?.services?.map(async (element: BudgetService, index) => {
        const data = {
            status: "PARADO",
            title: element.title,
            value: handleRemoveCurrencyMask(element.value),
            quantity: parseFloat(element.quantity) ?? 0.0,
            professional: {
                connect: {
                    id: professionalID
                }
            }
        }
        dataBudgetService = [...dataBudgetService, { ...data }]
    })
    let dataBudgetPayment: any[] = []
    budget?.payments?.map(async (element: BudgetPayment, index) => {
        handleRemoveCurrencyMask
        const data = {
            status: "EM ABERTO",
            title: element.title,
            value: handleRemoveCurrencyMask(element.value),
            dateDue: element?.dateDue?.length > 0 ? new Date(element.dateDue) : null,
        }
        dataBudgetPayment = [...dataBudgetPayment, { ...data }]
    })
    try {
        data = {
            ...data,
            service: { create: [...dataBudgetService] },
            payment: { create: [...dataBudgetPayment] },
        }
        id = await prisma.project.create({
            data: {
                ...data,
            },
            include: {
                service: true,
                payment: true,
            },
        }).then(res => res.id)
    } catch (error) {
        console.error(error)
        id = 0
    }
    return id
}

export default async function handler(req, res) {
    const { method, body } = req
    const { token, data } = JSON.parse(body)
    let resFinal = { status: "ERROR", error: {}, id: 0, message: "" }
    switch (method) {
        case "POST":
            let budget: Budget = data
            if (token === "tokenbemseguro") {
                const resAdd = await handleAddProject(budget).then(res => res)
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
        default:
            res.setHeader("Allow", ["POST"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
