import prisma from "../../../prisma/prisma"
import { Immobile } from "../../../interfaces/objectInterfaces"

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
    let dataAddress: any = [{
        cep: immobile?.address?.cep,
        number: immobile?.address?.number,
        county: immobile?.address?.county,
        district: immobile?.address?.district,
        complement: immobile?.address?.complement,
        publicPlace: immobile?.address?.publicPlace,
    }]
    let dataOwners = []
    immobile?.owners?.map(async (element, index) => {
        dataOwners = [
            ...dataOwners,
            {
                personId: "cpf" in element ? element.id : null,
                companyId: "cnpj" in element ? element.id : null,
            }]
    })
    let dataPoints = []
    immobile?.points?.map(async (element, index) => {
        dataPoints = [
            ...dataPoints,
            {
                personId: "cpf" in element ? element.id : null,
                companyId: "cnpj" in element ? element.id : null,
            }]
    })
    let id = immobile?.id ?? 0
    try {
        if (id === 0) {
            data = {
                ...data,
                address: { create: [...dataAddress] },
                immobileOwner: { create: [...dataOwners] },
                immobilePoint: {
                    create: {
                        data: [...dataOwners],
                        include: {
                            point: true
                        }
                    }
                },
            }
            id = await prisma.immobile.create({
                data: {
                    ...data,
                },
                include: {
                    address: true,
                    immobileOwner: true,
                    ImmobilePoint: true,
                },
            }).then(res => res.id)
        } else if (id > 0) {
            data = {
                ...data,
                address: {
                    updateMany: {
                        data: dataAddress[0],
                        where: { immobileId: id },
                    }
                },
            }
            id = await prisma.immobile.update({
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
        await prisma.immobilePoint.deleteMany({
            where: { immobileId: id },
        })
        await prisma.immobileOwner.deleteMany({
            where: { immobileId: id },
        })
        await prisma.address.deleteMany({
            where: { immobileId: id },
        })
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
                /*
                const resAdd = await handleAddImmobile(immobile).then(res => res)
                if (resAdd === 0) {
                    resPOST = { ...resPOST, status: "ERROR" }
                } else {
                    resPOST = { ...resPOST, status: "SUCCESS", id: resAdd }
                }
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
