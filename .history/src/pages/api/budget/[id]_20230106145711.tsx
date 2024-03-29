import { BudgetConversor } from "../../../db/converters"
import { Budget } from "../../../interfaces/objectInterfaces"
import { collection, doc, getDoc } from "firebase/firestore"
import { db, BUDGET_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { query, method } = req

    const budgetCollection = collection(db, BUDGET_COLLECTION_NAME).withConverter(BudgetConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "", data: {} }
            try {
                const { id } = query
                if (id) {
                    const docRef = doc(budgetCollection, id)
                    let data: Budget = (await getDoc(docRef)).data()
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
