import Head from "next/head"
import Layout from "../components/layout/layout"
import { collection, addDoc, getDocs, doc, updateDoc, query, where, getDoc } from "firebase/firestore";
import { db } from "../db/firebaseDB";
import { useEffect, useState } from "react";
import data from "../data/data.json";
import Button from "../components/button/button";
import { PersonConversor, PropertyConversor } from "../db/converters";
import { Person, PersonAddress, Process, Professional, Property } from "../interfaces/objectInterfaces";

async function hasProperty(collection, { county, lote, perimeter, area }: Property) {
    let property = {}
    const q = query(collection,
        where("area", "==", area),
        where("county", "==", county),
        where("lote", "==", lote),
        where("perimeter", "==", perimeter),
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        property = doc.data()
    });
    return property
}

async function propertyToDB(collection, property) {
    hasProperty(collection, property).then((res: Property) => {
        if (res.hasOwnProperty("id")) {
            update(collection, res.id, property)
        } else {
            add(collection, property)
        }
    })
}

async function personByCPF(collection, cpf) {
    let person = {}
    const q = query(collection, where("cpf", "==", cpf))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        person = doc.data()
    });
    return person
}

async function personById(db, id) {
    const personDoc = doc(db, "person", id)
    const personDocSnap = await getDoc(personDoc);
    if (personDocSnap.exists()) {
        console.log("Document data:", personDocSnap.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}

async function allPersons(db) {
    const querySnapshot = await getDocs(collection(db, "person"))
    querySnapshot.forEach((doc) => {
        console.log(doc.id)
        console.log(JSON.stringify(doc.data()))
    })
}

async function update(collection, id, data) {
    try {
        const docRef = doc(collection, id)
        await updateDoc(docRef, data)
        return true
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return false
}

async function add(collection, data) {
    try {
        const docRef = await addDoc(collection, data)
        return docRef.id
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return false
}

const buttonFunction = async () => {

    const dataList = data.Plan1.slice(data.Plan1.length - 15, data.Plan1.length - 0)
    const arrayList = dataList
    const personCollection = collection(db, "person").withConverter(PersonConversor)
    const propertyCollection = collection(db, "property").withConverter(PropertyConversor)

    arrayList.map((element, index) => {

        let dateCad = element["Data Simples"]?.trim() ?? ""

        if (dateCad) {
            dateCad = dateCad.split("/")
            let day = parseInt(dateCad[0])
            let month = parseInt(dateCad[1])
            let year = parseInt(dateCad[2])
            let dateEXT = year + "-" + month + "-" + day + " 00:00:00"
            dateCad = Date.parse(dateEXT)
        }

        let personCPF = element["CPF Prop."]?.replaceAll("-", "").replaceAll(".", "")

        if (personCPF) {
            let personRG = element["RG Prop."] ?? ""
            let personRGIssuer = ""

            if (personRG.indexOf(" ") > -1) {
                personRG = personRG?.replaceAll("-", "").replaceAll(".", "").split(" ")
                personRGIssuer = personRG[1] ?? ""
                personRG = personRG[0] ?? ""
            }

            let personTelephone = element["Telefone Prop."]?.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "").split("/") ?? ""
            let personAddress: PersonAddress = {}

            if (element["Logradouro End."]) {
                let personCEP = element["CEP End."]?.replaceAll(".", "").replaceAll("-", "") ?? ""
                personAddress = {
                    publicPlace: element["Logradouro End."]?.trim() ?? "",
                    number: element["Numero End."]?.trim() ?? "",
                    district: element["Bairro End."]?.trim() ?? "",
                    county: element["Município/UF End."]?.trim() ?? "",
                    cep: personCEP,
                }
            }


            let person: Person = {
                name: element["Nome Prop."]?.trim() ?? "",
                cpf: personCPF,
                rg: personRG,
                rgIssuer: personRGIssuer,
                nationality: element["Nacionalidade Prop."]?.trim() ?? "",
                naturalness: element["Naturalidade Prop."]?.trim() ?? "",
                maritalStatus: element["Estado Civíl Prop."]?.trim() ?? "",
                profession: element["Profissão Prop."]?.trim() ?? "",
                telephones: personTelephone,
                address: personAddress,
            }

            let areaProperty = element["Área"]?.trim() ?? ""
            if (areaProperty) {
                areaProperty = areaProperty.replaceAll(".", "").replace(",", ".")
                areaProperty = parseFloat(areaProperty)
            }

            let perimeterProperty = element["Perímetro"]?.trim() ?? ""
            if (perimeterProperty) {
                perimeterProperty = perimeterProperty.replaceAll(".", "").replaceAll(",", ".")
                perimeterProperty = parseFloat(perimeterProperty)
            }

            let land = element["Gleba"]?.trim() ?? ""

            let property: Property = {
                lote: element["Lote"]?.trim() ?? "",
                area: areaProperty,
                perimeter: perimeterProperty,
                land: land,
                county: element["Município/UF"]?.trim() ?? "",
            }

            {/*
            personByCPF(personCollection, personCPF).then((res: Person) => {
                console.log(res)

                if (!res.hasOwnProperty("dateInsertUTC")) {
                    person = { ...person, dateInsertUTC: dateCad }
                }

                if (!property.hasOwnProperty("dateInsertUTC")) {
                    property = { ...property, dateInsertUTC: dateCad }
                }

                if (res.hasOwnProperty("id")) {
                    update(personCollection, res.id, person).then((r) => {
                        console.log(personCPF)
                        console.log("updated")
                    })
                } else {
                    add(personCollection, person).then((r) => {
                        console.log(personCPF)
                        console.log("added")
                        const personDocRef = doc(personCollection, r + "")
                        property = { ...property, person: personDocRef }
                        propertyToDB(propertyCollection, property)
                    })
                }
            })
            */}
        }

        let professionalPersonCPF = element["CPF Prof."]?.replaceAll("-", "").replaceAll(".", "")
        if (professionalPersonCPF) {
            let professionalPersonRG = element["RG Prof."]?.replaceAll("-", "").replaceAll(".", "").split(" ")
            let professionalPersonTelephone = element["Telefone Prof. "]?.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "").split("/")
            let professionalPersonCEP = element["CEP"]?.replaceAll(".", "").replaceAll("-", "")


            let professionalPersonAddress: PersonAddress = {}
            let professionalPersonPublicPlace = element["Endereço Prof."]
            if (professionalPersonPublicPlace) {
                if (professionalPersonPublicPlace?.indexOf(", nº") > -1) {
                    professionalPersonPublicPlace = professionalPersonPublicPlace?.split(", nº")
                } else if (professionalPersonPublicPlace?.indexOf(",nº") > -1) {
                    professionalPersonPublicPlace = professionalPersonPublicPlace?.split(",nº")
                }

                professionalPersonAddress = {
                    publicPlace: professionalPersonPublicPlace?.length > 0 ? professionalPersonPublicPlace[0]?.trim() : professionalPersonPublicPlace?.trim(),
                    number: professionalPersonPublicPlace?.length > 0 ? professionalPersonPublicPlace[1]?.trim() : professionalPersonPublicPlace?.trim(),
                    district: element["Bairro Prof."]?.trim(),
                    county: element["Cidade/UF Prof."]?.trim(),
                    cep: professionalPersonCEP,
                }
            }

            let professionalPerson: Person = {
                name: element["Nome Prof."]?.trim(),
                cpf: professionalPersonCPF,
                rg: professionalPersonRG?.length > 0 ? professionalPersonRG[0].trim() : professionalPersonRG.trim(),
                rgIssuer: professionalPersonRG?.length > 0 ? professionalPersonRG[1].trim() : professionalPersonRG.trim(),
                telephones: professionalPersonTelephone,
                address: professionalPersonAddress,
            }

            let professional: Professional = {
                title: element["Título Prof."]?.trim(),
                creaNumber: element["CREA Prof."]?.trim(),
                credentialCode: element["Cod. Credenciado"]?.trim(),
            }
        }

        let process: Process = {
            number: element["Nº Processo"]?.trim(),
            date: dateCad,
        }
    })
}

export default function Index() {

    const [testFB, setTestFB] = useState([])

    {/*
    const getData = async () => {
        let array = []
        const docs = await getDocs(personCollection)
        docs.forEach((doc) => {
            array.push(doc.data())
        })
        return array
    }
    
    useEffect(() => {
        getData().then(setTestFB)
    }, [])
    */}

    const testPerson = {
        "Nome Prop.": "Geneilson da Costa Souza",
        "CPF Prop.": "605.928.342-04",
        "RG Prop.": "109.084",
        "Nacionalidade Prop.": "brasileira",
        "Naturalidade Prop.": "Cruzeiro do Sul - AC",
        "Estado Civíl Prop.": "solteiro",
        "Profissão Prop.": "comerciante",
        "Telefone Prop.": "(95) 99112-1056",
        "Logradouro End.": "Rua Ruth Pinheiro ",
        "Numero End.": "185",
        "Bairro End.": "Caimbé",
        "CEP End.": "69.312-170",
        "Município/UF End.": "Boa Vista - RR",
        "Lote": "Sítio Campos Novos",
        "Data": "Boa Vista/RR, 10 de maio de 2022",
        "Data Simples": "10/05/2022",
        "Nome Prof.": "Epitácio Evaristo de Andrade Junior",
        "CPF Prof.": "902.316.002-91",
        "RG Prof.": "203581 SSP/RR",
        "Título Prof.": "Geografo",
        "CREA Prof.": "CREA 0919021255",
        "Cod. Credenciado": "EPTE",
        "Endereço Prof.": "Av. Sebastião Diniz, nº2489",
        "Bairro Prof.": "São Vicente",
        "Cidade/UF Prof.": "Boa Vista/RR",
        "CEP": "69303-475",
        "Telefone Prof. ": "(95) 3224-2014/8115-0078"
    }

    return (
        <Layout
            title="Dashboard">
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="Dashboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Button onClick={buttonFunction}>GO!</Button>

            {testFB.map((element, index) => {
                return <p key={index}>{element.id + " " + element.name}</p>
            })}
        </Layout>
    )
}
