import { PersonConversor } from "../../../db/converters"
import { collection, getDocs } from "firebase/firestore"
import { db, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    switch (method) {
        case 'GET':
            const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
            let arrayList = []
            try {
                const querySnapshot = await getDocs(personCollection)
                querySnapshot.forEach((doc) => {
                    arrayList = [...arrayList, doc.data()]
                })
                res.status(200).json(arrayList)
            } catch (err) {
                res.status(500).json({ error: "Erro ao carregar os dados!" })
            }
            break
        default:
            res.setHeader("Allow", ["GET"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
