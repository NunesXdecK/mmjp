import { collection, doc, getDoc } from "firebase/firestore"
import { Payment, Project } from "../../../interfaces/objectInterfaces"
import { PaymentConversor, ProjectConversor } from "../../../db/converters"
import { db, PAYMENT_COLLECTION_NAME, PROJECT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const paymentCollection = collection(db, PAYMENT_COLLECTION_NAME).withConverter(PaymentConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            const { id } = query
            if (id) {
                try {
                    const docRef = doc(paymentCollection, id)
                    let payment: Payment = (await getDoc(docRef)).data()
                    if (payment.project?.id?.length > 0) {
                        const projectDocRef = doc(projectCollection, payment.project.id)
                        let project: Project = (await getDoc(projectDocRef)).data()
                        if (project?.id?.length > 0) {
                            payment = { ...payment, project: project }
                        }
                    }
                    resGET = { ...resGET, status: "SUCCESS", data: payment }
                } catch (err) {
                    console.error(err)
                    resGET = { ...resGET, status: "ERROR", error: err }
                }
            } else {
                resGET = { ...resGET, status: "ERROR", message: "Token invalido!" }
            }
            res.status(200).json(resGET)
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
