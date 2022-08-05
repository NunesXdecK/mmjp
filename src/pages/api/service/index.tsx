import { Service } from "../../../interfaces/objectInterfaces"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { ProfessionalConversor, ProjectConversor, ServiceConversor } from "../../../db/converters"
import { db, HISTORY_COLLECTION_NAME, SERVICE_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME, PROJECT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data } = JSON.parse(body)
                let service: Service = data
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""
                    if (service.responsible?.id && service.responsible?.id?.length) {
                        const docRef = doc(professionalCollection, service.responsible.id)
                        service = { ...service, responsible: docRef }
                    } else {
                        service = { ...service, responsible: {} }
                    }
                    if (service.project?.id && service.project?.id?.length) {
                        const docRef = doc(projectCollection, service.project.id)
                        service = { ...service, project: docRef }
                    } else {
                        service = { ...service, project: {} }
                    }
                    const isSave = nowID === ""
                    if (isSave) {
                        const docRef = await addDoc(serviceCollection, ServiceConversor.toFirestore(service))
                        nowID = docRef.id
                    } else {
                        const docRef = doc(serviceCollection, nowID)
                        await updateDoc(docRef, ServiceConversor.toFirestore(service))
                    }
                    const dataForHistory = { ...ServiceConversor.toFirestore(service), databaseid: nowID, databasename: SERVICE_COLLECTION_NAME }
                    await addDoc(historyCollection, dataForHistory)
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
                    const docRef = doc(serviceCollection, id)
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
