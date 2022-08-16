import { collection, doc, getDoc } from "firebase/firestore"
import { ProfessionalConversor, ServiceStageConversor } from "../../../db/converters"
import { Professional, ServiceStage } from "../../../interfaces/objectInterfaces"
import { db, PROFESSIONAL_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                if (id) {
                    const docRef = doc(serviceStageCollection, id)
                    let data: ServiceStage = (await getDoc(docRef)).data()
                    if (data.responsible && "id" in data.responsible && data.responsible.id.length) {
                        const professionalDocRef = doc(professionalCollection, data.responsible?.id)
                        let professional: Professional = (await getDoc(professionalDocRef)).data()
                        if (professional && "id" in professional && professional?.id.length) {
                            data = { ...data, responsible: professional }
                        }
                    }
                    resGET = { ...resGET, status: "SUCCESS", data: data }
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
