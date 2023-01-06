import prisma from "../../../prisma/prisma"
import { Company, Telephone } from "../../../interfaces/objectInterfaces"

const handleAddCompany = async (company: Company) => {
    if (!company) {
        return 0
    }
    let data: any = {
        cnpj: company.cnpj,
        name: company.name,
        clientCode: company.clientCode,
        description: company.description,
        personId: company.personId > 0 ? company.personId : null,
    }
    let dataAddress: any = [{
        cep: company?.address?.cep,
        number: company?.address?.number,
        county: company?.address?.county,
        district: company?.address?.district,
        complement: company?.address?.complement,
        publicPlace: company?.address?.publicPlace,
    }]
    let dataTelephone = []
    company?.telephones?.map(async (element: Telephone, index) => {
        dataTelephone = [
            ...dataTelephone,
            {
                personId: null,
                type: element.type,
                value: element.value,
            }]
    })
    let id = company?.id ?? 0
    try {
        if (id === 0) {
            data = {
                ...data,
                address: { create: [...dataAddress] },
                telephone: { create: [...dataTelephone] },
            }
            id = await prisma.company.create({
                data: {
                    ...data,
                },
                include: {
                    address: true,
                    telephone: true,
                },
            }).then(res => res.id)
        } else if (id > 0) {
            data = {
                ...data,
                address: {
                    updateMany: {
                        data: dataAddress[0],
                        where: { companyId: id },
                    }
                },
            }
            id = await prisma.company.update({
                where: { id: id },
                data: data,
                include: {
                    address: true,
                },
            }).then(res => res.id)
        }
    } catch (error) {
        console.error(error)
    }
    return id
}

const handleDelete = async (id: number) => {
    try {
        await prisma.address.deleteMany({
            where: { companyId: id },
        })
        await prisma.telephone.deleteMany({
            where: { companyId: id },
        })
        await prisma.company.delete({
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
            let company: Company = data
            if (token === "tokenbemseguro") {
                const resAdd = await handleAddCompany(company).then(res => res)
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
