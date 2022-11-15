import { PaymentConversor } from "../../../db/converters"
import { handleNewDateToUTC } from "../../../util/dateUtils"
import { Payment } from "../../../interfaces/objectInterfaces"
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore"
import { db, HISTORY_COLLECTION_NAME, PAYMENT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const paymentCollection = collection(db, PAYMENT_COLLECTION_NAME).withConverter(PaymentConversor)

    switch (method) {
        case 'POST':
            let resGET = { status: "ERROR", error: {}, data: "" }
            let { token, id } = JSON.parse(body)
            try {
                if (token === "tokenbemseguro" && id?.length > 0) {
                    const docRef = doc(paymentCollection, id)
                    let payment: Payment = (await getDoc(docRef)).data()
                    let status = payment.status
                    const dateNow = handleNewDateToUTC()
                    if (payment.status !== "PAGO" && payment.dateDue > 0) {
                        status = payment.dateDue < dateNow ? "ATRASADO" : "EM ABERTO"
                    }
                    if (payment.id?.length > 0 && status !== payment.status) {
                        status = payment.status
                        payment = { ...payment, status: status, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(paymentCollection, payment.id)
                        await updateDoc(docRef, PaymentConversor.toFirestore(payment))
                        const dataForHistory = { ...PaymentConversor.toFirestore(payment), databaseid: payment.id, databasename: PAYMENT_COLLECTION_NAME }
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
