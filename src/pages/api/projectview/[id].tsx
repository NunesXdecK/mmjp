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
            try {
                const { id } = query
                if (id) {
                    const docRef = doc(projectCollection, id)
                    let project: Project = (await getDoc(docRef)).data()
                    let professionalId = ""

                    let clients = []
                    project.clients.map((element, index) => {
                        clients = [...clients, element]
                    })
                    {/*
let immobilesOrigin = []
project.immobilesOrigin.map((element, index) => {
                        immobilesOrigin = [...immobilesOrigin, element.id]
                    })
                    
                    let immobilesTarget = []
                    project.immobilesTarget.map((element, index) => {
                        immobilesTarget = [...immobilesTarget, element.id]
                    })

                    project = {
                        ...project,
                        clients: clients,
                        immobilesOrigin: immobilesOrigin,
                        immobilesTarget: immobilesTarget
                    }
                */}
                    project = {
                        ...project,
                        clients: clients,
                    }
                    resGET = { ...resGET, status: "SUCCESS", data: project }
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
