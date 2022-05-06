import Head from "next/head"
import { useState } from "react"
import PersonForm from "../../components/form/personForm"
import Layout from "../../components/layout/layout"
import PersonList from "../../components/list/personList"
import IOSModal from "../../components/modal/iosModal"

export default function Project() {
    const [isOpen, setIsOpen] = useState(false)

    function handleListItemClick(person) {
        console.log(JSON.stringify(person))
    }

    return (
        <Layout
            title="Projeto">
            <Head>
                <title>Projeto</title>
                <meta name="description" content="Projetos" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PersonForm 
                    isForSelect={true}
                    title="Dono do projeto"
                    subtitle="Dados importantes sobre o dono do projeto"/>

            <IOSModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <PersonList
                    isForSelect={true}
                    onListItemClick={handleListItemClick} />
            </IOSModal>
        </Layout>
    )
}
