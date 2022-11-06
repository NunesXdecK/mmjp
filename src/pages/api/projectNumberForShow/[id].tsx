import { ProjectConversor } from "../../../db/converters"
import { collection, doc, getDoc } from "firebase/firestore"
import { Project } from "../../../interfaces/objectInterfaces"
import { db, PROJECT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            const { id } = query
            try {
                if (id) {
                    const docRef = doc(projectCollection, id)
                    let project: Project = (await getDoc(docRef)).data()
                    resGET = { ...resGET, status: "SUCCESS", data: project.number }
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
