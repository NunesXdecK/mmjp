import prisma from "../../../prisma/prisma"
import { Company, Immobile, Person } from "../../../interfaces/objectInterfaces"

const handleAddImmobile = async (immobile: Immobile) => {
    if (!immobile) {
        return 0
    }
    let data: any = {
        land: immobile.land,
        name: immobile.name,
        area: immobile.area,
        county: immobile.county,
        status: immobile.status,
        process: immobile.process,
        comarca: immobile.comarca,
        perimeter: immobile.perimeter,
        ccirNumber: immobile.ccirNumber,
        comarcaCode: immobile.comarcaCode,
        description: immobile.description,
        registration: immobile.registration,
    }
    let id = immobile?.id ?? 0
    try {
        if (immobile?.id === 0) {
            id = await prisma.immobile.create({
                data: data,
            }).then(res => res.id)
        } else if (immobile?.id > 0) {
            id = await prisma.immobile.update({
                where: { id: immobile.id },
                data: data,
            }).then(res => res.id)
        }
    } catch (error) {
        console.error(error)
    }
    if (id > 0) {
        let dataAddress: any = {
            immobileId: id,
            cep: immobile?.address?.cep,
            number: immobile?.address?.number,
            county: immobile?.address?.county,
            district: immobile?.address?.district,
            complement: immobile?.address?.complement,
            publicPlace: immobile?.address?.publicPlace,
        }
        try {
            const address = await prisma.address.findFirst({
                where: {
                    immobileId: id,
                }
            })
            let addressId = address?.id ?? immobile?.address?.id ?? 0
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
        if (immobile?.owners?.length > 0) {
            await Promise.all(
                immobile?.owners?.map(async (element: (Person | Company), index) => {
                    let dataImmobileOwner: any = {
                        immobileId: id,
                    }
                    if ("cpf" in element) {
                        dataImmobileOwner = {
                            ...dataImmobileOwner,
                            personId: element.id,
                        }
                    } else if ("cnpj" in element) {
                        dataImmobileOwner = {
                            ...dataImmobileOwner,
                            companyId: element.id,
                        }
                    }
                    try {
                        const immobileOwner = await prisma.immobileOwner.findFirst({
                            where: dataImmobileOwner
                        })
                        let immobileOwnerId = immobileOwner?.id ?? 0
                        if (immobileOwnerId === 0) {
                            immobileOwnerId = await prisma.immobileOwner.create({
                                data: dataImmobileOwner,
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
        await prisma.immobile.delete({
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
    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: 0, message: "" }
            let { token, data, history } = JSON.parse(body)
            if (token === "tokenbemseguro") {
                let immobile: Immobile = data
                console.log(immobile)
                const resAdd = await handleAddImmobile(immobile).then(res => res)
                if (resAdd === 0) {
                    resPOST = { ...resPOST, status: "ERROR" }
                } else {
                    resPOST = { ...resPOST, status: "SUCCESS", id: resAdd }
                }
                /*
                */
            } else {
                resPOST = { ...resPOST, status: "ERROR", message: "Token invalido!" }
            }
            res.status(200).json(resPOST)
            break
        case "DELETE":
            let resDELETE = { status: "ERROR", error: {}, message: "" }
            try {
                const { token, id } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    const resDelete = await handleDelete(id).then(res => res)
                    if (resDelete) {
                        resDELETE = { ...resDELETE, status: "SUCCESS" }
                    } else {
                        resDELETE = { ...resDELETE, status: "ERROR" }
                    }
                } else {
                    resDELETE = { ...resDELETE, status: "ERROR", message: "Token invalido!" }
                }
            } catch (err) {
                console.error(err)
                resDELETE = { ...resDELETE, status: "ERROR", error: err }
            }
            res.status(200).json(resDELETE)
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
