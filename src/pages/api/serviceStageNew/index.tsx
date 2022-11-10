import { ServiceConversor, ServiceStageConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, HISTORY_COLLECTION_NAME, SERVICE_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"
import { ServiceStage } from "../../../interfaces/objectInterfaces"
import { handleNewDateToUTC } from "../../../util/dateUtils"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            let { token, data, history } = JSON.parse(body)
            let serviceStage: ServiceStage = {}
            if (token === "tokenbemseguro") {
                try {
                    serviceStage = data
                    let nowID = data?.id ?? ""
                    const isSave = nowID === ""
                    if (serviceStage?.dateString) {
                        delete serviceStage.dateString
                    }
                    if (serviceStage?.priorityView) {
                        delete serviceStage.priority
                    }
                    if (isSave) {
                        serviceStage = { ...serviceStage, dateInsertUTC: handleNewDateToUTC() }
                        const docRef = await addDoc(serviceStageCollection, ServiceStageConversor.toFirestore(serviceStage))
                        nowID = docRef.id
                    } else {
                        serviceStage = { ...serviceStage, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(serviceStageCollection, nowID)
                        await updateDoc(docRef, ServiceStageConversor.toFirestore(serviceStage))
                    }
                    if (history) {
                        const dataForHistory = { ...ServiceStageConversor.toFirestore(serviceStage), databaseid: nowID, databasename: SERVICE_STAGE_COLLECTION_NAME }
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
                    const docRef = doc(serviceStageCollection, id)
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
