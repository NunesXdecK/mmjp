import { ProfessionalConversor, ServiceConversor, ServicePaymentConversor, ServiceStageConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { db, HISTORY_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME, SERVICE_COLLECTION_NAME, SERVICE_PAYMENT_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"
import { Service, ServicePayment, ServiceStage } from "../../../interfaces/objectInterfaces"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)
    const servicePaymentCollection = collection(db, SERVICE_PAYMENT_COLLECTION_NAME).withConverter(ServicePaymentConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data, history, changeProject } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""
                    const isSave = nowID === ""
                    if (data.service && "id" in data.service && data.service.id?.length) {
                        const serviceDocRef = doc(serviceCollection, data.service.id)
                        if (serviceDocRef) {
                            if (data.responsible && "id" in data.responsible && data.responsible?.id?.length) {
                                /*
                                const docRef = doc(professionalCollection, data.responsible.id)
                                data = { ...data, responsible: docRef }
                                */
                                data = { ...data, responsible: { id: data.responsible.id } }
                            }
                            data = { ...data, service: { id: data.service.id } }
                            if (isSave) {
                                const docRef = await addDoc(serviceStageCollection, ServiceStageConversor.toFirestore(data))
                                nowID = docRef.id
                            } else {
                                const docRef = doc(serviceStageCollection, nowID)
                                await updateDoc(docRef, ServiceStageConversor.toFirestore(data))
                            }
                            if (history) {
                                const dataForHistory = { ...ServiceStageConversor.toFirestore(data), databaseid: nowID, databasename: SERVICE_STAGE_COLLECTION_NAME }
                                await addDoc(historyCollection, dataForHistory)
                            }

                            if (changeProject && (data?.status === "NORMAL" || data?.status === "FINALIZADO")) {
                                let docRef = await doc(serviceCollection, data?.service?.id)
                                let service: Service = (await getDoc(docRef)).data()
                                let saveStatus = service.status
                                let isStatusDiferent = saveStatus !== data.status
                                if (isStatusDiferent) {
                                    let isFinish = true
                                    const queryServiceStage = query(serviceStageCollection, where("service", "==", { id: data?.service?.id }))
                                    const querySnapshotStage = await getDocs(queryServiceStage)
                                    querySnapshotStage.forEach((doc) => {
                                        let s: ServiceStage = doc.data()
                                        if (s?.status !== "FINALIZADO") {
                                            isFinish = false
                                        }
                                    })
                                    const queryServicePayment = query(servicePaymentCollection, where("service", "==", { id: data?.service?.id }))
                                    const querySnapshotPayment = await getDocs(queryServicePayment)
                                    querySnapshotPayment.forEach((doc) => {
                                        let s: ServicePayment = doc.data()
                                        if (s?.status !== "FINALIZADO") {
                                            isFinish = false
                                        }
                                    })
                                    if (isFinish) {
                                        service = { ...service, status: "FINALIZADO" }
                                    } else {
                                        service = { ...service, status: "NORMAL" }
                                    }
                                    if (saveStatus !== service.status) {
                                        await updateDoc(docRef, ServiceConversor.toFirestore(service))
                                        if (history) {
                                            const dataForHistory = { ...ServiceConversor.toFirestore(service), databaseid: service.id, databasename: SERVICE_COLLECTION_NAME }
                                            await addDoc(historyCollection, dataForHistory)
                                        }
                                    }
                                }
                            }
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
