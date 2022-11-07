import { Service } from "../../../interfaces/objectInterfaces"
import { handleRemoveCurrencyMask } from "../../../util/maskUtil"
import { handleGetDateFormatedToUTC, handleNewDateToUTC } from "../../../util/dateUtils"
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { ServiceConversor, ServicePaymentConversor, ServiceStageConversor } from "../../../db/converters"
import { db, HISTORY_COLLECTION_NAME, SERVICE_COLLECTION_NAME, SERVICE_PAYMENT_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)
    const servicePaymentCollection = collection(db, SERVICE_PAYMENT_COLLECTION_NAME).withConverter(ServicePaymentConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            let { token, data, history, changeProject } = JSON.parse(body)
            let serviceNowID = ""
            let service: Service = {}
            if (token === "tokenbemseguro") {
                try {
                    service = data
                    serviceNowID = data?.id ?? ""
                    if (service?.dateString?.length > 0) {
                        service = { ...service, dateDue: handleGetDateFormatedToUTC(service.dateString) }
                    }
                    if (service.dateDue === 0) {
                        service = { ...service, dateDue: handleNewDateToUTC() }
                    }
                    if (service.title?.length > 0) {
                        service = { ...service, title: service.title?.trim() }
                    }
                    if (service.value?.length > 0) {
                        service = { ...service, value: handleRemoveCurrencyMask(service.value) }
                    }
                    if (service.total?.length > 0) {
                        service = { ...service, total: handleRemoveCurrencyMask(service.total) }
                    }
                    if (service.description?.length > 0) {
                        service = { ...service, description: service.description?.trim() }
                    }
                    if (service.professional?.id?.length > 0) {
                        service = { ...service, professional: { id: service.professional.id } }
                    } else {
                        service = { ...service, professional: { id: "" } }
                    }
                    if (service.project?.id?.length > 0) {
                        service = { ...service, project: { id: service.project.id } }
                    } else {
                        service = { ...service, project: { id: "" } }
                    }
                    let immobilesTargetDocRefsForDB = []
                    let immobilesOriginDocRefsForDB = []
                    if (service.immobilesTarget?.length > 0) {
                        service.immobilesTarget?.map((element, index) => {
                            if (element.id?.length) {
                                immobilesTargetDocRefsForDB = [...immobilesTargetDocRefsForDB, { id: element.id }]
                            }
                        })
                        service = { ...service, immobilesTarget: immobilesTargetDocRefsForDB }
                    }
                    if (service.immobilesOrigin?.length > 0) {
                        service.immobilesOrigin?.map((element, index) => {
                            if (element.id?.length) {
                                immobilesOriginDocRefsForDB = [...immobilesOriginDocRefsForDB, { id: element.id }]
                            }
                        })
                        service = { ...service, immobilesOrigin: immobilesOriginDocRefsForDB }
                    }
                    const isSave = serviceNowID === ""
                    if (isSave) {
                        service = { ...service, dateInsertUTC: handleNewDateToUTC() }
                        const docRef = await addDoc(serviceCollection, ServiceConversor.toFirestore(service))
                        serviceNowID = docRef.id
                    } else {
                        service = { ...service, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(serviceCollection, serviceNowID)
                        await updateDoc(docRef, ServiceConversor.toFirestore(service))
                    }
                    if (history) {
                        const dataForHistory = { ...ServiceConversor.toFirestore(service), databaseid: serviceNowID, databasename: SERVICE_COLLECTION_NAME }
                        await addDoc(historyCollection, dataForHistory)
                    }
                } catch (err) {
                    console.error(err)
                    resPOST = { ...resPOST, status: "ERROR", error: err }
                }
                resPOST = { ...resPOST, status: "SUCCESS", id: serviceNowID }
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
                    const serviceDocRef = doc(serviceCollection, id)
                    let listStages = []
                    let listPayments = []
                    const queryStages = query(serviceStageCollection, where("service", "==", { id: id }))
                    const queryStagesSnapshot = await getDocs(queryStages)
                    queryStagesSnapshot.forEach((doc) => {
                        listStages = [...listStages, doc.data()]
                    })
                    const queryPayments = query(servicePaymentCollection, where("service", "==", { id: id }))
                    const queryPaymentsSnapshot = await getDocs(queryPayments)
                    queryPaymentsSnapshot.forEach((doc) => {
                        listPayments = [...listPayments, doc.data()]
                    })
                    if (listStages.length) {
                        await Promise.all(
                            listStages.map(async (elementStage, index) => {
                                const stageDocRef = doc(serviceStageCollection, elementStage.id)
                                await deleteDoc(stageDocRef)
                            })
                        )
                    }
                    if (listPayments.length) {
                        await Promise.all(
                            listPayments.map(async (elementPayment, index) => {
                                const paymentDocRef = doc(servicePaymentCollection, elementPayment.id)
                                await deleteDoc(paymentDocRef)
                            })
                        )
                    }
                    await deleteDoc(serviceDocRef)
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