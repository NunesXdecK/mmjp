import { ProfessionalConversor, ProjectConversor, ProjectStageConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, HISTORY_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME, PROJECT_COLLECTION_NAME, PROJECT_STAGE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)
    const projectStageCollection = collection(db, PROJECT_STAGE_COLLECTION_NAME).withConverter(ProjectStageConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""
                    const isSave = nowID === ""
                    if (data.project?.id && data.project.id !== "") {
                        const projectDocRef = doc(projectCollection, data.project.id)
                        if (projectDocRef) {
                            if (data.responsible && data.responsible?.id !== "") {
                                const docRef = doc(professionalCollection, data.responsible.id)
                                data = { ...data, responsible: docRef }
                            }
                            data = { ...data, project: projectDocRef }
                            if (isSave) {
                                const docRef = await addDoc(projectStageCollection, ProjectStageConversor.toFirestore(data))
                                nowID = docRef.id
                            } else {
                                const docRef = doc(projectStageCollection, nowID)
                                await updateDoc(docRef, ProjectStageConversor.toFirestore(data))
                            }
                            const dataForHistory = { ...ProjectStageConversor.toFirestore(data), databaseid: nowID, databasename: PROJECT_STAGE_COLLECTION_NAME }
                            await addDoc(historyCollection, dataForHistory)
                            resPOST = { ...resPOST, status: "SUCCESS", id: nowID }
                        } else {
                            resPOST = { ...resPOST, status: "ERROR", message: "Projeto não vinculado!" }
                        }
                    } else {
                        resPOST = { ...resPOST, status: "ERROR", message: "Projeto não vinculado!" }
                    }
                } else {
                    resPOST = { ...resPOST, status: "ERROR", message: "Token invalido!" }
                }
            } catch (err) {
                console.error(err)
                resPOST = { ...resPOST, status: "ERROR", error: err }
            }
            res.status(200).json(resPOST)
            break
        case "DELETE":
            let resDELETE = { status: "ERROR", error: {}, message: "" }
            try {
                const { token, id } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    const docRef = doc(projectStageCollection, id)
                    await deleteDoc(docRef)
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
