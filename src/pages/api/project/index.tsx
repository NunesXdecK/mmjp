import { Project } from "../../../interfaces/objectInterfaces"
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { CompanyConversor, ImmobileConversor, PersonConversor, ProfessionalConversor, ProjectConversor, ServiceConversor, ServicePaymentConversor, ServiceStageConversor } from "../../../db/converters"
import { db, COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME, HISTORY_COLLECTION_NAME, PROJECT_COLLECTION_NAME, IMMOBILE_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME, SERVICE_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME, SERVICE_PAYMENT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)
    const servicePaymentCollection = collection(db, SERVICE_PAYMENT_COLLECTION_NAME).withConverter(ServicePaymentConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data } = JSON.parse(body)
                let project: Project = data
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""
                    let clientsDocRefsForDB = []
                    if (project.professional?.id && project.professional?.id?.length > 0) {
                        const docRef = doc(professionalCollection, project.professional.id)
                        project = { ...project, professional: docRef }
                    }
                    if (project.clients?.length > 0) {
                        project.clients?.map((element, index) => {
                            if ("cpf" in element) {
                                if (element.id) {
                                    const docRef = doc(personCollection, element.id)
                                    clientsDocRefsForDB = [...clientsDocRefsForDB, docRef]
                                }
                            } else if ("cnpj" in element) {
                                if (element.id) {
                                    const docRef = doc(companyCollection, element.id)
                                    clientsDocRefsForDB = [...clientsDocRefsForDB, docRef]
                                }
                            }
                            project = { ...project, clients: clientsDocRefsForDB }
                        })
                    }
                    const isSave = nowID === ""
                    if (isSave) {
                        const docRef = await addDoc(projectCollection, ProjectConversor.toFirestore(project))
                        nowID = docRef.id
                    } else {
                        const docRef = doc(projectCollection, nowID)
                        await updateDoc(docRef, ProjectConversor.toFirestore(project))
                    }
                    const dataForHistory = { ...ProjectConversor.toFirestore(project), databaseid: nowID, databasename: PROJECT_COLLECTION_NAME }
                    await addDoc(historyCollection, dataForHistory)
                    resPOST = { ...resPOST, status: "SUCCESS", id: nowID }
                } else {
                    resPOST = { ...resPOST, status: "ERROR", message: "Token invalido!" }
                }
            } catch (err) {
                console.error(err)
                resPOST = { ...resPOST, status: "ERROR", error: err }
            }
            res.status(200).json(resPOST)
            break
        case "DELETE":
            let resDELETE = { status: "ERROR", error: {}, message: "" }
            try {
                const { token, id } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    let list = []
                    const projectDocRef = doc(projectCollection, id)
                    const queryService = query(serviceCollection, where("project", "==", projectDocRef))
                    const querySnapshot = await getDocs(queryService)
                    querySnapshot.forEach((doc) => {
                        list = [...list, doc.data()]
                    })
                    await Promise.all(
                        list.map(async (element, index) => {
                            const serviceDocRef = doc(serviceCollection, element.id)
                            let listStages = []
                            let listPayments = []
                            const queryStages = query(serviceStageCollection, where("service", "==", serviceDocRef))
                            const queryStagesSnapshot = await getDocs(queryStages)
                            queryStagesSnapshot.forEach((doc) => {
                                listStages = [...listStages, doc.data()]
                            })
                            const queryPayments = query(servicePaymentCollection, where("service", "==", serviceDocRef))
                            const queryPaymentsSnapshot = await getDocs(queryPayments)
                            queryPaymentsSnapshot.forEach((doc) => {
                                listPayments = [...listPayments, doc.data()]
                            })
                            listStages.map(async (elementStage, index) => {
                                const stageDocRef = doc(serviceStageCollection, elementStage.id)
                                await deleteDoc(stageDocRef)
                            })
                            listPayments.map(async (elementPayment, index) => {
                                const paymentDocRef = doc(servicePaymentCollection, elementPayment.id)
                                await deleteDoc(paymentDocRef)
                            })
                            await deleteDoc(serviceDocRef)
                        })
                    )
                    await deleteDoc(projectDocRef)
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
