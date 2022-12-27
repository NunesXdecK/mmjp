import { collection, doc, getDoc } from "firebase/firestore"
import { Professional, Person } from "../../../interfaces/objectInterfaces"
import { ProfessionalConversor, PersonConversor } from "../../../db/converters"
import { db, PROFESSIONAL_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const professionalCollection = collection(db, PROFESSIONAL_COLLECTION_NAME).withConverter(ProfessionalConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                if (id) {
                    const docRef = doc(professionalCollection, id)
                    let professional: Professional = (await getDoc(docRef)).data()
                    if (professional && "id" in professional.person && professional.person?.id > 0) {
                        const personDocRef = doc(personCollection, professional.person?.id)
                        let person: Person = (await getDoc(personDocRef)).data()
                        if (person && "id" in person && person?.id > 0) {
                            professional = { ...professional, person: person }
                        }
                    }
                    resGET = { ...resGET, status: "SUCCESS", data: professional }
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
