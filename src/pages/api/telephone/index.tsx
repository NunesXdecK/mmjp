import prisma from "../../../prisma/prisma"
import { Telephone } from "../../../interfaces/objectInterfaces"

const handleAddTelephone = async (telephone: Telephone, personId: number, companyId: number) => {
    if (!telephone) {
        return 0
    }
    let data: any = {
        personId: personId,
        type: telephone.type,
        companyId: companyId,
        value: telephone.value,
    }
    let id = telephone?.id ?? 0
    try {
        if (id === 0) {
            id = await prisma.telephone.create({
                data: data,
            }).then(res => res.id)
        }
    } catch (error) {
        console.error(error)
    }
    return id
}

const handleDelete = async (id: number) => {
    try {
        await prisma.telephone.delete({
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
    const { token, id, data, personId, companyId } = JSON.parse(body)
    let resFinal = { status: "ERROR", error: {}, id: 0, message: "" }
    switch (method) {
        case "POST":
            if (token === "tokenbemseguro") {
                const resDelete = await handleAddTelephone(data, personId, companyId).then(res => res)
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
