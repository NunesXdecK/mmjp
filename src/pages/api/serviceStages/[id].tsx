import { ServiceStageConversor } from "../../../db/converters"
import { ServiceStage } from "../../../interfaces/objectInterfaces"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db, SERVICE_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req
    const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            let list = []
            try {
                const { id } = req.query
                const queryServiceStage = query(serviceStageCollection, where("service", "==", { id: id }))
                const querySnapshot = await getDocs(queryServiceStage)
                querySnapshot.forEach((doc) => {
                    list = [...list, doc.data()]
                })

                list = list.sort((elementOne: ServiceStage, elementTwo: ServiceStage) => {
                    let indexOne = elementOne.index
                    let indexTwo = elementTwo.index
                    return indexTwo - indexOne
                })
                resGET = { ...resGET, status: "SUCCESS", list: list }
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
