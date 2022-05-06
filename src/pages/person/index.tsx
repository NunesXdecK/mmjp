import Head from "next/head"
import Layout from "../../components/layout/layout"
export default function Person() {

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
            <PersonList onListItemClick={handleListItemClick} />
        </Layout>
    )
}
