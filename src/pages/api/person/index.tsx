import { PersonConversor } from "../../../db/converters"
import { handleNewDateToUTC } from "../../../util/dateUtils"
import { Person } from "../../../interfaces/objectInterfaces"
import { db, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { handleRemoveCEPMask, handleRemoveCPFMask, handleRemoveTelephoneMask } from "../../../util/maskUtil"

export const handlePreparePersonForDB = (person: Person) => {
    if (person.address && person.address?.cep) {
        person = { ...person, address: { ...person.address, cep: handleRemoveCEPMask(person.address.cep) } }
    }

    if (person.dateInsertUTC === 0) {
        person = { ...person, dateInsertUTC: handleNewDateToUTC() }
    }

    let telephonesWithNoMask = []
    person.telephones?.map((element, index) => {
        telephonesWithNoMask = [...telephonesWithNoMask, handleRemoveTelephoneMask(element)]
    })

    if (person.oldData) {
        delete person.oldData
    }

    person = {
        ...person
        , cpf: handleRemoveCPFMask(person.cpf)
        , telephones: telephonesWithNoMask
    }
    return person
}

export default async function handler(req, res) {
    const { query, method, body, param } = req

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
                console.error(err)
                resGET = { ...resGET, status: "ERROR", error: err }
            }
            res.status(200).json(resGET)
            break
        case "POST":
            let data: Person = JSON.parse(body)
            let resPOST = { status: "ERROR", error: {}, message: data }
            try {
                let nowID = data?.id ?? ""
                
                data = handlePreparePersonForDB(data)
                {/*
            */}
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
                console.error(err)
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
                console.error(err)
                resDELETE = { ...resDELETE, status: "ERROR", error: err }
            }
            res.status(200).json(resDELETE)
            break
        default:
            res.setHeader("Allow", ["PUT", "UPDATE", "DELETE"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
