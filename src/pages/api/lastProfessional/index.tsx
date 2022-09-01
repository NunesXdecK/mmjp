import { ProfessionalConversor, ServiceConversor } from "../../../db/converters"
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore"
import { defaultProfessional, Professional, Service } from "../../../interfaces/objectInterfaces"
import { db, PROFESSIONAL_COLLECTION_NAME, SERVICE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req
    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", professional: {} }
            let professional: Professional = defaultProfessional
            try {
                const queryService = await query(serviceCollection,
                    orderBy("dateInsertUTC", "desc"),
                    limit(5))
                const querySnapshotService = await getDocs(queryService)
                querySnapshotService.forEach((doc) => {
                    const localService: Service = doc.data()
                    if (localService.professional && "id" in localService.professional && localService.professional.id.length) {
                        professional = localService.professional
                    }
                })
                if (professional && "id" in professional && professional?.id?.length) {
                    const docRef = doc(professionalCollection, professional.id)
                    professional = (await getDoc(docRef)).data()
                } else {
                    const queryProfessional = await query(professionalCollection,
                        orderBy("dateInsertUTC", "desc"),
                        limit(1))
                    const querySnapshotProfessional = await getDocs(queryProfessional)
                    querySnapshotProfessional.forEach((doc) => {
                        const localProfessional: Professional = doc.data()
                        if (localProfessional && "id" in localProfessional && localProfessional?.id?.length) {
                            professional = localProfessional
                        }
                    })
                }
                resGET = { ...resGET, status: "SUCCESS", professional: professional }
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
