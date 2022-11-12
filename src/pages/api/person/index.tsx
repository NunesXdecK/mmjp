import { PersonConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, HISTORY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"
import { Person } from "../../../interfaces/objectInterfaces"
import { handleNewDateToUTC } from "../../../util/dateUtils"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            let { token, data, history } = JSON.parse(body)
            if (token === "tokenbemseguro") {
                let nowID = data?.id ?? ""
                const isSave = nowID === ""
                let person: Person = data
                try {
                    if (person.oldData) {
                        delete person.oldData
                    }
                    if (isSave) {
                        person = { ...person, dateInsertUTC: handleNewDateToUTC() }
                        const docRef = await addDoc(personCollection, PersonConversor.toFirestore(person))
                        nowID = docRef.id
                    } else {
                        person = { ...person, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(personCollection, nowID)
                        await updateDoc(docRef, PersonConversor.toFirestore(person))
                    }
                    if (history) {
                        const dataForHistory = { ...PersonConversor.toFirestore(person), databaseid: nowID, databasename: PERSON_COLLECTION_NAME }
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
                    const docRef = doc(personCollection, id)
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
