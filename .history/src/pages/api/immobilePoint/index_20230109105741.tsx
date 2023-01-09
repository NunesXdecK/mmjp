import prisma from "../../../prisma/prisma"

const handleAddImmobilePoint = async (immobileId, pointId) => {
    if (!immobileId || !pointId) {
        return 0
    }
    let data: any = {
        immobileId: immobileId,
        pointId: pointId,
    }
    let id = 0
    try {
        const immobilePoint = await prisma.immobilePoint.findFirst({
            where: {
                pointId: pointId,
                immobileId: immobileId,
            }
        })
        id = immobilePoint?.id ?? 0
        if (id === 0) {
            id = await prisma.immobilePoint.create({
                data: {
                    ...data,
                },
            }).then(res => res.id)
        } else if (id > 0) {
            id = await prisma.immobilePoint.update({
                where: { id: id },
                data: data,
            }).then(res => res.id)
        }
    } catch (error) {
        console.error(error)
    }
    return id
}

const handleDelete = async (immobileId, pointId) => {
    try {
        await prisma.immobilePoint.deleteMany({
            where: {
                pointId: pointId,
                immobileId: immobileId,
            }
        })
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export default async function handler(req, res) {
    const { method, body } = req
    const { token, data } = JSON.parse(body)
    let resFinal = { status: "ERROR", error: {}, id: 0, message: "" }
    switch (method) {
        case "POST":
            if (token === "tokenbemseguro" && data?.pointId > 0 && data?.immobileId > 0) {
                const resAdd = await handleAddImmobilePoint(data?.immobileId, data?.pointId).then(res => res)
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
            if (token === "tokenbemseguro" && data?.pointId > 0 && data?.immobileId > 0) {
                const resDelete = await handleDelete(data?.immobileId, data?.pointId).then(res => res)
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
