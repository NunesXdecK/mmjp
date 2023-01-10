import prisma from "../../../prisma/prisma"

const handleDelete = async (immobileId, pointId) => {
    try {
        await prisma.immobilePoint.deleteMany({
            where: {
                point: {
                    pointId: {
                        equals: pointId,
                    }
                },
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
    const { token, pointId, immobileId } = JSON.parse(body)
    let resFinal = { status: "ERROR", error: {}, id: 0, message: "" }
    switch (method) {
        case "DELETE":
            if (token === "tokenbemseguro" && pointId?.length > 0 && immobileId > 0) {
                const resDelete = await handleDelete(immobileId, pointId).then(res => res)
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
