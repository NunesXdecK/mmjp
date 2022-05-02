import { useEffect, useState } from "react"
import data from "../../data/dados.json"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"
const titleClassName = "px-4 py-5 text-md leading-6 font-medium text-gray-900"
const contentClassName = "mt-1 text-sm text-gray-900 px-4 py-5"

export default function List() {
    const [inputSearch, setInputSearch] = useState("")
    const [listItems, setListItems] = useState([])

    useEffect(() => {
        const lt = data.slice(0, 100)

        const listItemsFiltered = lt.filter((element, index) => {
            if (element.nome.toUpperCase().includes(inputSearch.toUpperCase())) {
                console.log(inputSearch)
                console.log(element.nome)
            }
            return element.nome.toUpperCase().includes(inputSearch.toUpperCase())
        })

        setListItems(
            listItemsFiltered.map((element, index) => (
                <div key={index.toString() + element.codigoBarras}
                    className="bg-white p-4 rounded-sm shadow items-center">
                    <div className="flex">
                        <div><span className={titleClassName}>{index + 1}</span></div>
                        <div><span className={titleClassName}>{element.nome}</span></div>
                    </div>
                    <div><span className={contentClassName}>{element.valorVenda}</span></div>
                    <div><span className={contentClassName}>{element.dataU}</span></div>
                </div>
            )))
    }, [])

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">

            <div className="bg-gray-100 border-gray-200">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Lista de projetos</h3>
                    <p className={subtitle}>subtitulo lindo</p>


                    <div className="mt-5 flex">
                        <div className="w-full self-end">
                            <label htmlFor="search-input" className={subtitle}>
                                Pesquisa
                            </label>
                            <input
                                onChange={(event) => {
                                    setInputSearch(event.target.value)
                                }}
                                type="text"
                                name="search"
                                id="search-input"
                                className={`
                                p-2 block w-full 
                                shadow-sm rounded-md
                                sm:text-sm 
                                focus:ring-indigo-500 focus:border-indigo-500 
                                `} />
                        </div>
                        <div className="pl-4 self-end">
                            <div>
                                <button
                                    type="submit"
                                    className={`
                                    justify-center py-2 px-4 
                                    border border-transparent 
                                    shadow-sm 
                                    text-sm font-medium rounded-md text-white 
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    focus:border-indigo-500 focus:ring-indigo-500
                                    bg-indigo-600 hover:bg-indigo-700 
                                    `}>
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