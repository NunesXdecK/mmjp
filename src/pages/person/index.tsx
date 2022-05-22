import Head from "next/head"
import PersonForm from "../../components/form/personForm"
import Layout from "../../components/layout/layout"
import PersonList from "../../components/list/personList"
export default function Person() {

    function handleAfterSaveOperation(person) {
        console.log(JSON.stringify(person))
    }

    function handleListItemClick(person) {
        console.log(JSON.stringify(person))
    }

    return (
        <Layout
            title="Pessoa">
            <Head>
                <title>Pessoa</title>
                <meta name="description" content="Pessoa" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PersonForm
                isForSelect={true}
                isForOldRegister={true}
                title="Informações pessoais"
                subtitle="Dados importantes sobre a pessoa"
                afterSave={handleAfterSaveOperation} />

            {/*
            <PersonList
                onListItemClick={handleListItemClick} />
            */}
        </Layout>
    )
}
