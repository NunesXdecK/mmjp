import prisma from "../../../prisma/prisma"

export default async function handler(req, res) {
    const { method } = req
    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: false }
            const { id } = req.query
            try {
                const code = id
                if (code?.length > 1) {
                    const pointId = code[0]
                    const id = parseInt(code[1])
                    const points = await prisma.point.findMany({
                        where: {
                            id: {
                                not: id,
                            },
                            pointId: pointId,
                        }
                    })
                    let notHave = points.length > 0
                    resGET = { ...resGET, status: "SUCCESS", data: notHave }
                } else {
                    resGET = { ...resGET, status: "ERROR", message: "Token invalido!" }
                }
            } catch (err) {
                console.error(err)
                resGET = { ...resGET, status: "ERROR", error: err }
            }
            res.status(200).json(resGET)
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
