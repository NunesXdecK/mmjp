import { ChevronLeftIcon, ChevronRightIcon, PencilAltIcon } from '@heroicons/react/solid'

let tableHeaders = [
    { name: "Codigo" },
    { name: "Cliente" },
]

let tableContents = [
]

let lineTest = { codigo: "1PCN", codiNome: "Fazenda Arraial", cliente: "Conde Dokuu" }

const headerClassName = "px-4 py-5 text-md leading-6 font-medium text-gray-900"
const rowClassName = "mt-1 text-sm text-gray-900 px-4 py-5"
const pagesLineClassName = "z-10 bg-indigo-50 bg-white border-gray-300 text-gray-500 hover:bg-gray-50relative inline-flex items-center px-4 py-2 border text-sm font-medium"
const pagesLineCurrentClassName = "z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"


export default function Table() {
    const rows = 23
    const rowsPerPage = 5
    const pages = Math.ceil(rows / rowsPerPage)

    const pagesFromTo = (
        <p className="text-sm text-gray-700">
            Página
            <span className="font-medium"> 1 </span>
            de
            <span className="font-medium"> {pages}</span>
        </p>
    )

    const pagesLines = () => {
        let p = []
        for (let i = 0; pages > i; i++) {
            console.log(i)
            p.push(<a key={i} href="#" aria-current="page" className={pagesLineClassName}>{i + 1}</a>)
        }
        return p
    }

    for (let i = 0; tableContents.length < rows; i++) {
        tableContents.push(lineTest)
    }

    const headers = tableHeaders.map((tableHeader, index) => (
        <th key={index.toString() + tableHeader.name} >
            <h3 className={headerClassName}>{tableHeader.name}</h3>
        </th>
    ))

    const tableItens = tableContents.map((tableContent, index) => (
        <tr key={index.toString() + tableContent.codigo}>
            <td className={rowClassName}>{index + 1}</td>
            <td className={rowClassName}>{tableContent.cliente}</td>
            <td className={rowClassName}><PencilAltIcon className="h-5 w-5" aria-hidden="true" /></td>
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
                    <thead className="border-gray-200 border-t-0 text-center">
                        <tr>
                            {headers}
                            <th key="tableActions"></th>
                        </tr>
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
                        {pagesFromTo}
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

                            {pagesLines()}
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                            </span>
                            
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