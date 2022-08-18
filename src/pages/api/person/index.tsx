import { PersonConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, HISTORY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data, history } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""
                    {/*
                    const querySnapshot = await getDocs(personCollection)
                    querySnapshot.forEach((doc) => {
                        const cpf = doc.data().cpf
                        if (doc.id && data.cpf === cpf) {
                            nowID = doc.id
                        }
                    })
                */}
                    const isSave = nowID === ""
                    if (isSave) {
                        const docRef = await addDoc(personCollection, PersonConversor.toFirestore(data))
                        nowID = docRef.id
                    } else {
                        const docRef = doc(personCollection, nowID)
                        await updateDoc(docRef, PersonConversor.toFirestore(data))
                    }
                    if (history) {
                        const dataForHistory = { ...PersonConversor.toFirestore(data), databaseid: nowID, databasename: PERSON_COLLECTION_NAME }
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
