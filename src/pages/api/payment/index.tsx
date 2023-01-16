import prisma from "../../../prisma/prisma"
import { Payment } from "../../../interfaces/objectInterfaces"
import { handleRemoveCurrencyMask } from "../../../util/maskUtil"

const handleAddPayment = async (payment: Payment) => {
    if (!payment) {
        return 0
    }
    let id = payment?.id ?? 0
    let data: any = {
        title: payment.title,
        status: payment.status,
        description: payment.description,
        value: handleRemoveCurrencyMask(payment.value),
        dateDue: payment?.dateDue?.length > 0 ? new Date(payment.dateDue) : null
    }
    try {
        if (id === 0) {
            id = await prisma.payment.create({
                data: {
                    ...data,
                }
            }).then(res => res.id)
        } else {
            id = await prisma.payment.update({
                where: {
                    id: id,
                },
                data: {
                    ...data,
                }
            }).then(res => res.id)
        }
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
            let payment: Payment = data
            if (token === "tokenbemseguro") {
                const resAdd = await handleAddPayment(payment).then(res => res)
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
