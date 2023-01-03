import { v4 as uuid } from "uuid"
import prisma from "../../../prisma/prisma"
import { handleNewDateToUTC } from "../../../util/dateUtils"
import { User, defaultUser, LoginToken, defaultLoginToken } from "../../../interfaces/objectInterfaces"

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))

export const handlePrepareLoginTokenForDB = (loginToken: LoginToken) => {
    if (loginToken.dateInsertUTC === 0) {
        loginToken = { ...loginToken, dateInsertUTC: handleNewDateToUTC() }
    }
    if (loginToken && "id" in loginToken && loginToken.id.length) {
        loginToken = { ...loginToken, dateLastUpdateUTC: handleNewDateToUTC() }
    }
    if (loginToken.user?.id?.length) {
        loginToken = { ...loginToken, user: { id: loginToken.user.id } }
    } else {
        loginToken = { ...loginToken, user: {} }
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
                        username: username,
                        password: password,
                    }
                })
                console.log(user)
                if (user?.id > 0) {
                    const data: any = handlePrepareLoginTokenForDB({
                        ...defaultLoginToken,
                        token: uuid(),
                        user: user.id,
                        validationDue: (handleNewDateToUTC() + (3600000 * 12)).toString(), //12 horas
                    })
                    const res = await prisma.loginToken.create({
                        data: data,
                    })
                    console.log(res)
                    if (res?.id > 0) {
                        resPOST = {
                            ...resPOST,
                            isAuth: true,
                            token: data.token,
                            status: "SUCCESS",
                            data: { ...user, password: "" },
                        }
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
