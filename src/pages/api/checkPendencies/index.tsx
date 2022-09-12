import { Service, ServicePayment, ServiceStage } from "../../../interfaces/objectInterfaces"
import { ServiceConversor, ServicePaymentConversor, ServiceStageConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { db, SERVICE_COLLECTION_NAME, SERVICE_PAYMENT_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)
    const servicePaymentCollection = collection(db, SERVICE_PAYMENT_COLLECTION_NAME).withConverter(ServicePaymentConversor)

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, messages: [] }
            let messages = []
            let serviceQuantity = 0
            let serviceStageQuantity = 0
            let servicePaymentQuantity = 0
            try {
                const queryService = query(serviceCollection, where("status", "==", "PENDENTE"))
                const querySnapshotService = await getDocs(queryService)
                querySnapshotService.forEach((doc) => {
                    serviceQuantity++
                })
                const queryServiceStage = query(serviceStageCollection, where("status", "==", "PENDENTE"))
                const querySnapshotServiceStage = await getDocs(queryServiceStage)
                querySnapshotServiceStage.forEach((doc) => {
                    serviceStageQuantity++
                })
                const queryServicePayment = query(servicePaymentCollection, where("status", "==", "PENDENTE"))
                const querySnapshotServicePayment = await getDocs(queryServicePayment)
                querySnapshotServicePayment.forEach((doc) => {
                    servicePaymentQuantity++
                })
                if (serviceQuantity > 0) {
                    if (serviceQuantity === 1) {
                        messages = [...messages, serviceQuantity + " serviço está pendente."]
                    } else {
                        messages = [...messages, serviceQuantity + " serviços estão pendentes."]
                    }
                }
                if (serviceStageQuantity > 0) {
                    if (serviceStageQuantity === 1) {
                        messages = [...messages, serviceStageQuantity + " etapa está pendente."]
                    } else {
                        messages = [...messages, serviceStageQuantity + " etapas estão pendentes."]
                    }
                }
                if (servicePaymentQuantity > 0) {
                    if (servicePaymentQuantity === 1) {
                        messages = [...messages, servicePaymentQuantity + " pagamento está pendente."]
                    } else {
                        messages = [...messages, servicePaymentQuantity + " pagamentos estão pendentes."]
                    }
                }
                resGET = { status: "SUCCESS", error: {}, messages: messages }
            } catch (err) {
                console.error(err)
                resGET = { ...resGET, status: "ERROR", error: err }
            }
            res.status(200).json(resGET)
            break
        default:
            res.setHeader("Allow", ["GET"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
