import { collection, doc, getDoc } from "firebase/firestore"
import { ServiceConversor, ServicePaymentConversor } from "../../../db/converters"
import { Service, ServicePayment } from "../../../interfaces/objectInterfaces"
import { db, SERVICE_COLLECTION_NAME, SERVICE_PAYMENT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const servicePaymentCollection = collection(db, SERVICE_PAYMENT_COLLECTION_NAME).withConverter(ServicePaymentConversor)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                if (id) {
                    const docRef = doc(servicePaymentCollection, id)
                    let data: ServicePayment = (await getDoc(docRef)).data()
                    if (data.service && "id" in data.service && data.service.id?.length) {
                        const serviceDocRef = doc(serviceCollection, data.service?.id)
                        let service: Service = (await getDoc(serviceDocRef)).data()
                        if (service && "id" in service && service?.id?.length) {
                            data = { ...data, service: service }
                        }
                    }
                    resGET = { ...resGET, status: "SUCCESS", data: data }
                } else {
                    resGET = { ...resGET, status: "ERROR", message: "Token invalido!" }
                }
            } catch (err) {
                console.error(err)
                resGET = { ...resGET, status: "ERROR", error: err }
            }
            res.status(200).json(resGET)
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
