import Head from "next/head"
import ProjectForm from "../../components/form/projectForm"
import Layout from "../../components/layout/layout"

export default function Project() {
    
    return (
        <Layout
            title="Projeto">
            <Head>
                <title>Projeto</title>
                <meta name="description" content="Projetos" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ProjectForm 
                title="Informações básicas"
                subtitle="Informações básicas sobre o projeto"/>

        </Layout>
    )
}
