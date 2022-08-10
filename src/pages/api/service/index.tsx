import { Service } from "../../../interfaces/objectInterfaces"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { ImmobileConversor, ProfessionalConversor, ProjectConversor, ServiceConversor, ServicePaymentConversor, ServiceStageConversor } from "../../../db/converters"
import { db, HISTORY_COLLECTION_NAME, SERVICE_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME, PROJECT_COLLECTION_NAME, SERVICE_PAYMENT_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME, IMMOBILE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const immobileCollection = collection(db, IMMOBILE_COLLECTION_NAME).withConverter(ImmobileConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)
    const servicePaymentCollection = collection(db, SERVICE_PAYMENT_COLLECTION_NAME).withConverter(ServicePaymentConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            let serviceNowID = ""
            let service: Service = {}
            try {
                let { token, data } = JSON.parse(body)
                service = data
                serviceNowID = data?.id ?? ""
                if (token === "tokenbemseguro") {
                    if ("id" in service && service.responsible?.id?.length) {
                        const docRef = doc(professionalCollection, service.responsible.id)
                        service = { ...service, responsible: docRef }
                    } else {
                        service = { ...service, responsible: {} }
                    }
                    if ("id" in service && service.project?.id?.length) {
                        const docRef = doc(projectCollection, service.project.id)
                        service = { ...service, project: docRef }
                    } else {
                        service = { ...service, project: {} }
                    }
                    let immobilesTargetDocRefsForDB = []
                    let immobilesOriginDocRefsForDB = []
                    if (service.immobilesTarget?.length > 0) {
                        service.immobilesTarget?.map((element, index) => {
                            if (element.id) {
                                const docRef = doc(immobileCollection, element.id)
                                immobilesTargetDocRefsForDB = [...immobilesTargetDocRefsForDB, docRef]
                            }
                        })
                        service = { ...service, immobilesTarget: immobilesTargetDocRefsForDB }
                    }
                    if (service.immobilesOrigin?.length > 0) {
                        service.immobilesOrigin?.map((element, index) => {
                            if (element.id) {
                                const docRef = doc(immobileCollection, element.id)
                                immobilesOriginDocRefsForDB = [...immobilesOriginDocRefsForDB, docRef]
                            }
                        })
                        service = { ...service, immobilesOrigin: immobilesOriginDocRefsForDB }
                    }
                    const isSave = serviceNowID === ""
                    if (isSave) {
                        const docRef = await addDoc(serviceCollection, ServiceConversor.toFirestore(service))
                        serviceNowID = docRef.id
                    } else {
                        const docRef = doc(serviceCollection, serviceNowID)
                        await updateDoc(docRef, ServiceConversor.toFirestore(service))
                    }
                    const dataForHistory = { ...ServiceConversor.toFirestore(service), databaseid: serviceNowID, databasename: SERVICE_COLLECTION_NAME }
                    await addDoc(historyCollection, dataForHistory)
                }
            } catch (err) {
                console.error(err)
                resPOST = { ...resPOST, status: "ERROR", error: err }
            }

            if (serviceNowID.length) {
                try {
                    const serviceDocRef = doc(serviceCollection, serviceNowID)
                    if (service.serviceStages.length) {
                        await Promise.all(
                            service.serviceStages.map(async (serviceStage, index) => {
                                if (serviceDocRef) {
                                    let serviceStageNowID = serviceStage?.id ?? ""
                                    const isSave = serviceStageNowID === ""
                                    serviceStage = { ...serviceStage, service: serviceDocRef }
                                    if ("id" in serviceStage.responsible && serviceStage.responsible?.id.length) {
                                        const docRef = doc(professionalCollection, serviceStage.responsible.id)
                                        serviceStage = { ...serviceStage, responsible: docRef }
                                    }
                                    if (isSave) {
                                        const docRef = await addDoc(serviceStageCollection, ServiceStageConversor.toFirestore(serviceStage))
                                        serviceStageNowID = docRef.id
                                    } else {
                                        const docRef = doc(serviceStageCollection, serviceStageNowID)
                                        await updateDoc(docRef, ServiceStageConversor.toFirestore(serviceStage))
                                    }
                                    const dataForHistory = { ...ServiceStageConversor.toFirestore(serviceStage), databaseid: serviceStageNowID, databasename: SERVICE_STAGE_COLLECTION_NAME }
                                    await addDoc(historyCollection, dataForHistory)
                                }
                            })
                        )
                    }

                    if (service.servicePayments.length) {
                        await Promise.all(
                            service.servicePayments.map(async (servicePayment, index) => {
                                if (serviceDocRef) {
                                    let servicePaymentNowID = servicePayment?.id ?? ""
                                    const isSave = servicePaymentNowID === ""
                                    servicePayment = { ...servicePayment, service: serviceDocRef }
                                    if (isSave) {
                                        const docRef = await addDoc(servicePaymentCollection, ServicePaymentConversor.toFirestore(servicePayment))
                                        servicePaymentNowID = docRef.id
                                    } else {
                                        const docRef = doc(servicePaymentCollection, servicePaymentNowID)
                                        await updateDoc(docRef, ServicePaymentConversor.toFirestore(servicePayment))
                                    }
                                    const dataForHistory = { ...ServicePaymentConversor.toFirestore(servicePayment), databaseid: servicePaymentNowID, databasename: SERVICE_PAYMENT_COLLECTION_NAME }
                                    await addDoc(historyCollection, dataForHistory)
                                }
                            })
                        )
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