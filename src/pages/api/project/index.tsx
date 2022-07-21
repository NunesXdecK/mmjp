import { Project } from "../../../interfaces/objectInterfaces"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { CompanyConversor, ImmobileConversor, PersonConversor, ProfessionalConversor, ProjectConversor } from "../../../db/converters"
import { db, COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME, HISTORY_COLLECTION_NAME, PROJECT_COLLECTION_NAME, IMMOBILE_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)
    const immobileCollection = collection(db, IMMOBILE_COLLECTION_NAME).withConverter(ImmobileConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data } = JSON.parse(body)
                let project: Project = data
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""

                    let clientsDocRefsForDB = []
                    let immobilesTargetDocRefsForDB = []
                    let immobilesOriginDocRefsForDB = []

                    if (project.professional && project.professional?.id !== "") {
                        const docRef = doc(professionalCollection, project.professional.id)
                        project = { ...project, professional: docRef }
                    }
                    if (project.immobilesTarget?.length > 0) {
                        project.immobilesTarget?.map((element, index) => {
                            if (element.id) {
                                const docRef = doc(immobileCollection, element.id)
                                immobilesTargetDocRefsForDB = [...immobilesTargetDocRefsForDB, docRef]
                            }
                        })
                        project = { ...project, immobilesTarget: immobilesTargetDocRefsForDB }
                    }
                    if (project.immobilesOrigin?.length > 0) {
                        project.immobilesOrigin?.map((element, index) => {
                            if (element.id) {
                                const docRef = doc(immobileCollection, element.id)
                                immobilesOriginDocRefsForDB = [...immobilesOriginDocRefsForDB, docRef]
                            }
                        })
                        project = { ...project, immobilesOrigin: immobilesOriginDocRefsForDB }
                    }
                    if (project.clients?.length > 0) {
                        project.clients?.map((element, index) => {
                            if ("cpf" in element) {
                                if (element.id) {
                                    const docRef = doc(personCollection, element.id)
                                    clientsDocRefsForDB = [...clientsDocRefsForDB, docRef]
                                }
                            } else if ("cnpj" in element) {
                                if (element.id) {
                                    const docRef = doc(companyCollection, element.id)
                                    clientsDocRefsForDB = [...clientsDocRefsForDB, docRef]
                                }
                            }
                            project = { ...project, clients: clientsDocRefsForDB }
                        })
                    }
                    const isSave = nowID === ""
                    if (isSave) {
                        const docRef = await addDoc(projectCollection, ProjectConversor.toFirestore(project))
                        nowID = docRef.id
                    } else {
                        const docRef = doc(projectCollection, nowID)
                        await updateDoc(docRef, project)
                    }
                    const dataForHistory = { ...ProjectConversor.toFirestore(project), databaseid: nowID, databasename: PROJECT_COLLECTION_NAME }
                    await addDoc(historyCollection, dataForHistory)
                    resPOST = { ...resPOST, status: "SUCCESS", id: nowID }
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
                    const docRef = doc(projectCollection, id)
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
