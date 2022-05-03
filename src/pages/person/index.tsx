import Head from "next/head"
import PersonForm from "../../components/form/personForm"
import Layout from "../../components/layout/layout"
export default function Person() {
    return (
        <Layout
            title="Pessoa">
            <Head>
                <title>Pessoa</title>
                <meta name="description" content="Pessoa" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PersonForm />

        </Layout>
    )
}
