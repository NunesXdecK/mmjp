import { collection, doc, getDoc } from "firebase/firestore"
import { Professional, Service } from "../../../interfaces/objectInterfaces"
import { ProfessionalConversor, ServiceConversor } from "../../../db/converters"
import { db, SERVICE_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                if (id) {
                    const docRef = doc(serviceCollection, id)
                    let service: Service = (await getDoc(docRef)).data()

                    if (service.responsible?.id && service.responsible?.id !== "") {
                        const docRef = doc(professionalCollection, service.responsible.id)
                        const data: Professional = (await getDoc(docRef)).data()
                        service = { ...service, responsible: data }
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
