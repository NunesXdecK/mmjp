import prisma from "../../../prisma/prisma"
import { User } from "../../../interfaces/objectInterfaces"

const handleAddUser = async (user: User) => {
    if (!user) {
        return 0
    }
    let data: any = {
        email: user.email,
        office: user.office,
        username: user.username,
        password: user.password,
        personId: user.personId,
        isBlocked: user.isBlocked,
        description: user.description,
    }
    let id = user?.id ?? 0
    try {
        if (user?.id === 0) {
            id = await prisma.user.create({
                data: data,
            }).then(res => res.id)
        } else if (user?.id > 0) {
            id = await prisma.user.update({
                where: { id: user.id },
                data: data,
            }).then(res => res.id)
        }
    } catch (error) {
        console.error(error)
    }
    return id
}

const handleDelete = async (id: number) => {
    try {
        await prisma.user.delete({
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
                let user: User = data
                const resAdd = await handleAddUser(user).then(res => res)
                if (resAdd === 0) {
                    resPOST = { ...resPOST, status: "ERROR" }
                } else {
                    resPOST = { ...resPOST, status: "SUCCESS", id: resAdd }
                }
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
