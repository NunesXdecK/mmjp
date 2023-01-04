import prisma from "../../../prisma/prisma"
import { handleNewDateToUTC } from "../../../util/dateUtils"
import { LoginToken, User, defaultLoginToken } from "../../../interfaces/objectInterfaces"

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))

export default async function handler(req, res) {
    const { method, body } = req

    switch (method) {
        case 'POST':
            let resPOST = { status: "ERROR", error: {}, message: "", isAuth: false, data: {}, token: "" }
            let { token } = JSON.parse(body)
            let loginToken: LoginToken = defaultLoginToken
            try {
                //await delay()
                if (token) {
                    let notExpired = false
                    const nowTime = handleNewDateToUTC()
                    loginToken = await prisma.loginToken.findFirst({
                        where: {
                            token: token,
                            isBlocked: false,
                        }
                    })
                    if (!loginToken || loginToken?.id === 0) {
                        resPOST = { ...resPOST, status: "ERROR", message: "Token não encontrado." }
                        res.status(200).json(resPOST)
                        return
                    }
                    if (parseInt(loginToken?.validationDue)) {
                        notExpired = nowTime < parseInt(loginToken?.validationDue)
                    }
                    if (!notExpired) {
                        resPOST = { ...resPOST, status: "ERROR", message: "Token expirado." }
                        res.status(200).json(resPOST)
                        return
                    }
                    let user: User = await prisma.user.findFirst({
                        where: {
                            isBlocked: false,
                            id: loginToken.userId,
                        }
                    })
                    if (user.id === 0) {
                        resPOST = { ...resPOST, status: "ERROR", message: "Usuário não encontrado." }
                        res.status(200).json(resPOST)
                        return
                    }
                    resPOST = {
                        ...resPOST,
                        isAuth: true,
                        status: "SUCCESS",
                        data: { ...user, password: "" },
                    }
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
