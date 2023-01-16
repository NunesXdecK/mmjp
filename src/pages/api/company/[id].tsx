import prisma from "../../../prisma/prisma"
import { handleMaskCEP, handleMaskCNPJ, handleMaskCPF } from "../../../util/maskUtil"

export const handleGetCompany = async (id: number) => {
    try {
        const company = await prisma.company.findFirst({
            where: {
                id: id,
            },
            include: {
                person: true,
                address: true,
                telephone: true,
            }
        })
        return {
            ...company,
            owners: [company?.person],
            telephones: company?.telephone,
            cnpj: handleMaskCNPJ(company?.cnpj),
            person: { ...company?.person, cpf: handleMaskCPF(company?.person?.cpf) },
            address: { ...company?.address[0], cep: handleMaskCEP(company?.address[0]?.cep) },
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
                const data = await handleGetCompany(parseInt(id))
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
