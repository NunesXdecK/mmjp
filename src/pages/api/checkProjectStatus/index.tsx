import { handleNewDateToUTC } from "../../../util/dateUtils"
import { Payment, Project, Service } from "../../../interfaces/objectInterfaces"
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { PaymentConversor, ProjectConversor, ServiceConversor } from "../../../db/converters"
import { db, HISTORY_COLLECTION_NAME, PAYMENT_COLLECTION_NAME, PROJECT_COLLECTION_NAME, SERVICE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const paymentCollection = collection(db, PAYMENT_COLLECTION_NAME).withConverter(PaymentConversor)

    switch (method) {
        case 'POST':
            let resGET = { status: "ERROR", error: {}, data: "" }
            let { token, id } = JSON.parse(body)
            try {
                if (token === "tokenbemseguro" && id?.length > 0) {
                    const docRef = doc(projectCollection, id)
                    let project: Project = (await getDoc(docRef)).data()
                    let status = project.status

                    if (project.id?.length > 0) {
                        let isPayed = true
                        let isFinish = false
                        let isPendency = false
                        let isExecuting = false
                        const queryServices = query(serviceCollection,
                            where("project", "==", { id: project.id })
                        )
                        const queryServiceSnapshot = await getDocs(queryServices)
                        queryServiceSnapshot.forEach((doc) => {
                            const service: Service = doc.data()
                            if (service.status === "PENDENTE") {
                                isPendency = true
                            } else if (service.status === "EM ANDAMENTO") {
                                isExecuting = true
                            } else if (service.status === "FINALIZADO") {
                                isFinish = true
                            }
                        })
                        const queryPayments = query(paymentCollection,
                            where("project", "==", { id: project.id })
                        )
                        const queryPaymentSnapshot = await getDocs(queryPayments)
                        queryPaymentSnapshot.forEach((doc) => {
                            const payment: Payment = doc.data()
                            if (payment.status !== "PAGO") {
                                isPayed = false
                            }
                        })
                        project = { ...project, status: "PARADO" }
                        if (isPayed && isFinish) {
                            project = { ...project, status: "ARQUIVADO" }
                        } else if (isFinish) {
                            project = { ...project, status: "FINALIZADO" }
                        }
                        if (isExecuting) {
                            project = { ...project, status: "EM ANDAMENTO" }
                        }
                        if (isPendency) {
                            project = { ...project, status: "PENDENTE" }
                        }
                    }
                    if (project.id?.length > 0 && status !== project.status) {
                        status = project.status
                        project = { ...project, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(projectCollection, project.id)
                        await updateDoc(docRef, ProjectConversor.toFirestore(project))
                        const dataForHistory = { ...ProjectConversor.toFirestore(project), databaseid: project.id, databasename: PROJECT_COLLECTION_NAME }
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
