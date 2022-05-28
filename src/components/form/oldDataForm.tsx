import Form from "./form"

interface OldDataProps {
    title?: string,
    subtitle?: string,
    oldData?: object,
}

const spanClassTitle = "block text-sm font-medium text-gray-500"
const spanClassData = "text-gray-700"

export function OldDataProps(props: OldDataProps) {
    let name = props.oldData["Nome Prop."]
    let personCPF = props.oldData["CPF Prop."]
    let personRG = props.oldData["RG Prop."]
    let nationality = props.oldData["Nacionalidade Prop."]
    let naturalness = props.oldData["Naturalidade Prop."]
    let maritalStatus = props.oldData["Estado Civíl Prop."]
    let profession = props.oldData["Profissão Prop."]
    let dateCad = props.oldData["Data Simples"]

    let personCEP = props.oldData["CEP End."]
    let publicPlace = props.oldData["Logradouro End."]
    let number = props.oldData["Numero End."]
    let district = props.oldData["Bairro End."]
    let county = props.oldData["Município/UF End."]

    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>
                <div className="grid grid-cols-6 sm:gap-6">
                    <div className="py-1 px-2 col-span-6 sm:col-span-6">
                        <span
                            className={spanClassTitle}>
                            Data cadastro: <span className={spanClassData}>{dateCad}</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-6 sm:gap-6">
                    <div className="py-1 px-2 col-span-6 sm:col-span-6">
                        <span
                            className={spanClassTitle}>
                            Nome: <span className={spanClassData}>{name}</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-6 sm:gap-6">
                    <div className="py-1 px-2 col-span-6 sm:col-span-3">
                        <span
                            className={spanClassTitle}>
                            CPF: <span className={spanClassData}>{personCPF}</span>
                        </span>
                    </div>

                    <div className="py-1 px-2 col-span-6 sm:col-span-3">
                        <span
                            className={spanClassTitle}>
                            RG: <span className={spanClassData}>{personRG}</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-6 sm:gap-6">
                    <div className="py-1 px-2 col-span-6 sm:col-span-3">
                        <span
                            className={spanClassTitle}>
                            Profissão: <span className={spanClassData}>{profession}</span>
                        </span>
                    </div>

                    <div className="py-1 px-2 col-span-6 sm:col-span-3">
                        <span
                            className={spanClassTitle}>
                            Nacionalidade: <span className={spanClassData}>{nationality}</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-6 sm:gap-6">
                    <div className="py-1 px-2 col-span-6 sm:col-span-3">
                        <span
                            className={spanClassTitle}>
                            Naturalidade: <span className={spanClassData}>{naturalness}</span>
                        </span>
                    </div>

                    <div className="py-1 px-2 col-span-6 sm:col-span-3">
                        <span
                            className={spanClassTitle}>
                            Estado Civil: <span className={spanClassData}>{maritalStatus}</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-6 sm:gap-6">
                    <div className="py-1 px-2 col-span-6 sm:col-span-2">
                        <span
                            className={spanClassTitle}>
                            CEP: <span className={spanClassData}>{personCEP}</span>
                        </span>
                    </div>

                    <div className="py-1 px-2 col-span-6 sm:col-span-4">
                        <span
                            className={spanClassTitle}>
                            Logradouro: <span className={spanClassData}>{publicPlace}</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-6 sm:gap-6">
                    <div className="py-1 px-2 col-span-6 sm:col-span-2">
                        <span
                            className={spanClassTitle}>
                            Número: <span className={spanClassData}>{number}</span>
                        </span>
                    </div>

                    <div className="py-1 px-2 col-span-6 sm:col-span-2">
                        <span
                            className={spanClassTitle}>
                            Bairro: <span className={spanClassData}>{district}</span>
                        </span>
                    </div>

                    <div className="py-1 px-2 col-span-6 sm:col-span-2">
                        <span
                            className={spanClassTitle}>
                            Cidade: <span className={spanClassData}>{county}</span>
                        </span>
                    </div>
                </div>
            </Form>
        </>
    )
}
