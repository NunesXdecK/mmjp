import { handleNewDateToUTC } from "../../../util/dateUtils"
import { Project } from "../../../interfaces/objectInterfaces"
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { ProjectConversor, ServiceConversor, PaymentConversor, ServiceStageConversor } from "../../../db/converters"
import { db, HISTORY_COLLECTION_NAME, PROJECT_COLLECTION_NAME, SERVICE_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME, PAYMENT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const paymentCollection = collection(db, PAYMENT_COLLECTION_NAME).withConverter(PaymentConversor)
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data, history } = JSON.parse(body)
                let project: Project = data
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""
                    if (project.dateString) {
                        delete project.dateString
                    }
                    if (project.priorityView) {
                        delete project.priorityView
                    }
                    if (project.oldData) {
                        delete project.oldData
                    }
                    const isSave = nowID === ""
                    if (isSave) {
                        project = { ...project, dateInsertUTC: handleNewDateToUTC() }
                        const docRef = await addDoc(projectCollection, ProjectConversor.toFirestore(project))
                        nowID = docRef.id
                    } else {
                        project = { ...project, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(projectCollection, nowID)
                        await updateDoc(docRef, ProjectConversor.toFirestore(project))
                    }
                    if (history) {
                        const dataForHistory = { ...ProjectConversor.toFirestore(project), databaseid: nowID, databasename: PROJECT_COLLECTION_NAME }
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
                    let listServices = []
                    let listPayments = []
                    const projectDocRef = doc(projectCollection, id)
                    const queryService = query(serviceCollection, where("project", "==", { id: id }))
                    const querySnapshot = await getDocs(queryService)
                    querySnapshot.forEach((doc) => {
                        listServices = [...listServices, doc.data()]
                    })
                    const queryPayments = query(paymentCollection, where("project", "==", { id: id }))
                    const queryPaymentsSnapshot = await getDocs(queryPayments)
                    queryPaymentsSnapshot.forEach((doc) => {
                        listPayments = [...listPayments, doc.data()]
                    })
                    await Promise.all(
                        listPayments.map(async (elementPayment, index) => {
                            const paymentDocRef = doc(paymentCollection, elementPayment.id)
                            await deleteDoc(paymentDocRef)
                        })
                    )
                    await Promise.all(
                        listServices.map(async (element, index) => {
                            const serviceDocRef = doc(serviceCollection, element.id)
                            let listStages = []
                            const queryStages = query(serviceStageCollection, where("service", "==", { id: element.id }))
                            const queryStagesSnapshot = await getDocs(queryStages)
                            queryStagesSnapshot.forEach((doc) => {
                                listStages = [...listStages, doc.data()]
                            })
                            listStages.map(async (elementStage, index) => {
                                const stageDocRef = doc(serviceStageCollection, elementStage.id)
                                await deleteDoc(stageDocRef)
                            })
                            await deleteDoc(serviceDocRef)
                        })
                    )
                    await deleteDoc(projectDocRef)
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
