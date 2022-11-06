import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { Immobile, Professional, Project, Service, ServiceStage } from "../../../interfaces/objectInterfaces"
import { ImmobileConversor, ProfessionalConversor, ProjectConversor, ServiceConversor, ServicePaymentConversor, ServiceStageConversor } from "../../../db/converters"
import { db, SERVICE_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME, IMMOBILE_COLLECTION_NAME, SERVICE_PAYMENT_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME, PROJECT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req

    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const immobileCollection = collection(db, IMMOBILE_COLLECTION_NAME).withConverter(ImmobileConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)
    const servicePaymentCollection = collection(db, SERVICE_PAYMENT_COLLECTION_NAME).withConverter(ServicePaymentConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = req.query
                if (id) {
                    const docRef = doc(serviceCollection, id)
                    let service: Service = (await getDoc(docRef)).data()
                    if (service.project && "id" in service.project && service.project?.id?.length) {
                        const docRef = doc(projectCollection, service.project.id)
                        const data: Project = (await getDoc(docRef)).data()
                        service = { ...service, project: data }
                    }
                    if (service.professional && "id" in service.professional && service.professional?.id?.length) {
                        const docRef = doc(professionalCollection, service.professional.id)
                        const data: Professional = (await getDoc(docRef)).data()
                        service = { ...service, professional: data }
                    }
                    let listServiceStage = []
                    const queryServiceStage = query(serviceStageCollection, where("service", "==", { id: id }))
                    const queryServiceStageSnapshot = await getDocs(queryServiceStage)
                    queryServiceStageSnapshot.forEach(async (docRef) => {
                        listServiceStage = [...listServiceStage, docRef.data()]
                    })
                    if (listServiceStage && listServiceStage?.length > 0) {
                        let listServiceWithResp = []
                        await Promise.all(
                            listServiceStage.map(async (element, index) => {
                                let data: ServiceStage = element
                                if (data.responsible && "id" in data.responsible && data.responsible?.id?.length) {
                                    const professionalDocRef = doc(professionalCollection, data.responsible?.id)
                                    let professional: Professional = (await getDoc(professionalDocRef)).data()
                                    if (professional && "id" in professional && professional?.id?.length) {
                                        data = { ...data, responsible: professional }
                                    }
                                }
                                listServiceWithResp = [...listServiceWithResp, data]
                            })

                        )
                        service = { ...service, serviceStages: listServiceWithResp }
                    }
                    let listServicePayment = []
                    const queryServicePayment = query(servicePaymentCollection, where("service", "==", { id: id }))
                    const queryServicePaymentSnapshot = await getDocs(queryServicePayment)
                    queryServicePaymentSnapshot.forEach((doc) => {
                        listServicePayment = [...listServicePayment, doc.data()]
                    })
                    if (listServicePayment && listServicePayment?.length > 0) {
                        service = { ...service, servicePayments: listServicePayment }
                    }
                    if (service.immobilesOrigin && service.immobilesOrigin?.length > 0) {
                        let immobilesOrigin = []
                        await Promise.all(service.immobilesOrigin.map(async (element, index) => {
                            const docRef = doc(immobileCollection, element.id)
                            if (docRef) {
                                const data: Immobile = (await getDoc(docRef)).data()
                                if (data) {
                                    immobilesOrigin = [...immobilesOrigin, data]
                                }
                            }
                        }))
                        service = { ...service, immobilesOrigin: immobilesOrigin }
                    }
                    if (service.immobilesTarget && service.immobilesTarget?.length > 0) {
                        let immobilesTarget = []
                        await Promise.all(service.immobilesTarget.map(async (element, index) => {
                            const docRef = doc(immobileCollection, element.id)
                            if (docRef) {
                                const data: Immobile = (await getDoc(docRef)).data()
                                if (data) {
                                    immobilesTarget = [...immobilesTarget, data]
                                }
                            }
                        }))
                        service = { ...service, immobilesTarget: immobilesTarget }
                    }
                    resGET = { ...resGET, status: "SUCCESS", data: service }
                } else {
                    resGET = { ...resGET, status: "ERROR", message: "ID invalido!" }
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
