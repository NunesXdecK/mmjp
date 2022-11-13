import { ProfessionalConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, PROFESSIONAL_COLLECTION_NAME, HISTORY_COLLECTION_NAME } from "../../../db/firebaseDB"
import { Professional } from "../../../interfaces/objectInterfaces"
import { handleNewDateToUTC } from "../../../util/dateUtils"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            let { token, data, history } = JSON.parse(body)
            if (token === "tokenbemseguro") {
                let nowID = data?.id ?? ""
                const isSave = nowID === ""
                let professional: Professional = data
                try {
                    if (professional.oldData) {
                        delete professional.oldData
                    }
                    if (isSave) {
                        professional = { ...professional, dateInsertUTC: handleNewDateToUTC() }
                        const docRef = await addDoc(professionalCollection, ProfessionalConversor.toFirestore(professional))
                        nowID = docRef.id
                    } else {
                        professional = { ...professional, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(professionalCollection, nowID)
                        await updateDoc(docRef, ProfessionalConversor.toFirestore(professional))
                    }
                    if (history) {
                        const dataForHistory = { ...ProfessionalConversor.toFirestore(professional), databaseid: nowID, databasename: PROFESSIONAL_COLLECTION_NAME }
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
                    const docRef = doc(professionalCollection, id)
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
