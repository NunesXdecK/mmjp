import { PersonConversor } from "../../../db/converters"
import { handleNewDateToUTC } from "../../../util/dateUtils"
import { Person } from "../../../interfaces/objectInterfaces"
import { db, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"
import { handlePreparePersonForDB } from "../../../util/converterUtil"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"

export default async function handler(req, res) {
    const { query, method, body, param } = req
    {/*
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        )
    */}

    const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)

    switch (method) {
        case "GET":
            let resGET = { status: "ERROR", error: {}, message: "" }
            try {
                let data = JSON.parse(body)
                const docRef = doc(personCollection, data.id)
                data = (await getDoc(docRef)).data()
                resGET = { ...resGET, status: "SUCCESS" }
            } catch (err) {
                resGET = { ...resGET, status: "ERROR", error: err }
            }
            res.status(200).json(resGET)
            break
        case "POST":
            let resPOST = { status: "ERROR", error: {}, message: "" }
            try {
                let data: Person = JSON.parse(body)
                data = handlePreparePersonForDB(data)
                console.log(JSON.stringify(data))
                let nowID = data?.id ?? ""
                const querySnapshot = await getDocs(personCollection)
                querySnapshot.forEach((doc) => {
                    const cpf = doc.data().cpf
                    if (doc.id && data.cpf === cpf) {
                        nowID = doc.id
                    }
                })
                const isSave = nowID === ""
                if (isSave) {
                    const docRef = await addDoc(personCollection, data)
                    nowID = docRef.id
                } else {
                    data = { ...data, dateLastUpdateUTC: handleNewDateToUTC() }
                    const docRef = doc(personCollection, nowID)
                    await updateDoc(docRef, data)
                }
                resPOST = { ...resPOST, status: "SUCCESS" }
            } catch (err) {
                resPOST = { ...resPOST, status: "ERROR", error: err }
            }
            res.status(200).json(resPOST)
            break
        case "DELETE":
            let resDELETE = { status: "ERROR", error: {}, message: "" }
            try {
                const data = JSON.parse(body)
                const docRef = doc(personCollection, data.id)
                await deleteDoc(docRef)
                resDELETE = { ...resDELETE, status: "SUCCESS" }
            } catch (err) {
                resDELETE = { ...resDELETE, status: "ERROR", error: err }
            }
            res.status(200).json(resDELETE)
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
