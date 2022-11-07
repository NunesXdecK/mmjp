import { PaymentConversor } from "../../../db/converters"
import { Payment } from "../../../interfaces/objectInterfaces"
import { db, PAYMENT_COLLECTION_NAME } from "../../../db/firebaseDB"
import { collection, doc, getDocs, query, where } from "firebase/firestore"

export default async function handler(req, res) {
    const { method } = req
    const PaymentCollection = collection(db, PAYMENT_COLLECTION_NAME).withConverter(PaymentConversor)
    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            let list = []
            try {
                const { id } = req.query
                const queryPayment = query(PaymentCollection, where("project", "==", { id: id }))
                const querySnapshot = await getDocs(queryPayment)
                querySnapshot.forEach((doc) => {
                    list = [...list, doc.data()]
                })
                list = list.sort((elementOne: Payment, elementTwo: Payment) => {
                    let indexOne = elementOne.index
                    let indexTwo = elementTwo.index
                    return indexTwo - indexOne
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
