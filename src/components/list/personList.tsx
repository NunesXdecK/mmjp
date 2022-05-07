import { useState } from "react"
import persons from "../../data/persons.json"
import Button from "../button/button"
import PersonForm from "../form/personForm"
import IOSModal from "../modal/iosModal"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"
const titleClassName = "px-4 py-5 text-md leading-6 font-medium text-gray-900"
const contentClassName = "mt-1 text-sm text-gray-900 px-4 py-5"


export default function PersonList(props) {
    const [isOpen, setIsOpen] = useState(false)
    const [inputSearch, setInputSearch] = useState("")
    const [listItems, setListItems] = useState([])

    let listItemsFiltered = []

    function filterList(event) {
        event.preventDefault()
        listItemsFiltered = persons.slice(0, 100).filter((element, index) => {
            return element.name.toUpperCase().includes(inputSearch.toUpperCase())
        })
        setListItems(listItemsFiltered)
    }

    function handleAfterSaveOperation() {
        setIsOpen(false)
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="bg-gray-100 border-gray-200 px-4 py-5 sm:px-6">

                <div className="flex w-full">
                    <div className="w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Lista de pessoas</h3>
                        <p className={subtitle}>subtitulo lindo</p>
                    </div>

                    {!props.isForSelect ? (
                        <div className="self-center">
                            <Button
                                onClick={() => setIsOpen(true)}>
                                Novo
                            </Button>
                        </div>
                    ) : null}
                </div>

                <form className="mt-5 flex" onSubmit={filterList}>
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
                            <Button
                                type="submit">
                                Pesquisar
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 bg-white">
                {listItems.map((element, index) => (
                    <button key={index.toString() + element.codigoBarras}
                        onClick={() => {
                            props.onListItemClick ? props.onListItemClick(element) : null
                        }}
                        className="bg-white p-4 rounded-sm shadow items-center text-left">
                        <div className="flex">
                            <div><span className={titleClassName}>{index + 1}</span></div>
                            <div><span className={titleClassName}>{element.name}</span></div>
                        </div>
                        <div><span className={contentClassName}>{element.rg}</span></div>
                        <div><span className={contentClassName}>{element.cpf}</span></div>
                    </button>
                ))}
            </div>
            
            {!props.isForSelect ? (
                <IOSModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}>
                    <PersonForm
                        title="Informações pessoais"
                        subtitle="Dados importantes sobre a pessoa"
                        afterSave={handleAfterSaveOperation}
                    />
                </IOSModal>
            ) : null}
        </div>
    )
}
