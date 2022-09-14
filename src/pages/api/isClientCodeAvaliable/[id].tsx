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
                if (id?.length) {
                    let list = []
                    const queryPerson = query(personCollection, where("clientCode", "==", id))
                    const querySnapshotPerson = await getDocs(queryPerson)
                    querySnapshotPerson.forEach((doc) => {
                        list = [...list, doc.data()]
                    })
                    const queryCompany = query(companyCollection, where("clientCode", "==", id))
                    const querySnapshotCompany = await getDocs(queryCompany)
                    querySnapshotCompany.forEach((doc) => {
                        list = [...list, doc.data()]
                    })
                    resGET = { ...resGET, status: "SUCCESS", data: list.length > 0 }
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
