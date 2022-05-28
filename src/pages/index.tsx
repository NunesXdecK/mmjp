import Head from "next/head"
import Layout from "../components/layout/layout"

export default function Index() {
    return (
        <Layout
            title="Dashboard">
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="Dashboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div
                className={`
                h-full
                w-full
animate-pulse
                `}
            >

            </div>
        </Layout>
    )
}
