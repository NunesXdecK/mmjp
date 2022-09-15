import { UserConversor } from "../../../db/converters"
import { db, USER_COLLECTION_NAME } from "../../../db/firebaseDB"
import { collection, getDocs, query, where } from "firebase/firestore"

export default async function handler(req, res) {
    const { method } = req

    const userCollection = collection(db, USER_COLLECTION_NAME).withConverter(UserConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: false }
            const { id } = req.query
            try {
                if (id?.length) {
                    let list = []
                    const queryPerson = query(userCollection, where("username", "==", id))
                    const querySnapshotPerson = await getDocs(queryPerson)
                    querySnapshotPerson.forEach((doc) => {
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
