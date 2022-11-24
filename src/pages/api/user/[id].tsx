import { collection, doc, getDoc } from "firebase/firestore"
import { User, Person } from "../../../interfaces/objectInterfaces"
import { UserConversor, PersonConversor } from "../../../db/converters"
import { db, USER_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const userCollection = collection(db, USER_COLLECTION_NAME).withConverter(UserConversor)
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                if (id) {
                    const docRef = doc(userCollection, id)
                    let user: User = (await getDoc(docRef)).data()
                    if (user.person?.id?.length > 0) {
                        const personDocRef = doc(personCollection, user.person?.id)
                        let person: Person = (await getDoc(personDocRef)).data()
                        if (person && "id" in person && person?.id.length) {
                            user = { ...user, person: person }
                        }
                    }
                    resGET = { ...resGET, status: "SUCCESS", data: user }
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
