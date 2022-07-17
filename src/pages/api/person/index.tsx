import { PersonConversor } from "../../../db/converters"
import { db, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"

export default async function handler(req, res) {
    const { query, method, body } = req
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    switch (method) {
        case "PUT":
            try {
                {/*
                const docRef = await addDoc(personCollection, {})
            */}
                res.status(200).json("sucesso")
            } catch (err) {
                res.status(500).json({ error: "Erro ao carregar os dados!" })
            }
            break
        case "UPDATE":
            try {
                {/*
                const docRef = doc(personCollection, "")
                await updateDoc(docRef, {})
            */}
                res.status(200).json("sucesso")
            } catch (err) {
                res.status(500).json({ error: "Erro ao carregar os dados!" })
            }
            break
        case "DELETE":
            try {
                const data = JSON.parse(body)
                const docRef = doc(personCollection, data.id)
                await deleteDoc(docRef)
                res.status(200).json(JSON.stringify({ status: "SUCCESS", body: body.id }))
            } catch (err) {
                res.status(200).json(JSON.stringify({ status: "ERROR" }))
            }
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
