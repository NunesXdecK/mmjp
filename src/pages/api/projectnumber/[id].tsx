import { collection, getDocs } from "firebase/firestore"
import { ProjectConversor } from "../../../db/converters"
import { Project } from "../../../interfaces/objectInterfaces"
import { db, PROJECT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                let returnId = 1
                if (id) {
                    const querySnapshot = await getDocs(projectCollection)
                    querySnapshot.forEach((doc) => {
                        const project: Project = doc.data()
                        if (project.number.includes(id)) {
                            returnId++
                        }
                    })
                    resGET = { ...resGET, status: "SUCCESS", data: returnId }
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
