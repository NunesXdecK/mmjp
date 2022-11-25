import { collection, doc, getDocs, query, where } from "firebase/firestore"
import { UserConversor } from "../../../db/converters"
import { db, USER_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req
    const userCollection = collection(db, USER_COLLECTION_NAME).withConverter(UserConversor)

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            let list = []
            try {
                const queryUser = query(userCollection, where("isBlocked", "==", false))
                const querySnapshot = await getDocs(queryUser)
                querySnapshot.forEach((doc) => {
                    list = [...list, doc.data()]
                })
                resGET = { ...resGET, status: "SUCCESS", list: list }
            } catch (err) {
                console.error(err)
                resGET = { ...resGET, status: "ERROR", error: err }
            }
            res.status(200).json(resGET)
            break
        default:
            res.setHeader("Allow", ["GET"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
