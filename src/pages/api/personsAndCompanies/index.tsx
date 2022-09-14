import { collection, getDoc, getDocs, query, where } from "firebase/firestore"
import { Company, Person } from "../../../interfaces/objectInterfaces"
import { CompanyConversor, PersonConversor } from "../../../db/converters"
import { COMPANY_COLLECTION_NAME, db, PERSON_COLLECTION_NAME } from "../../../db/firebaseDB"

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            let resGET = { status: "ERROR", error: {}, message: "", list: [] }
            const personCollection = collection(db, PERSON_COLLECTION_NAME).withConverter(PersonConversor)
            const companyCollection = collection(db, COMPANY_COLLECTION_NAME).withConverter(CompanyConversor)
            let list = []
            let listCompanies = []
            try {
                const qPerson = await query(personCollection, where("clientCode", "!=", ""))
                const querySnapshot = await getDocs(qPerson)
                const qCompany = await query(companyCollection, where("clientCode", "!=", ""))
                const querySnapshotCompany = await getDocs(qCompany)
                querySnapshot.forEach((doc) => {
                    list = [...list, doc.data()]
                })
                querySnapshotCompany.forEach(async (doc) => {
                    list = [...list, doc.data()]
                })
                list = list.sort((elementOne: Person, elementTwo: Person) => {
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
