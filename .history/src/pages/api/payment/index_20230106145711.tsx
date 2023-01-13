import { PaymentConversor } from "../../../db/converters"
import { handleNewDateToUTC } from "../../../util/dateUtils"
import { Payment } from "../../../interfaces/objectInterfaces"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, HISTORY_COLLECTION_NAME, PAYMENT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const paymentCollection = collection(db, PAYMENT_COLLECTION_NAME).withConverter(PaymentConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "", pstatus: "" }
            let { token, data, history } = JSON.parse(body)
            let nowID = data?.id ?? ""
            let payment: Payment = data
            if (payment.dateString) {
                delete payment.dateString
            }
            if (token === "tokenbemseguro") {
                try {
                    const isSave = nowID === ""
                    const dateNow = handleNewDateToUTC()
                    let status = payment.status
                    if (payment.status !== "PAGO" && payment.dateDue > 0) {
                        status = payment.dateDue < dateNow ? "ATRASADO" : "EM ABERTO"
                        payment = { ...payment, status: status }
                    }
                    if (isSave) {
                        payment = { ...payment, dateInsertUTC: handleNewDateToUTC() }
                        const docRef = await addDoc(paymentCollection, PaymentConversor.toFirestore(payment))
                        nowID = docRef.id
                    } else {
                        payment = { ...payment, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(paymentCollection, nowID)
                        await updateDoc(docRef, PaymentConversor.toFirestore(payment))
                    }
                    if (history) {
                        const dataForHistory = { ...PaymentConversor.toFirestore(payment), databaseid: nowID, databasename: PAYMENT_COLLECTION_NAME }
                        await addDoc(historyCollection, dataForHistory)
                    }
                    resPOST = { ...resPOST, status: "SUCCESS", id: nowID, pstatus: status }
                } catch (err) {
                    console.error(err)
                    resPOST = { ...resPOST, status: "ERROR", error: err }
                }
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
                    const docRef = doc(paymentCollection, id)
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
