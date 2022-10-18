import Head from "next/head";
import { useEffect, useState } from "react";
import { handleMaskCPF } from "../../util/maskUtil";
import Layout from "../../components/layout/layout";
import Button from "../../components/button/button";
import FormRow from "../../components/form/formRow";
import InputText from "../../components/inputText/inputText";
import FormRowColumn from "../../components/form/formRowColumn";
import { Person } from "../../interfaces/objectInterfaces";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import IOSModal from "../../components/modal/iosModal";
import WindowModal from "../../components/modal/windowModal";
import PersonForm from "../../components/form/personForm";
import InputSelectPersonCompany from "../../components/inputText/inputSelectPersonCompany";

export default function Users() {
    let title = "Teste"

    const [persons, setPersons] = useState<Person[]>([])
    const [isFirst, setIsFirst] = useState(true)
    const [isOpenIOS, setIsOpenIOS] = useState(false)
    const [isOpenWindow, setIsOpenWindow] = useState(false)


    useEffect(() => {
        if (isFirst) {
            fetch("api/persons").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setPersons(res.list)
                }
            })
        }
    })

    return (
        <>
            <Layout
                title={title}>
                <Head>
                    <title>{title}</title>
                    <meta name="description" content={title} />
                    <link rel="icon" href="/favicon.ico" />
                </Head>


                <div className="p-4">
                    <InputSelectPersonCompany
                        title="Cliente"
                        id="input-select"
                    />

                    <InputText
                        id="test"
                        title="test"
                        value="Haha-ha"
                    />
                </div>

                <div className="rounded p-4">
                    <div className="rounded border shadow p-4 flex gap-2">
                        <Button onClick={() => setIsOpenIOS(true)}>modal TC</Button>
                        <Button onClick={() => setIsOpenWindow(true)}>modal JN</Button>
                    </div>

                    <div className="rounded mt-4 ">
                        <div className="bg-gray-200">
                            <div className="p-4 flex flex-row items-center justify-between ">
                                <span className="text-2xl">{title}</span>
                                <div>
                                    <InputText
                                        placeholder="Pesquisa..."
                                    />
                                </div>
                            </div>
                            <div className="px-4">
                                <FormRow className="flex flex-row">
                                    <FormRowColumn unit="3">Nome</FormRowColumn>
                                    <FormRowColumn className="hidden sm:block" unit="2">CPF</FormRowColumn>
                                    <FormRowColumn className="text-center" unit="1/1">Ações</FormRowColumn>
                                </FormRow>
                            </div>
                        </div>
                        <div className="">
                            {persons.map((element: Person, index) => (
                                <FormRow className="border-b items-center mb-2 px-4 py-2" key={index + "-" + element.id}>
                                    <FormRowColumn unit="3">{element.name}</FormRowColumn>
                                    <FormRowColumn className="hidden sm:block" unit="2">{handleMaskCPF(element.cpf)}</FormRowColumn>
                                    <FormRowColumn className="flex gap-1 place-content-center" unit="1/1">
                                        <Button
                                            className="shadow-md"
                                            isLight>
                                            <PencilIcon className="text-indigo-600 block h-6 w-6" aria-hidden="true" />
                                        </Button>
                                        <Button
                                            className="shadow-md"
                                            isLight>
                                            <TrashIcon className="text-red-600 block h-6 w-6" aria-hidden="true" />
                                        </Button>
                                    </FormRowColumn>
                                </FormRow>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
            <IOSModal
                isOpen={isOpenIOS}
                setIsOpen={setIsOpenIOS}>
                <PersonForm
                    onBack={() => setIsOpenIOS(false)}
                    title="Informações pessoais"
                    subtitle="Dados importantes sobre a pessoa" />
            </IOSModal>
            <WindowModal
                isOpen={isOpenWindow}
                setIsOpen={setIsOpenWindow}>
                <PersonForm
                    onBack={() => setIsOpenWindow(false)}
                    title="Informações pessoais"
                    subtitle="Dados importantes sobre a pessoa" />
            </WindowModal>
        </>
    )
}
