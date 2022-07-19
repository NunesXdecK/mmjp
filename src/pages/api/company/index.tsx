import { Company, Person } from "../../../interfaces/objectInterfaces"
import { CompanyConversor, PersonConversor } from "../../../db/converters"
import { db, COMPANY_COLLECTION_NAME, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"

export default async function handler(req, res) {
    const { query, method, body } = req

    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
    const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)

    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", error: {}, id: "", message: "" }
            try {
                let { token, data } = JSON.parse(body)
                if (token === "tokenbemseguro") {
                    let nowID = data?.id ?? ""
                    let docRefsForDB = []
                    if (data.owners?.length > 0) {
                        data.owners?.map((element, index) => {
                            if (element.id) {
                                const docRef = doc(personCollection, element.id)
                                docRefsForDB = [...docRefsForDB, docRef]
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
                        await updateDoc(docRef, data)
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
