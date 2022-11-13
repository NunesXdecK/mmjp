import { ImmobileConversor } from "../../../db/converters"
import { handleNewDateToUTC } from "../../../util/dateUtils"
import { Immobile } from "../../../interfaces/objectInterfaces"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, HISTORY_COLLECTION_NAME, IMMOBILE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const immobileCollection = collection(db, IMMOBILE_COLLECTION_NAME).withConverter(ImmobileConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            let { token, data, history } = JSON.parse(body)
            if (token === "tokenbemseguro") {
                let nowID = data?.id ?? ""
                let immobile: Immobile = data
                try {
                    if (immobile.oldData) {
                        delete immobile.oldData
                    }
                    const isSave = nowID === ""
                    if (isSave) {
                        immobile = { ...immobile, dateInsertUTC: handleNewDateToUTC() }
                        const docRef = await addDoc(immobileCollection, ImmobileConversor.toFirestore(immobile))
                        nowID = docRef.id
                    } else {
                        immobile = { ...immobile, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(immobileCollection, nowID)
                        await updateDoc(docRef, ImmobileConversor.toFirestore(immobile))
                    }
                    if (history) {
                        const dataForHistory = { ...ImmobileConversor.toFirestore(immobile), databaseid: nowID, databasename: IMMOBILE_COLLECTION_NAME }
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
                    const docRef = doc(immobileCollection, id)
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
