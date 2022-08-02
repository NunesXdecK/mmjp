import { ServiceConversor, ServicePaymentConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, HISTORY_COLLECTION_NAME, SERVICE_COLLECTION_NAME, SERVICE_PAYMENT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const servicePaymentCollection = collection(db, SERVICE_PAYMENT_COLLECTION_NAME).withConverter(ServicePaymentConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""
                    const isSave = nowID === ""
                    if (data.service?.id && data.service.id !== "") {
                        const serviceDocRef = doc(serviceCollection, data.service.id)
                        if (serviceDocRef) {
                            data = { ...data, service: serviceDocRef }
                            if (isSave) {
                                const docRef = await addDoc(servicePaymentCollection, ServicePaymentConversor.toFirestore(data))
                                nowID = docRef.id
                            } else {
                                const docRef = doc(servicePaymentCollection, nowID)
                                await updateDoc(docRef, ServicePaymentConversor.toFirestore(data))
                            }
                            const dataForHistory = { ...ServicePaymentConversor.toFirestore(data), databaseid: nowID, databasename: SERVICE_PAYMENT_COLLECTION_NAME }
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
                    const docRef = doc(servicePaymentCollection, id)
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
