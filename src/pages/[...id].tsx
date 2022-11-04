import { useRouter } from "next/router";
import Index from ".";

export default function IndexAll() {
    const router = useRouter()
    const { id } = router.query
    return (
        <Index page={id.toString().toUpperCase()} />
    )
}
