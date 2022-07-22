import { ProjectConversor, ProjectPaymentConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, HISTORY_COLLECTION_NAME, PROJECT_COLLECTION_NAME, PROJECT_PAYMENT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const projectPaymentCollection = collection(db, PROJECT_PAYMENT_COLLECTION_NAME).withConverter(ProjectPaymentConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""
                    const isSave = nowID === ""
                    if (data.project?.id && data.project.id !== "") {
                        const projectDocRef = doc(projectCollection, data.project.id)
                        if (projectDocRef) {
                            data = { ...data, project: projectDocRef }
                            if (isSave) {
                                const docRef = await addDoc(projectPaymentCollection, ProjectPaymentConversor.toFirestore(data))
                                nowID = docRef.id
                            } else {
                                const docRef = doc(projectPaymentCollection, nowID)
                                await updateDoc(docRef, ProjectPaymentConversor.toFirestore(data))
                            }
                            const dataForHistory = { ...ProjectPaymentConversor.toFirestore(data), databaseid: nowID, databasename: PROJECT_PAYMENT_COLLECTION_NAME }
                            await addDoc(historyCollection, dataForHistory)
                            resPOST = { ...resPOST, status: "SUCCESS", id: nowID }
                        } else {
                            resPOST = { ...resPOST, status: "ERROR", message: "Projeto não vinculado!" }
                        }
                    } else {
                        resPOST = { ...resPOST, status: "ERROR", message: "Projeto não vinculado!" }
                    }
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
                    const docRef = doc(projectPaymentCollection, id)
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
