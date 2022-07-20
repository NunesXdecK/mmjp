import { collection, getDocs } from "firebase/firestore"
import { ImmobileConversor } from "../../../db/converters"
import { Immobile } from "../../../interfaces/objectInterfaces"
import { db, IMMOBILE_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            const immbileCollection = collection(db, IMMOBILE_COLLECTION_NAME).withConverter(ImmobileConversor)
            let list = []
            try {
                const querySnapshot = await getDocs(immbileCollection)
                querySnapshot.forEach((doc) => {
                    list = [...list, doc.data()]
                })
                list = list.sort((elementOne: Immobile, elementTwo: Immobile) => {
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
