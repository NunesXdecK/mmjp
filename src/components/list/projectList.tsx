import { useState } from "react"
import Button from "../button/button"
import ProjectForm from "../form/projectForm"
import IOSModal from "../modal/iosModal"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"
const titleClassName = "px-4 py-5 text-md leading-6 font-medium text-gray-900"
const contentClassName = "mt-1 text-sm text-gray-900 px-4 py-5"


export default function ProjectList(props) {
    const [isOpen, setIsOpen] = useState(false)
    const [inputSearch, setInputSearch] = useState("")
    const [listItems, setListItems] = useState([])

    let listItemsFiltered = []

    function filterList(event) {
        event.preventDefault()
        {/*
        listItemsFiltered = projects.filter((element, index) => {
            return element.name.toUpperCase().includes(inputSearch.toUpperCase())
        })
    */}
        setListItems(listItemsFiltered)
    }

    function handleAfterSaveOperation() {
        setIsOpen(false)
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        </div>
    )
}
