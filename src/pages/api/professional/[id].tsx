import { collection, doc, getDoc } from "firebase/firestore"
import { Professional, Person } from "../../../interfaces/objectInterfaces"
import { ProfessionalConversor, PersonConversor } from "../../../db/converters"
import { db, PROFESSIONAL_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method, body } = req

    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                let ownersArray = []
                if (id) {
                    const docRef = doc(professionalCollection, id)
                    let data: Professional = (await getDoc(docRef)).data()
                    let personData: Person = (await getDoc(data.person)).data()
                    data = { ...data, person: personData }
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
