import Head from "next/head"
import { useRouter } from "next/router"
import BudgetPrintView from "../../components/view/budgetPrintView"

export default function BudgetPrint() {
    const router = useRouter()
    const { id } = router.query
    return (
        <>
            <Head>
                <title>Impressão de orçamento</title>
                <meta name="description" content="Impressão de orçamento" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <BudgetPrintView
                id={id && id + ""} />
        </>
    )
}
