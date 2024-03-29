import { SubjectMessageConversor } from "../../../db/converters"
import { collection, getDocs } from "firebase/firestore"
import { SubjectMessage } from "../../../interfaces/objectInterfaces"
import { db, SUBJECT_MESSAGE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            const subjectMessageCollection = collection(db, SUBJECT_MESSAGE_COLLECTION_NAME).withConverter(SubjectMessageConversor)
            let list = []
            try {
                const querySnapshot = await getDocs(subjectMessageCollection)
                querySnapshot.forEach((doc) => {
                    list = [...list, doc.data()]
                })
                list = list.sort((elementOne: SubjectMessage, elementTwo: SubjectMessage) => {
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
            } catch (err) {
                console.error(err)
                resGET = { ...resGET, status: "ERROR", error: err }
            }
            res.status(200).json(resGET)
            break
        default:
            res.setHeader("Allow", ["GET"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
