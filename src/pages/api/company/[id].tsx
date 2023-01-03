import prisma from "../../../prisma/prisma"
import { handleMaskCEP, handleMaskCNPJ } from "../../../util/maskUtil"
import { defaultPerson } from "../../../interfaces/objectInterfaces"

export const handleGetCompany = async (id: number) => {
    try {
        const company = await prisma.company.findFirst({
            where: {
                id: id,
            }
        })
        const addressData = await prisma.address.findFirst({
            where: {
                companyId: id,
            }
        })
        const telephoneData = await prisma.telephone.findMany({
            where: {
                companyId: id,
            }
        })
        let person = defaultPerson
        if (company?.personId > 0) {
            let person = await prisma.person.findFirst({
                where: {
                    id: company.personId,
                }
            })
        }
        return {
            ...company,
            owners: [person],
            telephones: telephoneData,
            cnpj: handleMaskCNPJ(company?.cnpj),
            address: { ...addressData, cep: handleMaskCEP(addressData?.cep) },
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
