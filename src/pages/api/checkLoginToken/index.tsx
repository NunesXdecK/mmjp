import { handlePrepareLoginTokenForDB } from "../login"
import { handleNewDateToUTC } from "../../../util/dateUtils"
import { LoginTokenConversor, UserConversor } from "../../../db/converters"
import { User, LoginToken, defaultLoginToken } from "../../../interfaces/objectInterfaces"
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { db, LOGIN_TOKEN_COLLECTION_NAME, USER_COLLECTION_NAME } from "../../../db/firebaseDB"

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
                let { token } = JSON.parse(body)
                let loginToken: LoginToken = defaultLoginToken
                if (token) {

                    const nowTime = handleNewDateToUTC()
                    const queryLoginToken = query(loginTokenCollection,
                        where("token", "==", token),
                        where("validationDue", ">", nowTime),
                        where("isBlocked", "==", false)
                    )
                    const querySnapshot = await getDocs(queryLoginToken)
                    querySnapshot.forEach((doc) => {
                        loginToken = doc.data()
                    })
                    if (loginToken?.id?.length > 0 && loginToken?.user?.id?.length > 0) {
                        const userDocRef = doc(userCollection, loginToken.user.id)
                        const loginTokenDoc = doc(loginTokenCollection, loginToken.id)
                        let user: User = (await getDoc(userDocRef)).data()
                        loginToken = handlePrepareLoginTokenForDB(loginToken)
                        await updateDoc(loginTokenDoc, LoginTokenConversor.toFirestore(loginToken))
                        resPOST = {
                            ...resPOST,
                            isAuth: true,
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
