import { ProjectPayment } from "../../../interfaces/objectInterfaces"
import { collection, doc, getDocs, query, where } from "firebase/firestore"
import { ProjectConversor, ProjectPaymentConversor } from "../../../db/converters"
import { db, PROJECT_COLLECTION_NAME, PROJECT_PAYMENT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
            const projectPaymentCollection = collection(db, PROJECT_PAYMENT_COLLECTION_NAME).withConverter(ProjectPaymentConversor)
            let list = []
            try {
                const { id } = req.query
                const projectDocRef = doc(projectCollection, id)
                const queryProjectPayment = query(projectPaymentCollection, where("project", "==", projectDocRef))
                const querySnapshot = await getDocs(queryProjectPayment)
                querySnapshot.forEach((doc) => {
                    list = [...list, doc.data()]
                })
                list = list.sort((elementOne: ProjectPayment, elementTwo: ProjectPayment) => {
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
