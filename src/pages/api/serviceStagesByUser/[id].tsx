import { collection, getDocs, query, where } from "firebase/firestore"
import { ServiceStageConversor } from "../../../db/converters"
import { db, SERVICE_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            let list = []
            const { id } = req.query
            try {
                if (id) {
                    const queryServiceStage = query(serviceStageCollection, where("responsible", "==", { id: id }))
                    const querySnapshot = await getDocs(queryServiceStage)
                    querySnapshot.forEach((doc) => {
                        list = [...list, doc.data()]
                    })
                    resGET = { ...resGET, status: "SUCCESS", list: list }
                }
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
