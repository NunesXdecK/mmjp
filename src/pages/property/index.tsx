import Head from "next/head"
import Layout from "../../components/layout/layout"
import PropertyList from "../../components/list/propertyList"
export default function Person() {

    function handleListItemClick(person) {
        console.log(JSON.stringify(person))
    }

    return (
        <Layout
            title="Propriedade">
            <Head>
                <title>Propriedade</title>
                <meta name="description" content="Propriedade" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PropertyList
                onListItemClick={handleListItemClick} />
        </Layout>
    )
}
