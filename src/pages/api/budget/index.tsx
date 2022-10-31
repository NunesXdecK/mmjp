import { BudgetConversor } from "../../../db/converters"
import { Budget, BudgetPayment } from "../../../interfaces/objectInterfaces"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { handleGetDateFormatedToUTC, handleNewDateToUTC } from "../../../util/dateUtils"
import { db, HISTORY_COLLECTION_NAME, BUDGET_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const budgetCollection = collection(db, BUDGET_COLLECTION_NAME).withConverter(BudgetConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            let { token, data, history } = JSON.parse(body)
            if (token === "tokenbemseguro") {
                let budget: Budget = data
                let nowID = data?.id ?? ""
                const isSave = nowID === ""
                if (budget?.dateString?.length > 0) {
                    budget = { ...budget, date: handleGetDateFormatedToUTC(budget.dateString) }
                }
                if (budget.date === 0) {
                    budget = { ...budget, date: handleNewDateToUTC() }
                }
                let clients = []
                if (budget.clients && budget.clients.length) {
                    budget.clients?.map((element, index) => {
                        if (element && "id" in element && element.id.length) {
                            if ("cpf" in element) {
                                clients = [...clients, { id: element.id, cpf: "" }]
                            } else if ("cnpj" in element) {
                                clients = [...clients, { id: element.id, cnpj: "" }]
                            }
                        }
                    })
                }
                let payments = []
                if (budget.payments && budget.payments?.length) {
                    budget.payments?.map((element: BudgetPayment, index) => {
                        let payment = { ...element }
                        payment = { ...payment, dateDue: handleGetDateFormatedToUTC(payment.dateString) }
                        if (payment.dateString) {
                            delete payment.dateString
                        }
                        payments = [...payments, payment]
                    })
                }
                if (budget.dateString) {
                    delete budget.dateString
                }
                budget = {
                    ...budget,
                    clients: clients,
                    payments: payments,
                    title: budget.title.trim(),
                }
                try {
                    if (isSave) {
                        budget = { ...budget, dateInsertUTC: handleNewDateToUTC() }
                        const docRef = await addDoc(budgetCollection, BudgetConversor.toFirestore(budget))
                        nowID = docRef.id
                    } else {
                        budget = { ...budget, dateLastUpdateUTC: handleNewDateToUTC() }
                        const docRef = doc(budgetCollection, nowID)
                        await updateDoc(docRef, BudgetConversor.toFirestore(budget))
                    }
                    if (history) {
                        const dataForHistory = { ...BudgetConversor.toFirestore(budget), databaseid: nowID, databasename: BUDGET_COLLECTION_NAME }
                        await addDoc(historyCollection, dataForHistory)
                    }
                    resPOST = { ...resPOST, status: "SUCCESS", id: nowID }
                    {/*
                */}
                } catch (err) {
                    console.error(err)
                    resPOST = { ...resPOST, status: "ERROR", error: err }
                }
            } else {
                resPOST = { ...resPOST, status: "ERROR", message: "Token invalido!" }
            }
            res.status(200).json(resPOST)
            break
        case "DELETE":
            let resDELETE = { status: "ERROR", error: {}, message: "" }
            try {
                const { token, id } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    const docRef = doc(budgetCollection, id)
                    await deleteDoc(docRef)
                    resDELETE = { ...resDELETE, status: "SUCCESS" }
                } else {
                    resDELETE = { ...resDELETE, status: "ERROR", message: "Token invalido!" }
                }
            } catch (err) {
                console.error(err)
                resDELETE = { ...resDELETE, status: "ERROR", error: err }
            }
            res.status(200).json(resDELETE)
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} nao permitido`)
    }
}
