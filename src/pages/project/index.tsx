import Head from "next/head"
import Layout from "../../components/layout/layout"
import ProjectList from "../../components/list/projectList"
export default function Person() {

    function handleListItemClick(person) {
        console.log(JSON.stringify(person))
    }

    return (
        <Layout
            title="Projeto">
            <Head>
                <title>Projetos</title>
                <meta name="description" content="Projeto" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ProjectList
                onListItemClick={handleListItemClick} />
        </Layout>
    )
}
