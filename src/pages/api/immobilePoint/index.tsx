import prisma from "../../../prisma/prisma"
import { ImmobilePoint } from "../../../interfaces/objectInterfaces"

const handleAddPoint = async (point: ImmobilePoint) => {
    if (!point) {
        return 0
    }
    let data: any = {
        type: point.type,
        epoch: point.epoch,
        pointId: point.pointId,
        gnssType: point.gnssType,
        eastingX: point.eastingX,
        northingY: point.northingY,
        frequency: point.frequency,
        description: point.description,
        posnQuality: point.posnQuality,
        storedStatus: point.storedStatus,
        solutionType: point.solutionType,
        elipseHeightZ: point.elipseHeightZ,
        heightQuality: point.heightQuality,
        ambiguityStatus: point.ambiguityStatus,
        posnHeightQuality: point.posnHeightQuality,
    }
    let id = point?.id ?? 0
    try {
        data = {
            ...data,
        }
        if (id === 0) {
            id = await prisma.point.create({
                data: {
                    ...data,
                },
            }).then(res => res.id)
        } else if (id > 0) {
            id = await prisma.point.update({
                where: { id: id },
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
        await prisma.immobilePoint.deleteMany({
            where: { pointId: id },
        })
        await prisma.point.delete({
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
            let point: ImmobilePoint = data
            if (token === "tokenbemseguro") {
                const resAdd = await handleAddPoint(point).then(res => res)
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
