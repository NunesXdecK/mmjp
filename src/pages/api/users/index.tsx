import { collection, getDocs } from "firebase/firestore"
import { UserConversor } from "../../../db/converters"
import { User } from "../../../interfaces/objectInterfaces"
import { db, USER_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req

    const userCollection = collection(db, USER_COLLECTION_NAME).withConverter(UserConversor)

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            let list = []
            try {
                const querySnapshot = await getDocs(userCollection)
                querySnapshot.forEach((doc) => {
                    let user: User = doc.data()
                    list = [...list, { ...user, password: "" }]
                })
                list = list.sort((elementOne: User, elementTwo: User) => {
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
