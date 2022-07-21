import { ProfessionalConversor, ProjectConversor } from "../../../db/converters"
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore"
import { defaultProfessional, defaultProject, Professional, Project } from "../../../interfaces/objectInterfaces"
import { db, PROFESSIONAL_COLLECTION_NAME, PROJECT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", professional: {} }
            const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
            const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)
            let professional: Professional = defaultProfessional
            let project: Project = defaultProject
            try {
                const queryProject = await query(projectCollection,
                    orderBy("dateInsertUTC", "desc"),
                    limit(1))
                const querySnapshotProject = await getDocs(queryProject)
                querySnapshotProject.forEach((doc) => {
                    project = doc.data()
                })
                if (project.professional?.id && project.professional.id !== "") {
                    const docRef = doc(professionalCollection, project.professional.id)
                    professional = (await getDoc(docRef)).data()
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