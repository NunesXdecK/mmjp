import { SubjectMessageConversor, UserConversor } from "../../../db/converters"
import { SubjectMessage, User } from "../../../interfaces/objectInterfaces"
import { collection, doc, getDoc } from "firebase/firestore"
import { db, SUBJECT_MESSAGE_COLLECTION_NAME, USER_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const userCollection = collection(db, USER_COLLECTION_NAME).withConverter(UserConversor)
    const subjectMessageCollection = collection(db, SUBJECT_MESSAGE_COLLECTION_NAME).withConverter(SubjectMessageConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                if (id) {
                    const docRef = doc(subjectMessageCollection, id)
                    let data: SubjectMessage = (await getDoc(docRef)).data()
                    if (data && "id" in data.user && data.user?.id?.length) {
                        const userDocRef = doc(userCollection, data.user?.id)
                        let user: User = (await getDoc(userDocRef)).data()
                        if (user && "id" in user && user?.id > 0) {
                            data = { ...data, user: user }
                        }
                    }
                    resGET = { ...resGET, status: "SUCCESS", data: data }
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
