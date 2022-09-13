import { UserConversor, PersonConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, USER_COLLECTION_NAME, PERSON_COLLECTION_NAME, HISTORY_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const userCollection = collection(db, USER_COLLECTION_NAME).withConverter(UserConversor)
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data, history } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""
                    if (data.person && "id" in data.person && data.person?.id.length) {
                        /*
                        const docRef = doc(personCollection, data.person.id)
                        data = { ...data, person: docRef }
                        */
                        data = { ...data, person: { id: data.person.id } }
                    }
                    const isSave = nowID === ""
                    if (isSave) {
                        const docRef = await addDoc(userCollection, UserConversor.toFirestore(data))
                        nowID = docRef.id
                    } else {
                        const docRef = doc(userCollection, nowID)
                        await updateDoc(docRef, UserConversor.toFirestore(data))
                    }
                    if (history) {
                        const dataForHistory = { ...UserConversor.toFirestore(data), databaseid: nowID, databasename: USER_COLLECTION_NAME }
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
