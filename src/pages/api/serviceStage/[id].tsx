import { collection, doc, getDoc } from "firebase/firestore"
import { UserConversor, ServiceConversor, ServiceStageConversor } from "../../../db/converters"
import { User, Service, ServiceStage } from "../../../interfaces/objectInterfaces"
import { db, USER_COLLECTION_NAME, SERVICE_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const userCollection = collection(db, USER_COLLECTION_NAME).withConverter(UserConversor)
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                if (id) {
                    const docRef = doc(serviceStageCollection, id)
                    let serviceStage: ServiceStage = (await getDoc(docRef)).data()
                    if (serviceStage.responsible?.id?.length > 0) {
                        const userDocRef = doc(userCollection, serviceStage.responsible?.id)
                        let user: User = (await getDoc(userDocRef)).data()
                        if (user?.id > 0) {
                            serviceStage = { ...serviceStage, responsible: user }
                        }
                    }
                    if (serviceStage.service?.id?.length > 0) {
                        const serviceDocRef = doc(serviceCollection, serviceStage.service?.id)
                        let service: Service = (await getDoc(serviceDocRef)).data()
                        if (service?.id > 0) {
                            serviceStage = { ...serviceStage, service: service }
                        }
                    }
                    resGET = { ...resGET, status: "SUCCESS", data: serviceStage }
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
