import Head from "next/head"
import PersonForm from "../../components/form/personForm"
import Layout from "../../components/layout/layout"

export default function Project() {

    function handleSelectPerson(person) {
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
                onSelectPerson={handleSelectPerson}
                isForSelect={true}
                title="Dono do projeto"
                subtitle="Dados importantes sobre o dono do projeto" />

        </Layout>
    )
}
