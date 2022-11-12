import { handleNewDateToUTC } from "../../../util/dateUtils"
import { Service, ServiceStage } from "../../../interfaces/objectInterfaces"
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { ServiceConversor, ServiceStageConversor } from "../../../db/converters"
import { db, HISTORY_COLLECTION_NAME, SERVICE_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)

    switch (method) {
        case 'POST':
            let resGET = { status: "ERROR", error: {}, data: "" }
            let { token, id } = JSON.parse(body)
            try {
                if (token === "tokenbemseguro" && id?.length > 0) {
                    const docRef = doc(serviceCollection, id)
                    let service: Service = (await getDoc(docRef)).data()
                    let status = service.status

                    if (service.id?.length > 0) {
                        let isFinish = false
                        let isPendency = false
                        let isExecuting = false
                        const queryServiceStages = query(serviceStageCollection,
                            where("service", "==", { id: service.id })
                        )
                        const querySnapshot = await getDocs(queryServiceStages)
                        querySnapshot.forEach((doc) => {
                            const serviceStage: ServiceStage = doc.data()
                            if (serviceStage.status === "PENDENTE") {
                                isPendency = true
                            } else if (serviceStage.status === "EM ANDAMENTO") {
                                isExecuting = true
                            } else if (serviceStage.status === "FINALIZADO") {
                                isFinish = true
                            }
                        })
                        if (isFinish) {
                            service = { ...service, status: "FINALIZADO" }
                        }
                        if (isExecuting) {
                            service = { ...service, status: "EM ANDAMENTO" }
                        }
                        if (isPendency) {
                            service = { ...service, status: "PENDENTE" }
                        }
                    }
                    if (service.id?.length > 0 && status !== service.status) {
                        service = { ...service, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(serviceCollection, service.id)
                        await updateDoc(docRef, ServiceConversor.toFirestore(service))
                        const dataForHistory = { ...ServiceConversor.toFirestore(service), databaseid: service.id, databasename: SERVICE_COLLECTION_NAME }
                        await addDoc(historyCollection, dataForHistory)
                    }
                    resGET = { status: "SUCCESS", error: {}, data: status }
                }
            } catch (err) {
                console.error(err)
                resGET = { ...resGET, status: "ERROR", error: err }
            }
            res.status(200).json(resGET)
            break
        default:
            res.setHeader("Allow", ["POST"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
