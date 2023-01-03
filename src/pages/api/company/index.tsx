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
    let id = company?.id ?? 0
    try {
        if (company?.id === 0) {
            id = await prisma.company.create({
                data: data,
            }).then(res => res.id)
        } else if (company?.id > 0) {
            id = await prisma.company.update({
                where: { id: company.id },
                data: data,
            }).then(res => res.id)
        }
    } catch (error) {
        console.error(error)
    }
    if (id > 0) {
        let dataAddress: any = {
            companyId: id,
            cep: company?.address?.cep,
            number: company?.address?.number,
            county: company?.address?.county,
            district: company?.address?.district,
            complement: company?.address?.complement,
            publicPlace: company?.address?.publicPlace,
        }
        try {
            const address = await prisma.address.findFirst({
                where: {
                    companyId: id,
                }
            })
            let addressId = address?.id ?? company?.address?.id ?? 0
            if (addressId === 0) {
                addressId = await prisma.address.create({
                    data: dataAddress,
                }).then(res => res.id)
            } else if (addressId > 0) {
                addressId = await prisma.address.update({
                    where: { id: addressId },
                    data: dataAddress,
                }).then(res => res.id)
            }
        } catch (error) {
            console.error(error)
        }
        if (company?.telephones?.length > 0) {
            await Promise.all(
                company?.telephones?.map(async (element: Telephone, index) => {
                    let dataTelephone: any = {
                        companyId: id,
                        type: element.type,
                        value: element.value,
                    }
                    try {
                        const telephone = await prisma.telephone.findFirst({
                            where: {
                                companyId: id,
                                type: element.type,
                                value: element.value,
                            }
                        })
                        let telephoneId = telephone?.id ?? element?.id
                        if (telephoneId === 0) {
                            telephoneId = await prisma.telephone.create({
                                data: dataTelephone,
                            }).then(res => res.id)
                        }
                    } catch (error) {
                        console.error(error)
                    }
                })
            )
        }
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
