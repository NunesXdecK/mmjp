import InputText from "../inputText/inputText";

export default function PersonForm() {
    let listForTest = []
    let listForTest2 = []

    for (let i = 0; listForTest.length < 6; i++) {
        listForTest.push({ id: i })
    }

    for (let i = 0; listForTest2.length < 3; i++) {
        listForTest2.push({ id: i })
    }


    return (
        <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:cols-span-1">
                <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Informações pessoais</h3>
                    <p className="mt-1 text-sm text-gray-600">Subtitulo lindo</p>
                </div>
            </div>

            <div className="mt-5 md:mt-0 md:col-span-2">
                <form action="#" method="POST">
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="bg-white sm:py-1 px-4">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-6">
                                    <InputText
                                        id="sp1"
                                        title="Espaço 1" />
                                </div>
                            </div>

                            <div className="sm:mt-2 grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <InputText
                                        id="sp2"
                                        title="Espaço 2" />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <InputText
                                        id="sp3"
                                        title="Espaço 3" />
                                </div>
                            </div>

                            <div className="sm:mt-2 grid grid-cols-6 gap-6">
                                {listForTest2.map((e, index) => (
                                    <div className="col-span-6 sm:col-span-2">
                                        <InputText
                                            id={"sp" + (index + 4)}
                                            title={"Espaço " + (index + 4)} />
                                    </div>
                                ))}
                            </div>

                            <div className="sm:mt-2 grid grid-cols-6 gap-6">
                                {listForTest.map((e, index) => (
                                    <div className="col-span-6 sm:col-span-1">
                                        <InputText
                                            id={"sp" + (index + 7)}
                                            title={"Espaço " + (index + 7)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div >
    )
}
