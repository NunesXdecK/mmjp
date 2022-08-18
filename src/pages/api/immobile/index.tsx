import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { CompanyConversor, ImmobileConversor, PersonConversor } from "../../../db/converters"
import { COMPANY_COLLECTION_NAME, db, HISTORY_COLLECTION_NAME, IMMOBILE_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)
    const immobileCollection = collection(db, IMMOBILE_COLLECTION_NAME).withConverter(ImmobileConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data, history } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""
                    let docRefsForDB = []
                    if (data.owners?.length > 0) {
                        data.owners?.map((element, index) => {
                            if (element.id) {
                                let docRef = null
                                if ("cpf" in element) {
                                    docRef = doc(personCollection, element.id)
                                } else if ("cnpj" in element) {
                                    docRef = doc(companyCollection, element.id)
                                }
                                if (docRef) {
                                    docRefsForDB = [...docRefsForDB, docRef]
                                }
                            }
                        })
                        data = { ...data, owners: docRefsForDB }
                    }
                    const isSave = nowID === ""
                    if (isSave) {
                        const docRef = await addDoc(immobileCollection, ImmobileConversor.toFirestore(data))
                        nowID = docRef.id
                    } else {
                        const docRef = doc(immobileCollection, nowID)
                        await updateDoc(docRef, data)
                    }
                    if (history) {
                        const dataForHistory = { ...ImmobileConversor.toFirestore(data), databaseid: nowID, databasename: IMMOBILE_COLLECTION_NAME }
                        await addDoc(historyCollection, dataForHistory)
                    }
                    resPOST = { ...resPOST, status: "SUCCESS", id: nowID }
                } else {
                    resPOST = { ...resPOST, status: "ERROR", message: "Token invalido!" }
                }
            } catch (err) {
                console.error(err)
                resPOST = { ...resPOST, status: "ERROR", error: err }
            }
            res.status(200).json(resPOST)
            break
        case "DELETE":
            let resDELETE = { status: "ERROR", error: {}, message: "" }
            try {
                const { token, id } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    const docRef = doc(immobileCollection, id)
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
