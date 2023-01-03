import prisma from "../../../prisma/prisma"

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))

export default async function handler(req, res) {
    const { method, body } = req

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", isAuth: false, data: {}, token: "" }
            try {
                //await delay()
                const admin = await prisma.user.findFirst({
                    where: {
                        username: "admin",
                        isBlocked: false,
                    }
                })
                if (admin === null) {
                    const adminPerson = await prisma.person.create({
                        data: {
                            name: "admin",
                            cpf: "00000000000",
                            clientCode: 0,
                        }
                    })
                    if (adminPerson.id > 0) {
                        await prisma.user.create({
                            data: {
                                username: "admin",
                                password: "admin",
                                email: "admin@admin",
                                office: "administrador",
                                isBlocked: false,
                                personId: adminPerson.id,
                            }
                        })
                    }
                }
                const guest = await prisma.user.findFirst({
                    where: {
                        username: "visitante",
                        isBlocked: false,
                    }
                })
                if (guest === null) {
                    const guestPerson = await prisma.person.create({
                        data: {
                            name: "visitante",
                            cpf: "00000000001",
                            clientCode: 1,
                        }
                    })
                    if (guestPerson.id > 0) {
                        await prisma.user.create({
                            data: {
                                office: "visitante",
                                username: "visitante",
                                password: "visitante",
                                email: "visitante@visitante",
                                isBlocked: false,
                                personId: guestPerson.id,
                            }
                        })
                    }
                }
                resGET = {
                    ...resGET,
                    status: "SUCCESS",
                }
            } catch (err) {
                console.error(err)
                resGET = { ...resGET, status: "ERROR", error: err }
            }
            res.status(200).json(resGET)
            break
        default:
            res.setHeader("Allow", ["GET"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
