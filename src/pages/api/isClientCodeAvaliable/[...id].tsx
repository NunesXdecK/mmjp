import { CompanyConversor, PersonConversor } from "../../../db/converters"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { COMPANY_COLLECTION_NAME, db, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req

    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: false }
            const { id } = req.query
            try {
                const code = id[0] ?? ""
                const elementId = id[1] ?? ""
                if (code?.length > 0) {
                    let list = []
                    const queryPerson = query(personCollection, where("clientCode", "==", code))
                    const querySnapshotPerson = await getDocs(queryPerson)
                    querySnapshotPerson.forEach((doc) => {
                        list = [...list, doc.data()]
                    })
                    const queryCompany = query(companyCollection, where("clientCode", "==", code))
                    const querySnapshotCompany = await getDocs(queryCompany)
                    querySnapshotCompany.forEach((doc) => {
                        list = [...list, doc.data()]
                    })
                    let notHave = list.length > 0
                    list.map((element, index) => {
                        if (element && "id" in element && element.id === elementId) {
                            notHave = false
                        }
                    })
                    resGET = { ...resGET, status: "SUCCESS", data: notHave }
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
