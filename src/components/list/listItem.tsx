import { useState } from "react"
import Button from "../button/button"
import { Transition } from "@headlessui/react"
import PlaceholderItemList from "./placeholderItemList"
import { EyeIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/outline"

interface ItemListProps {
    index?: number,
    element?: any,
    isActive?: boolean,
    isLoading?: boolean,
    canSelect?: boolean,
    canEdit?: boolean,
    canDelete?: boolean,
    canSeeInfo?: boolean,
    onInfo?: (element) => any,
    onTitle?: (element) => any,
    onSelectClick?: (element) => void,
    onEditClick?: () => void,
    onDeleteClick?: () => void,
    onActiveChange?: (any) => void,
}

const buttonTitleHoverClassName = `
                            mr-0 w-0 h-0 opacity-0 
                            sm:group-hover:opacity-100 sm:group-hover:w-auto 
                            group-hover:h-auto sm:group-hover:mr-2
                        `

const buttonTitleClassName = `
                            mr-1 hidden sm:block
                        `

export default function ItemList(props: ItemListProps) {
    const [isShowingInfo, setIsShowingInfo] = useState(false)

    let className = `
        border
        border-gray-50
        bg-slate-50 p-4 sm:p-8 
        items-center text-left
        transition duration-200
        hover:bg-indigo-50
        active:bg-indigo-50 focus:bg-indigo-50
        active:outline-none focus:outline-none
     `

    if (props.isActive) {
        className = className + " shadow-md bg-indigo-50 shadow-indigo-500"
    }

    const handleLoading = () => {
        return (
            <div>
                <svg className="border animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        )
    }

    return (
        <>
            {props.isLoading ? (
                <PlaceholderItemList />
            ) : (
                <div
                    onClick={(event) => {
                        switch (event.detail) {
                            case 1:
                                if (!props.isActive && props.onActiveChange) {
                                    props.onActiveChange(props.index)
                                    setIsShowingInfo(false)
                                }
                                break
                            case 2:
                                setIsShowingInfo(true)
                                break
                        }
                    }}
                    className={className}>
                    <div>
                        {props.onTitle && props.onTitle(props.element)}
                    </div>
                    <Transition.Root
                        show={props.isActive}>
                        <Transition.Child
                            enter="transform transition duration-500"
                            enterFrom="h-0"
                            enterTo="h-auto"
                            leave="transform transition duration-500"
                            leaveFrom="h-auto"
                            leaveTo="h-0"
                        >
                            <div>
                                <Transition.Child
                                    enter=""
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave=""
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="mt-2 w-full text-right ">
                                        {props.canDelete && props.onDeleteClick && (
                                            <Button
                                                color="red"
                                                className="mr-2 group"
                                                onClick={(event) => {
                                                    event.stopPropagation()
                                                    if (props.onDeleteClick) {
                                                        props.onDeleteClick()
                                                    }
                                                }}
                                            >
                                                <div className="flex flex-row">
                                                    <span className={buttonTitleClassName}>Excluir</span>
                                                    <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                                </div>
                                            </Button>
                                        )}

                                        {props.canEdit && props.onEditClick && (
                                            <Button
                                                className="mr-2 group"
                                                onClick={(event) => {
                                                    event.stopPropagation()
                                                    if (props.onEditClick) {
                                                        props.onEditClick()
                                                    }
                                                }}
                                            >
                                                <div className="flex flex-row">
                                                    <span className={buttonTitleClassName}>Editar</span>
                                                    <PencilAltIcon className="text-white block h-5 w-5 " aria-hidden="true" />
                                                </div>
                                            </Button>
                                        )}

                                        {props.canSelect && props.onSelectClick && (
                                            <Button
                                                className="mr-2 group"
                                                onClick={(event) => {
                                                    event.stopPropagation()
                                                    if (props.onSelectClick) {
                                                        props.onSelectClick(props.element)
                                                    }
                                                }}
                                            >
                                                <div className="flex flex-row">
                                                    <span className={buttonTitleClassName}>Selecionar</span>
                                                    <PencilAltIcon className="text-white block h-5 w-5 " aria-hidden="true" />
                                                </div>
                                            </Button>
                                        )}

                                        {props.canSeeInfo && (
                                            <Button
                                                className="group"
                                                onClick={(event) => {
                                                    event.stopPropagation()
                                                    setIsShowingInfo(!isShowingInfo)
                                                }}
                                            >
                                                <div className="flex flex-row">
                                                    <span className={buttonTitleClassName}>Visualizar</span>
                                                    <EyeIcon className="text-white block h-5 w-5 " aria-hidden="true" />
                                                </div>
                                            </Button>
                                        )}
                                    </div>
                                </Transition.Child>
                            </div>
                        </Transition.Child>
                    </Transition.Root>

                    {props.canSeeInfo && props.isActive && (
                        <Transition.Root
                            show={isShowingInfo}>
                            <Transition.Child
                                enter="transform transition duration-500"
                                enterFrom="h-0"
                                enterTo="h-auto"
                                leave="transform transition duration-500"
                                leaveFrom="h-auto"
                                leaveTo="h-0"
                            >
                                <div onClick={(event) => event.stopPropagation()}>
                                    <Transition.Child
                                        enter=""
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave=""
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >

                                        <div>
                                            {props.onInfo && props.onInfo(props.element)}
                                        </div>
                                    </Transition.Child>
                                </div>
                            </Transition.Child>
                        </Transition.Root>
                    )}
                </div>
            )}
        </>
    )
}
