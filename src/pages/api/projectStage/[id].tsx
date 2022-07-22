import { collection, doc, getDoc } from "firebase/firestore"
import { ProfessionalConversor, ProjectStageConversor } from "../../../db/converters"
import { Professional, ProjectStage } from "../../../interfaces/objectInterfaces"
import { db, PROFESSIONAL_COLLECTION_NAME, PROJECT_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)
    const projectStageCollection = collection(db, PROJECT_STAGE_COLLECTION_NAME).withConverter(ProjectStageConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                if (id) {
                    const docRef = doc(projectStageCollection, id)
                    let data: ProjectStage = (await getDoc(docRef)).data()
                    if (data.responsible?.id !== "") {
                        const professionalDocRef = doc(professionalCollection, data.responsible?.id)
                        let professional: Professional = (await getDoc(professionalDocRef)).data()
                        if (professional?.id !== "") {
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
