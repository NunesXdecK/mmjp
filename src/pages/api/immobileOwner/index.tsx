import prisma from "../../../prisma/prisma"

const handleAddImmobileOwner = async (immobileOwner, immobileId: number) => {
    if (!immobileOwner) {
        return 0
    }
    let data: any = {
    }
    let id = immobileOwner?.id ?? 0
    try {
        if (id === 0) {
            id = await prisma.immobileOwner.create({
                data: data,
            }).then(res => res.id)
        }
    } catch (error) {
        console.error(error)
    }
    return id
}

const handleDelete = async (immobileId: number, personId: number, companyId: number) => {
    console.log(immobileId, personId, companyId)
    try {
        await prisma.immobileOwner.deleteMany({
            where: {
                personId: personId === 0 ? null : personId,
                companyId: companyId === 0 ? null : companyId,
                immobileId: immobileId === 0 ? null : immobileId,
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
    const { token, id, data, immobileId, personId, companyId } = JSON.parse(body)
    let resFinal = { status: "ERROR", error: {}, id: 0, message: "" }
    switch (method) {
        case "POST":
            if (token === "tokenbemseguro") {
                const resDelete = await handleAddImmobileOwner(data, immobileId).then(res => res)
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
                const resDelete = await handleDelete(immobileId, personId, companyId).then(res => res)
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
