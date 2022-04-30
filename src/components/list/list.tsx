let tableContents = [
]

let lineTest = { codigo: "1PCN", codiNome: "Fazenda Arraial", cliente: "Conde Dokuu" }

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"
const headerClassName = "px-4 py-5 text-md leading-6 font-medium text-gray-900"
const rowClassName = "mt-1 text-sm text-gray-900 px-4 py-5"


export default function List() {
    const rows = 20

    for (let i = 0; tableContents.length < rows; i++) {
        tableContents.push(lineTest)
    }

    const listItems = tableContents.map((tableContent, index) => (
        <div key={index.toString() + tableContent.codigo}
            className="bg-white p-4 rounded-sm shadow items-center">
            <div className="flex">
                <div><span className={headerClassName}>{index + 1}</span></div>
                <div><span className={headerClassName}>{tableContent.codigo}</span></div>
            </div>
            <div><span className={rowClassName}>{tableContent.codiNome}</span></div>
            <div><span className={rowClassName}>{tableContent.cliente}</span></div>
        </div>
    ))

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">

            <div className="bg-gray-100 border-gray-200">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Lista de projetos</h3>
                    <p className={subtitle}>subtitulo lindo</p>

                    <div className="mt-5 flex">
                        <div className="w-full">
                            <label htmlFor="search-input" className={subtitle}>
                                Pesquisa
                            </label>
                            <input
                                type="text"
                                name="search"
                                id="search-input"
                                className="px-2 py-2 w-full sm:text-sm rounded-md "
                            />
                        </div>

                        <div>
                            <div className="px-4 py-3">
                                <button
                                    type="submit"
                                    className="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Pesquisar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 bg-white">
                {listItems}
            </div>
        </div>
    )
}