import { PersonConversor } from "../../../db/converters"
import { handleNewDateToUTC } from "../../../util/dateUtils"
import { Person } from "../../../interfaces/objectInterfaces"
import { db, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"
import { handlePreparePersonForDB } from "../../../util/converterUtil"
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"

export default async function handler(req, res) {
    const { query, method, body } = req
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    switch (method) {
        case "POST":
            try {
                let data: Person = JSON.parse(body)
                data = handlePreparePersonForDB(data)
                let nowID = data?.id ?? ""
                const querySnapshot = await getDocs(personCollection)
                querySnapshot.forEach((doc) => {
                    const cpf = doc.data().cpf
                    if (doc.id && data.cpf === cpf) {
                        nowID = doc.id
                    }
                })
                const isSave = nowID === ""
                if (isSave) {
                    const docRef = await addDoc(personCollection, data)
                    nowID = docRef.id
                } else {
                    data = { ...data, dateLastUpdateUTC: handleNewDateToUTC() }
                    const docRef = doc(personCollection, nowID)
                    await updateDoc(docRef, data)
                }
                res.status(200).json(JSON.stringify({ status: "SUCCESS", id: nowID }))
            } catch (err) {
                res.status(200).json(JSON.stringify({ status: "ERROR" }))
            }
            break
        case "PUT":
            try {
                let data: Person = JSON.parse(body)
                data = handlePreparePersonForDB(data)
                let nowID = data?.id ?? ""
                if (nowID) {
                    data = { ...data, dateLastUpdateUTC: handleNewDateToUTC() }
                    const docRef = doc(personCollection, nowID)
                    await updateDoc(docRef, data)
                    res.status(200).json(JSON.stringify({ status: "SUCCESS", id: nowID }))
                } else {
                    res.status(200).json(JSON.stringify({ status: "ERROR", message: "Não há ID" }))
                }
            } catch (err) {
                res.status(200).json(JSON.stringify({ status: "ERROR" }))
            }
            break
        case "DELETE":
            try {
                const data = JSON.parse(body)
                const docRef = doc(personCollection, data.id)
                await deleteDoc(docRef)
                res.status(200).json(JSON.stringify({ status: "SUCCESS", body: body.id }))
            } catch (err) {
                res.status(200).json(JSON.stringify({ status: "ERROR" }))
            }
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
