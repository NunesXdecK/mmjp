import { UserConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, USER_COLLECTION_NAME, HISTORY_COLLECTION_NAME } from "../../../db/firebaseDB"
import { User } from "../../../interfaces/objectInterfaces"
import { handleNewDateToUTC } from "../../../util/dateUtils"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const userCollection = collection(db, USER_COLLECTION_NAME).withConverter(UserConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            let { token, data, history } = JSON.parse(body)
            if (token === "tokenbemseguro") {
                let nowID = data?.id ?? ""
                const isSave = nowID === ""
                let user: User = data
                try {
                    if (user.passwordConfirm) {
                        delete user.passwordConfirm
                    }
                    if (isSave) {
                        user = { ...user, dateInsertUTC: handleNewDateToUTC() }
                        const docRef = await addDoc(userCollection, UserConversor.toFirestore(user))
                        nowID = docRef.id
                    } else {
                        user = { ...user, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(userCollection, nowID)
                        await updateDoc(docRef, UserConversor.toFirestore(user))
                    }
                    if (history) {
                        const dataForHistory = { ...UserConversor.toFirestore(user), databaseid: nowID, databasename: USER_COLLECTION_NAME }
                        await addDoc(historyCollection, dataForHistory)
                    }
                    resPOST = { ...resPOST, status: "SUCCESS", id: nowID }
                } catch (err) {
                    console.error(err)
                    resPOST = { ...resPOST, status: "ERROR", error: err }
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
                    const docRef = doc(userCollection, id)
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
