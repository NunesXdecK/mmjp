import { collection, doc, getDoc } from "firebase/firestore"
import { Company, Person, Project } from "../../../interfaces/objectInterfaces"
import { CompanyConversor, PersonConversor, ProjectConversor } from "../../../db/converters"
import { db, COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME, PROJECT_COLLECTION_NAME, IMMOBILE_COLLECTION_NAME, PROFESSIONAL_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const projectCollection = collection(db, PROJECT_COLLECTION_NAME).withConverter(ProjectConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                if (id) {
                    const docRef = doc(projectCollection, id)
                    let project: Project = (await getDoc(docRef)).data()
                    let clients = []
                    if (project.clients && project.clients?.length > 0) {
                        await Promise.all(project.clients?.map(async (element, index) => {
                            if (element && element.id && "cpf" in element) {
                                const docRef = doc(personCollection, element.id)
                                if (docRef) {
                                    const data: Person = (await getDoc(docRef)).data()
                                    if (data) {
                                        clients = [...clients, data]
                                    }
                                }
                            } else if (element && element.id && "cnpj" in element) {
                                const docRef = doc(companyCollection, element.id)
                                if (docRef) {
                                    const data: Company = (await getDoc(docRef)).data()
                                    if (data) {
                                        clients = [...clients, data]
                                    }
                                }
                            }
                            /*
                            if (element.path.includes(PERSON_COLLECTION_NAME)) {
                                const docRef = doc(personCollection, element.id)
                                if (docRef) {
                                    const data: Person = (await getDoc(docRef)).data()
                                    if (data) {
                                        clients = [...clients, data]
                                    }
                                }
                            } else if (element.path.includes(COMPANY_COLLECTION_NAME)) {
                                const docRef = doc(companyCollection, element.id)
                                if (docRef) {
                                    const data: Company = (await getDoc(docRef)).data()
                                    if (data) {
                                        clients = [...clients, data]
                                    }
                                }
                            }
                            */
                        }))
                    }
                    project = { ...project, clients: clients }
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
