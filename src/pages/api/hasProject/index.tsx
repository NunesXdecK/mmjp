import { where } from "firebase/firestore"
import prisma from "../../../prisma/prisma"

const main = async (id) => {
    try {
        return await prisma.project.findMany({
            where: {
                budgetId: id,
            }
        })
    } catch (error) {
        console.error(error)
        return []
    }
}

export default async function handler(req, res) {
    const { method, body } = req
    const { token, id } = JSON.parse(body)
    switch (method) {
        case "POST":
            let resPOST = { status: "ERROR", message: "", hasProject: true }
            if (token === "tokenbemseguro") {
                const projects = await main(id).then(res => res)
                resPOST = { ...resPOST, hasProject: projects.length > 0 }
            }
            res.status(200).json({ ...resPOST })
            break
        default:
            res.setHeader("Allow", ["POST"])
            res.status(405).end(`Metodo ${method} não permitido`)
    }
}
