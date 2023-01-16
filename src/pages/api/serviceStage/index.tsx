import { ProjectConversor, ServiceConversor, ServiceStageConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db, HISTORY_COLLECTION_NAME, PROJECT_COLLECTION_NAME, SERVICE_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"
import { Project, Service, ServiceStage } from "../../../interfaces/objectInterfaces"
import { handleNewDateToUTC } from "../../../util/dateUtils"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            let { token, data, history } = JSON.parse(body)
            let serviceStage: ServiceStage = {}
            if (token === "tokenbemseguro") {
                /*
                try {
                    serviceStage = data
                    let nowID = data?.id ?? ""
                    const isSave = nowID === ""
                    if (serviceStage?.priorityView) {
                        delete serviceStage.priorityView
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
                if (serviceStage.status === "PENDENTE" && serviceStage.service?.id?.length > 0) {
                    const docRef = doc(serviceCollection, serviceStage.service?.id)
                    let service: Service = (await getDoc(docRef)).data()
                    if (service.id?.length > 0 && service.status !== "PENDENTE") {
                        service = { ...service, status: "PENDENTE", dateLastUpdateUTC: handleNewDateToUTC() }
                        await updateDoc(docRef, ServiceConversor.toFirestore(service))
                        if (history) {
                            const serviceDataForHistory = { ...ServiceConversor.toFirestore(service), databaseid: service.id, databasename: SERVICE_COLLECTION_NAME }
                            await addDoc(historyCollection, serviceDataForHistory)
                        }
                        if (service.project?.id?.length > 0) {
                            const projectDocRef = doc(projectCollection, service.project.id)
                            let project: Project = (await getDoc(projectDocRef)).data()
                            if (project.id?.length > 0 && project.status !== "PENDENTE") {
                                project = { ...project, status: "PENDENTE", dateLastUpdateUTC: handleNewDateToUTC() }
                                await updateDoc(projectDocRef, ProjectConversor.toFirestore(project))
                                if (history) {
                                    const projectDataForHistory = { ...ProjectConversor.toFirestore(project), databaseid: project.id, databasename: PROJECT_COLLECTION_NAME }
                                    await addDoc(historyCollection, projectDataForHistory)
                                }
                            }
                        }
                    }
                    try {
                    } catch (err) {
                        console.error(err)
                        resPOST = { ...resPOST, status: "ERROR", error: err }
                    }
                }
                */
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
