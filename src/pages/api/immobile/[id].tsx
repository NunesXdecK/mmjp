import { Company, Immobile, Person } from "../../../interfaces/objectInterfaces"
import { collection, doc, getDoc } from "firebase/firestore"
import { CompanyConversor, ImmobileConversor, PersonConversor } from "../../../db/converters"
import { db, COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME, IMMOBILE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)
    const immobileCollection = collection(db, IMMOBILE_COLLECTION_NAME).withConverter(ImmobileConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                let ownersArray = []
                if (id) {
                    const docRef = doc(immobileCollection, id)
                    let data: Immobile = (await getDoc(docRef)).data()
                    await Promise.all(data.owners.map(async (element, index) => {
                        if (element.path.includes(PERSON_COLLECTION_NAME)) {
                            const docRef = doc(personCollection, element.id)
                            if (docRef) {
                                const data: Person = (await getDoc(docRef)).data()
                                if (data) {
                                    ownersArray = [...ownersArray, data]
                                }
                            }
                        } else if (element.path.includes(COMPANY_COLLECTION_NAME)) {
                            const docRef = doc(companyCollection, element.id)
                            if (docRef) {
                                const data: Company = (await getDoc(docRef)).data()
                                if (data) {
                                    ownersArray = [...ownersArray, data]
                                }
                            }
                        }
                    }))
                    data = { ...data, owners: ownersArray }
                    resGET = { ...resGET, status: "SUCCESS", data: data }
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
