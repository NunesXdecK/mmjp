import prisma from "../../../prisma/prisma"
import { defaultImmobile } from "../../../interfaces/objectInterfaces"
import { handleMaskCEP } from "../../../util/maskUtil"

export const handleGetImmobile = async (id: number) => {
    try {
        let immobile = await prisma.immobile.findFirst({
            where: {
                id: parseInt(id)
            },
            include: {
                immobileOwner: {
                    include: {
                        person: true,
                        company: true,
                    },
                },
                immobilePoint: {
                    include: {
                        point: true,
                    }
                },
                address: true,
            }
        })
        let owners = []
        immobile?.immobileOwner?.map((element, index) => {
            if (element?.id > 0) {
                owners = [...owners, element?.person ?? element?.company]
            }
        })
        let points = []
        immobile?.immobilePoint?.map((element, index) => {
            if (element?.id > 0) {
                points = [...points, { ...element?.point }]
            }
        })
        return {
            ...immobile,
            owners: owners,
            points: points,
            address: { ...immobile?.address[0], cep: handleMaskCEP(immobile?.address[0]?.cep) },
        }
    } catch (err) {
        console.error(err)
    }
    return { id: 0 }
}

export default async function handler(req, res) {
    const { query, method } = req
    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            const { id } = query
            if (id && parseInt(id)) {
                const data = await handleGetImmobile(parseInt(id))
                if (data?.id > 0) {
                    resGET = { ...resGET, status: "SUCCESS", data: data }
                } else {
                    resGET = { ...resGET, status: "ERROR", message: "Não encontrado" }
                }
            } else {
                resGET = { ...resGET, status: "ERROR", message: "ID invalido!" }
            }
            res.status(200).json(resGET)
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}