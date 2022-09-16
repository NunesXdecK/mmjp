import { LoginTokenConversor, UserConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { db, LOGIN_TOKEN_COLLECTION_NAME, USER_COLLECTION_NAME, HISTORY_COLLECTION_NAME } from "../../../db/firebaseDB"
import { defaultLoginToken, LoginToken } from "../../../interfaces/objectInterfaces"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const userCollection = collection(db, USER_COLLECTION_NAME).withConverter(UserConversor)
    const loginTokenCollection = collection(db, LOGIN_TOKEN_COLLECTION_NAME).withConverter(LoginTokenConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data, history } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""
                    if (data.user && "id" in data.user && data.user?.id.length) {
                        /*
                        const docRef = doc(userCollection, data.user.id)
                        data = { ...data, user: docRef }
                        */
                        data = { ...data, user: { id: data.user.id } }
                    }
                    const isSave = nowID === ""
                    if (isSave) {
                        const docRef = await addDoc(loginTokenCollection, LoginTokenConversor.toFirestore(data))
                        nowID = docRef.id
                    } else {
                        const docRef = doc(loginTokenCollection, nowID)
                        await updateDoc(docRef, LoginTokenConversor.toFirestore(data))
                    }
                    if (history) {
                        const dataForHistory = { ...LoginTokenConversor.toFirestore(data), databaseid: nowID, databasename: LOGIN_TOKEN_COLLECTION_NAME }
                        await addDoc(historyCollection, dataForHistory)
                    }
                    resPOST = { ...resPOST, status: "SUCCESS", id: nowID }
                } else {
                    resPOST = { ...resPOST, status: "ERROR", message: "Token invalido!" }
                }
            } catch (err) {
                console.error(err)
                resPOST = { ...resPOST, status: "ERROR", error: err }
            }
            res.status(200).json(resPOST)
            break
        case "DELETE":
            let resDELETE = { status: "ERROR", error: {}, message: "" }
            try {
                const { token, id } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    let loginToken: LoginToken = defaultLoginToken
                    const queryLoginToken = query(loginTokenCollection,
                        where("token", "==", id)
                    )
                    const querySnapshot = await getDocs(queryLoginToken)
                    querySnapshot.forEach((doc) => {
                        loginToken = doc.data()
                    })
                    const docRef = doc(loginTokenCollection, loginToken?.id)
                    await deleteDoc(docRef)
                    resDELETE = { ...resDELETE, status: "SUCCESS" }
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
