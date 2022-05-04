import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useRef, useState } from "react"
import persons from "../../data/persons.json"
import Button from "../button/button"
import PersonForm from "../form/personForm"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"
const titleClassName = "px-4 py-5 text-md leading-6 font-medium text-gray-900"
const contentClassName = "mt-1 text-sm text-gray-900 px-4 py-5"


export default function ProjectList() {
    const [isOpen, setIsOpen] = useState(false)
    const [inputSearch, setInputSearch] = useState("")
    const [listItems, setListItems] = useState([])
    let cancelButtonRef
        = useRef(null)
    let listItemsFiltered = []

    const filterList = () => {
        listItemsFiltered = persons.slice(0, 100).filter((element, index) => {
            return element.name.toUpperCase().includes(inputSearch.toUpperCase())
        })
        setListItems(listItemsFiltered)
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="bg-gray-100 border-gray-200 px-4 py-5 sm:px-6">

                <div className="flex w-full">
                    <div className="w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Lista de pessoas</h3>
                        <p className={subtitle}>subtitulo lindo</p>
                    </div>
                    <div className="self-center">
                        <Button
                            onClick={() => setIsOpen(true)}>
                            Novo
                        </Button>
                    </div>
                </div>

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
                            <Button
                                onClick={filterList}>
                                Pesquisar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 bg-white">
                {listItems.map((element, index) => (
                    <div key={index.toString() + element.codigoBarras}
                        className="bg-white p-4 rounded-sm shadow items-center">
                        <div className="flex">
                            <div><span className={titleClassName}>{index + 1}</span></div>
                            <div><span className={titleClassName}>{element.name}</span></div>
                        </div>
                        <div><span className={contentClassName}>{element.rg}</span></div>
                        <div><span className={contentClassName}>{element.cpf}</span></div>
                    </div>
                ))}
            </div>

            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog
                    className="relative z-10"
                    initialFocus={cancelButtonRef}
                    open={isOpen}
                    onClose={() => { }}>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                                &#8203;
                            </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

                                <Dialog.Panel className={`
                                relative inline-block align-bottom
                                bg-white rounded-lg text-left 
                                overflow-hidden shadow-xl 
                                transform transition-all 
                                sm:my-8 sm:align-middle sm:max-w-lg sm:w-full
                                p-4
                                `}>
                                    <div className="flex w-full justify-end p-4">
                                        <span
                                            onClick={() => setIsOpen(false)}>
                                            X
                                        </span>
                                    </div>
                                    <PersonForm />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div >
    )
}