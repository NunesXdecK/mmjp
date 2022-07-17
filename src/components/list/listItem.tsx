import { useState } from "react"
import Button from "../button/button"
import { Transition } from "@headlessui/react"
import { handleMaskCPF } from "../../util/maskUtil"
import PlaceholderItemList from "./placeholderItemList"
import { EyeIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/outline"

interface ItemListProps {
    index?: number,
    element?: any,
    isActive?: boolean,
    isLoading?: boolean,
    canDelete?: boolean,
    canSeeInfo?: boolean,
    onInfo?: (element) => any,
    onTitle?: (element) => any,
    onEditClick?: () => void,
    onDeleteClick?: () => void,
    onActiveChange?: (any) => void,
}

const contentClassName = "sm:px-4 sm:py-5 mt-1 text-sm text-gray-900"
const titleClassName = "sm:px-4 sm:py-5 text-md leading-6 font-medium text-gray-900"
const buttonTitleClassName = `
                            mr-0 w-0 h-0 opacity-0 
                            sm:group-hover:opacity-100 sm:group-hover:w-auto 
                            group-hover:h-auto sm:group-hover:mr-2
                        `

export default function ItemList(props: ItemListProps) {
    const [isShowingInfo, setIsShowingInfo] = useState(false)

    let className = `
        bg-white p-4
        rounded-sm shadow
        items-center text-left
        transition duration-200
        hover:shadow-md hover:shadow-indigo-500 hover:bg-indigo-50
        active:bg-indigo-50 focus:bg-indigo-50
        active:outline-none focus:outline-none
     `

    if (props.isActive) {
        className = className + " shadow-md bg-indigo-50 shadow-indigo-500"
    }

    return (
        <>
            {props.isLoading ? (
                <PlaceholderItemList />
            ) : (
                <div
                    onClick={() => {
                        if (props.onActiveChange) {
                            props.onActiveChange(props.isActive ? -1 : props.index)
                        }
                        setIsShowingInfo(false)
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
                                    <div className="mt-2 w-full text-right">
                                        {props.canDelete && props.onDeleteClick && (
                                            <Button
                                                color="red"
                                                className="mr-2 group"
                                                onClick={(event) => {
                                                    if (props.onDeleteClick) {
                                                        props.onDeleteClick()
                                                    }
                                                    event.stopPropagation()
                                                }}
                                            >
                                                <div className="flex flex-row">
                                                    <span className={buttonTitleClassName}>Excluir</span>
                                                    <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                                                </div>
                                            </Button>
                                        )}

                                        {props.onEditClick && (
                                            <Button
                                                className="mr-2 group"
                                                onClick={(event) => {
                                                    if (props.onEditClick) {
                                                        props.onEditClick()
                                                    }
                                                    event.stopPropagation()
                                                }}
                                            >
                                                <div className="flex flex-row">
                                                    <span className={buttonTitleClassName}>Editar</span>
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
