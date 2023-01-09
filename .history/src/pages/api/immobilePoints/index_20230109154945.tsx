import prisma from "../../../prisma/prisma"
import { ImmobilePoint } from "../../../interfaces/objectInterfaces"

const handleAddImmobilePoints = async (immobilePoints: ImmobilePoint[], immobileId: number) => {
    if (!immobilePoints || (!immobileId && immobileId === 0)) {
        return false
    }
    try {
        Promise.all(
            immobilePoints?.map(async (element: ImmobilePoint, index) => {
                const immobilePoint = await prisma.immobilePoint.findFirst({
                    where: {
                        immobileId: immobileId,
                        point: {
                            pointId: {
                                equals: element.pointId
                            }
                        },
                    }
                })
                const id = immobilePoint?.id ?? 0
                if (id === 0) {
                    const data: any = {
                        immobile: {
                            connect: {
                                id: immobileId,
                            },
                        },
                        point: {
                            connectOrCreate: {
                                where: {
                                    pointId: element.pointId,
                                },
                                create: {
                                    type: element.type,
                                    epoch: element.epoch,
                                    pointId: element.pointId,
                                    eastingX: element.eastingX,
                                    gnssType: element.gnssType,
                                    northingY: element.northingY,
                                    frequency: element.frequency,
                                    description: element.description,
                                    posnQuality: element.posnQuality,
                                    storedStatus: element.storedStatus,
                                    solutionType: element.solutionType,
                                    elipseHeightZ: element.elipseHeightZ,
                                    heightQuality: element.heightQuality,
                                    ambiguityStatus: element.ambiguityStatus,
                                    posnHeightQuality: element.posnHeightQuality,
                                }
                            }
                        }
                    }
                    await prisma.immobilePoint.create({
                        data: { ...data },
                        include: {
                            point: true,
                            immobile: true,
                        }
                    })
                }
            })
        )
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export default async function handler(req, res) {
    const { method, body } = req
    const { token, data, immobileId } = JSON.parse(body)
    let resFinal = { status: "ERROR", message: "" }
    switch (method) {
        case "POST":
            if (token === "tokenbemseguro" && immobileId > 0) {
                const resAdd = await handleAddImmobilePoints(data, immobileId).then(res => res)
                if (resAdd) {
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
            res.setHeader("Allow", ["POST"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
