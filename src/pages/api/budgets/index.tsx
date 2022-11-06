import { BudgetConversor } from "../../../db/converters"
import { collection, getDocs } from "firebase/firestore"
import { Budget } from "../../../interfaces/objectInterfaces"
import { db, BUDGET_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req
    const budgetCollection = collection(db, BUDGET_COLLECTION_NAME).withConverter(BudgetConversor)

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            let list = []
            try {
                const querySnapshot = await getDocs(budgetCollection)
                querySnapshot.forEach((doc) => {
                    list = [...list, doc.data()]
                })
            } catch (err) {
                console.error(err)
                resGET = { ...resGET, status: "ERROR", error: err }
            }
            list = list.sort((elementOne: Budget, elementTwo: Budget) => {
                let dateOne = elementOne.dateInsertUTC
                let dateTwo = elementTwo.dateInsertUTC
                if (elementOne.dateLastUpdateUTC > 0 && elementOne.dateLastUpdateUTC > dateOne) {
                    dateOne = elementOne.dateLastUpdateUTC
                }
                if (elementTwo.dateLastUpdateUTC > 0 && elementTwo.dateLastUpdateUTC > dateTwo) {
                    dateTwo = elementTwo.dateLastUpdateUTC
                }
                return dateTwo - dateOne
            })
            resGET = { ...resGET, status: "SUCCESS", list: list }
            res.status(200).json(resGET)
            break
        default:
            res.setHeader("Allow", ["GET"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
