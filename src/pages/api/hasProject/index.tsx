import { ProjectConversor } from "../../../db/converters"
import { db, PROJECT_COLLECTION_NAME } from "../../../db/firebaseDB"
import { collection, getDocs, query, where } from "firebase/firestore"

export default async function handler(req, res) {
    const { method, body } = req
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)

    switch (method) {
        case 'POST':
            let resPOST = { status: "ERROR", error: {}, message: "", hasProject: false, }
            try {
                let { data } = JSON.parse(body)
                let projects = []
                if (data) {
                    const queryProjects = query(projectCollection,
                        where("budget.id", "==", data)
                    )
                    const querySnapshot = await getDocs(queryProjects)
                    querySnapshot.forEach((doc) => {
                        projects = [...projects, doc.data()]
                    })
                    resPOST = {
                        ...resPOST,
                        status: "SUCCESS",
                        hasProject: projects?.length > 0,
                    }
                }
            } catch (err) {
                console.error(err)
                resPOST = { ...resPOST, status: "ERROR", error: err }
            }
            res.status(200).json(resPOST)
            break
        default:
            res.setHeader("Allow", ["POST"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
