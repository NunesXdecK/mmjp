import { collection, doc, getDoc } from "firebase/firestore"
import { Company, Person } from "../../../interfaces/objectInterfaces"
import { CompanyConversor, PersonConversor } from "../../../db/converters"
import { db, COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method, body } = req

    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                let ownersArray = []
                if (id) {
                    const docRef = doc(companyCollection, id)
                    let data: Company = (await getDoc(docRef)).data()
                    await Promise.all(
                        data.owners.map(async (element, index) => {
                            const personDocRef = doc(personCollection, element.id)
                            if (personDocRef) {
                                const personData: Person = (await getDoc(personDocRef)).data()
                                if (personData) {
                                    ownersArray = [...ownersArray, personData]
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
