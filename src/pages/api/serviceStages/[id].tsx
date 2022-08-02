import { Professional, ServiceStage } from "../../../interfaces/objectInterfaces"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { ProfessionalConversor, ServiceConversor, ServiceStageConversor } from "../../../db/converters"
import { db, PROFESSIONAL_COLLECTION_NAME, SERVICE_COLLECTION_NAME, SERVICE_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            const serviceCollection = collection(db, SERVICE_COLLECTION_NAME).withConverter(ServiceConversor)
            const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)
            const serviceStageCollection = collection(db, SERVICE_STAGE_COLLECTION_NAME).withConverter(ServiceStageConversor)
            let list = []
            let listLocal = []
            try {
                const { id } = req.query
                const serviceDocRef = doc(serviceCollection, id)
                const queryServiceStage = query(serviceStageCollection, where("service", "==", serviceDocRef))
                const querySnapshot = await getDocs(queryServiceStage)
                querySnapshot.forEach((doc) => {
                    listLocal = [...listLocal, doc.data()]
                })

                await Promise.all(
                    listLocal.map(async (element: ServiceStage, index) => {
                        if (element.responsible?.id && element.responsible.id !== "") {
                            const docRef = doc(professionalCollection, element.responsible.id)
                            if (docRef) {
                                const data: Professional = (await getDoc(docRef)).data()
                                if (data) {
                                    list = [...list, { ...element, responsible: data }]
                                }
                            }
                        }
                    })
                )

                if (list.length === 0) {
                    list = [...listLocal]
                }

                list = list.sort((elementOne: ServiceStage, elementTwo: ServiceStage) => {
                    let indexOne = elementOne.index
                    let indexTwo = elementTwo.index
                    return indexOne - indexTwo
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
