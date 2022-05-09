import Head from "next/head"
import Layout from "../components/layout/layout"
import { collection, addDoc, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import persons from "../data/persons.json"
import { db } from "../db/firebaseDB";


async function allPersons(db) {
    const querySnapshot = await getDocs(collection(db, "person"))
    querySnapshot.forEach((doc) => {
        console.log(doc.id)
        console.log(JSON.stringify(doc.data()))
    })
}

async function updatePerson(db, id) {
    const carlosDoc = doc(db, "person", id)
    console.log(JSON.stringify(carlosDoc))

    await updateDoc(carlosDoc, {
        name: "Carlos Atualizado"
    });
}

async function addPerson(db, person) {
    try {
        const docRef = await addDoc(collection(db, "person"), person)
        console.log("Pessoa ficou com o ID: ", docRef.id)
    } catch (e) {
        console.error("Error adding document: ", e)
    }
}

export default function Index() {

    
    
    {/*
    const list = allPersons(db)
    list.map((element, index) => {
        console.log(JSON.stringify(element))
    })
    updatePerson(db, carlosID)
persons.map((element, index) => {
    addPerson(db, element)
})
    */}

    return (
        <Layout
            title="Dashboard">
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="Dashboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
        </Layout>
    )
}
