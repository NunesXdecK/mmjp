import { ServicePayment } from "../../../interfaces/objectInterfaces"
import { collection, doc, getDocs, query, where } from "firebase/firestore"
import { ServiceConversor, ServicePaymentConversor } from "../../../db/converters"
import { db, SERVICE_COLLECTION_NAME, SERVICE_PAYMENT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
            const servicePaymentCollection = collection(db, SERVICE_PAYMENT_COLLECTION_NAME).withConverter(ServicePaymentConversor)
            let list = []
            try {
                const { id } = req.query
                const serviceDocRef = doc(serviceCollection, id)
                const queryServicePayment = query(servicePaymentCollection, where("service", "==", serviceDocRef))
                const querySnapshot = await getDocs(queryServicePayment)
                querySnapshot.forEach((doc) => {
                    list = [...list, doc.data()]
                })
                list = list.sort((elementOne: ServicePayment, elementTwo: ServicePayment) => {
                    let indexOne = elementOne.index
                    let indexTwo = elementTwo.index

                    return indexOne - indexTwo
                })
                resGET = { ...resGET, status: "SUCCESS", list: list }
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
