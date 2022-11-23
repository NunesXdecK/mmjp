import { CompanyConversor } from "../../../db/converters"
import { collection, doc, getDoc } from "firebase/firestore"
import { Company } from "../../../interfaces/objectInterfaces"
import { db, COMPANY_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            const { id } = query
            try {
                if (id) {
                    const docRef = doc(companyCollection, id)
                    let company: Company = (await getDoc(docRef)).data()
                    if (company?.name?.length > 0) {
                        resGET = { ...resGET, status: "SUCCESS", data: company.name }
                    }
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
