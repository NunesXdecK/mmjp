import { ProjectConversor } from "../../../db/converters"
import { Project } from "../../../interfaces/objectInterfaces"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { handleGetDateFormatedToUTC, handleNewDateToUTC } from "../../../util/dateUtils"
import { db, HISTORY_COLLECTION_NAME, PROJECT_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            let { token, data, history } = JSON.parse(body)
            let project: Project = data
            if (token === "tokenbemseguro") {
                let nowID = project?.id ?? ""
                if (project?.dateString?.length > 0) {
                    project = { ...project, dateDue: handleGetDateFormatedToUTC(project.dateString) }
                }
                if (project.dateDue === 0) {
                    project = { ...project, dateDue: handleNewDateToUTC() }
                }
                let clientsDocRefsForDB = []
                if (project.clients?.length > 0) {
                    project.clients?.map((element, index) => {
                        if (element.id?.length) {
                            if ("cpf" in element) {
                                clientsDocRefsForDB = [...clientsDocRefsForDB, { id: element.id, cpf: "" }]
                            } else if ("cnpj" in element) {
                                clientsDocRefsForDB = [...clientsDocRefsForDB, { id: element.id, cnpj: "" }]
                            }
                        }
                        project = { ...project, clients: clientsDocRefsForDB }
                    })
                }
                if (project.dateString) {
                    delete project.dateString
                }
                if (project.oldData) {
                    delete project.oldData
                }
                project = {
                    ...project,
                    title: project.title.trim(),
                }
                const isSave = nowID === ""
                try {
                    if (isSave) {
                        project = { ...project, dateInsertUTC: handleNewDateToUTC() }
                        const docRef = await addDoc(projectCollection, ProjectConversor.toFirestore(project))
                        nowID = docRef.id
                    } else {
                        project = { ...project, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(projectCollection, nowID)
                        await updateDoc(docRef, ProjectConversor.toFirestore(project))
                    }
                    if (history) {
                        const dataForHistory = { ...ProjectConversor.toFirestore(project), databaseid: nowID, databasename: PROJECT_COLLECTION_NAME }
                        await addDoc(historyCollection, dataForHistory)
                    }
                } catch (err) {
                    console.error(err)
                    resPOST = { ...resPOST, status: "ERROR", error: err }
                }
                resPOST = { ...resPOST, status: "SUCCESS", id: nowID }
            } else {
                resPOST = { ...resPOST, status: "ERROR", message: "Token invalido!" }
            }
            res.status(200).json(resPOST)
            break
        case "DELETE":
            let resDELETE = { status: "ERROR", error: {}, message: "" }
            try {
                const { token, id } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    const projectDocRef = doc(projectCollection, id)
                    await deleteDoc(projectDocRef)
                    resDELETE = { ...resDELETE, status: "SUCCESS" }
                } else {
                    resDELETE = { ...resDELETE, status: "ERROR", message: "Token invalido!" }
                }
            } catch (err) {
                console.error(err)
                resDELETE = { ...resDELETE, status: "ERROR", error: err }
            }
            res.status(200).json(resDELETE)
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
