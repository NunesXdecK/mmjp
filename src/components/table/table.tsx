import { ChevronLeftIcon, ChevronRightIcon, PencilAltIcon } from '@heroicons/react/solid'

let tableHeaders = [
    { name: "Codigo" },
    { name: "Codinome" },
    { name: "Cliente" },
]

let tableContents = [
]

let lineTest = { codigo: "1PCN", codiNome: "Fazenda Arraial", cliente: "Conde Dokuu" }

const tdClassName = "mt-1 text-sm text-gray-900 px-4 py-5"


export default function Table() {
    const lines = 20
    const linesPerPage = 5

    for (let i = 0; tableContents.length < lines; i++) {
        tableContents.push(lineTest)
    }
    
    const headers = tableHeaders.map((tableHeader, index) => (
        <th key={index.toString() + tableHeader.name}>
            <h3 className="px-4 py-5 text-md leading-6 font-medium text-gray-900">{tableHeader.name}</h3>
        </th>
    ))
    
    const tableItens = tableContents.map((tableContent, index) => (
        <tr key={index.toString() + tableContent.codigo}>
            <td className={tdClassName}>{tableContent.codigo}</td>
            <td className={tdClassName}>{tableContent.codiNome}</td>
            <td className={tdClassName}>{tableContent.cliente}</td>
            <td className="pr-5"><PencilAltIcon className="h-5 w-5" aria-hidden="true" /></td>
        </tr>
    ))

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">

            <div className="bg-gray-100 border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Tabela de projetos</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">subtitulo lindo</p>
                </div>

                <table className="w-full">
                    <thead className="border-gray-200 border-t-0">
                        {headers}
                        <th></th>
                    </thead>

                    <tbody className="text-center bg-white">
                        {tableItens}
                    </tbody>
                </table>
            </div>

            <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                    <a
                        href="#"
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Previous
                    </a>
                    <a
                        href="#"
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Next
                    </a>
                </div>

                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                            <span className="font-medium">97</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <a
                                href="#"
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </a>
                            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
                            <a
                                href="#"
                                aria-current="page"
                                className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                                1
                            </a>
                            <a
                                href="#"
                                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                                2
                            </a>
                            <a
                                href="#"
                                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
                            >
                                3
                            </a>
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                            </span>
                            <a
                                href="#"
                                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
                            >
                                8
                            </a>
                            <a
                                href="#"
                                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                                9
                            </a>
                            <a
                                href="#"
                                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                                10
                            </a>
                            <a
                                href="#"
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}