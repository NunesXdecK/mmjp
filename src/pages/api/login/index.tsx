import { v4 as uuid } from "uuid"
import prisma from "../../../prisma/prisma"
import { handleNewDateToUTC } from "../../../util/dateUtils"
import { User, defaultUser, LoginToken, defaultLoginToken } from "../../../interfaces/objectInterfaces"

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))

export const handlePrepareLoginTokenForDB = (loginToken: LoginToken) => {
    if (loginToken.user?.id > 0) {
        loginToken = { ...loginToken, user: loginToken.user.id }
    } else {
        loginToken = { ...loginToken, user: null }
    }
    return loginToken
}

export default async function handler(req, res) {
    const { method, body } = req
    switch (method) {
        case 'POST':
            let resPOST = { status: "ERROR", error: {}, message: "", isAuth: false, data: {}, token: "" }
            const { username, password } = JSON.parse(body)
            try {
                //await delay()
                let user: User = defaultUser
                user = await prisma.user.findFirst({
                    where: {
                        isBlocked: false,
                        username: username,
                        password: password,
                    }
                })
                if (user?.id === 0) {
                    resPOST = { ...resPOST, status: "ERROR", message: "Usuário não encontrado." }
                    res.status(200).json(resPOST)
                }
                const data: any = {
                    token: uuid(),
                    userId: user.id,
                    validationDue: (handleNewDateToUTC() + (3600000 * 12)).toString(), //12 horas
                    isBlocked: false,
                }
                const resLoginToken = await prisma.loginToken.create({
                    data: data,
                })
                if (res?.id === 0) {
                    resPOST = { ...resPOST, status: "ERROR", message: "Problema ao criar o token." }
                    res.status(200).json(resPOST)
                }
                resPOST = {
                    ...resPOST,
                    isAuth: true,
                    token: data.token,
                    status: "SUCCESS",
                    data: { ...user, password: "" },
                }
            } catch (err) {
                console.error(err)
                resPOST = { ...resPOST, status: "ERROR", error: err }
            }
            res.status(200).json(resPOST)
            break
        default:
            res.setHeader("Allow", ["POST"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
