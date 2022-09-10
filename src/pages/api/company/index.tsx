import { CompanyConversor, PersonConversor } from "../../../db/converters"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME, HISTORY_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method, body } = req

    const historyCollection = collection(db, HISTORY_COLLECTION_NAME)
    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)

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
                            if (element.id?.length) {
                                /*
                                const docRef = doc(personCollection, element.id)
                                docRefsForDB = [...docRefsForDB, docRef]
                                */
                                docRefsForDB = [...docRefsForDB, { id: element.id }]
                            }
                        })
                        data = { ...data, owners: docRefsForDB }
                    }
                    const isSave = nowID === ""
                    if (isSave) {
                        const docRef = await addDoc(companyCollection, CompanyConversor.toFirestore(data))
                        nowID = docRef.id
                    } else {
                        const docRef = doc(companyCollection, nowID)
                        await updateDoc(docRef, CompanyConversor.toFirestore(data))
                    }
                    if (history) {
                        const dataForHistory = { ...CompanyConversor.toFirestore(data), databaseid: nowID, databasename: COMPANY_COLLECTION_NAME }
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
                    const docRef = doc(companyCollection, id)
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
