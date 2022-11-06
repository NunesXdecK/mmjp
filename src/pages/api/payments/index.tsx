import { collection, getDocs } from "firebase/firestore"
import { PaymentConversor } from "../../../db/converters"
import { handleUTCToDateShow } from "../../../util/dateUtils"
import { Payment } from "../../../interfaces/objectInterfaces"
import { db, PAYMENT_COLLECTION_NAME } from "../../../db/firebaseDB"
import { handleMountNumberCurrency } from "../../../util/maskUtil"

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            const paymentCollection = collection(db, PAYMENT_COLLECTION_NAME).withConverter(PaymentConversor)
            let list = []
            try {
                const querySnapshot = await getDocs(paymentCollection)
                querySnapshot.forEach((doc) => {
                    let payment: Payment = { ...doc.data() }
                    payment = {
                        ...payment,
                        dateString: handleUTCToDateShow(payment.dateDue?.toString()),
                        value: handleMountNumberCurrency(payment.value.toString(), ".", ",", 3, 2)
                    }
                    list = [...list, payment]
                })
                list = list.sort((elementOne: Payment, elementTwo: Payment) => {
                    let dateOne = elementOne.dateInsertUTC
                    let dateTwo = elementTwo.dateInsertUTC
                    if (elementOne.dateLastUpdateUTC > 0 && elementOne.dateLastUpdateUTC > dateOne) {
                        dateOne = elementOne.dateLastUpdateUTC
                    }
                    if (elementTwo.dateLastUpdateUTC > 0 && elementTwo.dateLastUpdateUTC > dateTwo) {
                        dateTwo = elementTwo.dateLastUpdateUTC
                    }
                    return dateTwo - dateOne
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
