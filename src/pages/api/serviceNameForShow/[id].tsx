import { ServiceConversor } from "../../../db/converters"
import { collection, doc, getDoc } from "firebase/firestore"
import { Service } from "../../../interfaces/objectInterfaces"
import { db, SERVICE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            const { id } = query
            try {
                if (id) {
                    const docRef = doc(serviceCollection, id)
                    let service: Service = (await getDoc(docRef)).data()
                    resGET = { ...resGET, status: "SUCCESS", data: service.title }
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
