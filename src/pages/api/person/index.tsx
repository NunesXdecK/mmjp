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
            try {
                let data = JSON.parse(body)
                const docRef = doc(personCollection, data.id)
                data = (await getDoc(docRef)).data()
                res.status(200).json({ status: "SUCCESS", data: data })
            } catch (err) {
                res.status(200).json({ status: "ERROR", erro: err })
            }
            break
        case "POST":
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
                res.status(200).json({ status: "SUCCESS", id: nowID })
            } catch (err) {
                res.status(200).json({ status: "ERROR", erro: err })
            }
            break
        case "PUT":
            try {
                let response = { status: "ERROR", message: "Não há ID", id: "" }
                let data: Person = JSON.parse(body)
                data = handlePreparePersonForDB(data)
                console.log(JSON.stringify(data))
                let nowID = data?.id ?? ""
                if (nowID) {
                    data = { ...data, dateLastUpdateUTC: handleNewDateToUTC() }
                    const docRef = doc(personCollection, nowID)
                    await updateDoc(docRef, data)
                    response = {status: "SUCCESS", message: "Ae sim!", id: nowID }
                }
                res.status(200).json(response)
            } catch (err) {
                let data: Person = JSON.parse(body)
                res.status(200).json({ status: "ERROR", erro: err, data: data })
            }
            break
        case "DELETE":
            try {
                const data = JSON.parse(body)
                const docRef = doc(personCollection, data.id)
                await deleteDoc(docRef)
                res.status(200).json({ status: "SUCCESS", body: body.id })
            } catch (err) {
                res.status(200).json({ status: "ERROR", erro: err })
            }
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
