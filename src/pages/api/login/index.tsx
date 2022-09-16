import { v4 as uuid } from "uuid"
import { handleNewDateToUTC } from "../../../util/dateUtils"
import { handlePrepareLoginTokenForDB } from "../../../util/converterUtil"
import { LoginTokenConversor, UserConversor } from "../../../db/converters"
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"
import { db, LOGIN_TOKEN_COLLECTION_NAME, USER_COLLECTION_NAME } from "../../../db/firebaseDB"
import { User, defaultUser, LoginToken, defaultLoginToken } from "../../../interfaces/objectInterfaces"

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))

export default async function handler(req, res) {
    const { method, body } = req
    const userCollection = collection(db, USER_COLLECTION_NAME).withConverter(UserConversor)
    const loginTokenCollection = collection(db, LOGIN_TOKEN_COLLECTION_NAME).withConverter(LoginTokenConversor)

    switch (method) {
        case 'POST':
            let resPOST = { status: "ERROR", error: {}, message: "", isAuth: false, data: {}, token: "" }
            try {
                //await delay()
                let { username, password } = JSON.parse(body)
                let user: User = defaultUser
                const queryUser = query(userCollection,
                    where("isBlocked", "==", false),
                    where("username", "==", username),
                    where("password", "==", password)
                )
                const querySnapshot = await getDocs(queryUser)
                querySnapshot.forEach((doc) => {
                    user = doc.data()
                })
                if (user?.id?.length > 0) {
                    let loginToken: LoginToken = handlePrepareLoginTokenForDB({
                        ...defaultLoginToken,
                        token: uuid(),
                        user: { id: user.id },
                        validationDue: handleNewDateToUTC() + (3600000 * 12), //12 horas
                    })
                    const docRef = await addDoc(loginTokenCollection, LoginTokenConversor.toFirestore(loginToken))
                    if (docRef?.id?.length) {
                        resPOST = {
                            ...resPOST,
                            isAuth: true,
                            token: loginToken.token,
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
