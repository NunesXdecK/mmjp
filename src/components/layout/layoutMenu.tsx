import { LayoutMenuItem } from "./layout"
import { Menu, Transition } from "@headlessui/react"
import Button from "../button/button"
import MenuButton from "../button/menuButton"
import DropDownButton from "../button/dropDownButton"


interface LayoutMenuProps {
    menus?: LayoutMenuItem[],
}

export default function LayoutMenu(props: LayoutMenuProps) {
    const aClassName = "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-75"
    return (
        <>
            {props.menus.map((element, index) => (
                <div key={index + element.name}>
                    {element.subMenus ?
                        (<>
                            <DropDownButton
                                id={element.name}
                                title={element.name}
                                className={aClassName}
                            >
                                <div
                                    className={"p-2 w-max left-0 absolute bg-gray-800 rounded-md focus:outline-none"}>
                                    {element.subMenus.map((elementItem, index) => (
                                        <Button
                                            isLink
                                            ignoreClass
                                            className={aClassName}
                                            href={elementItem.href}
                                            key={index + elementItem.name}
                                            isDisabled={elementItem.disabled}
                                            id={element.name + "-" + elementItem.name + "-" + index}
                                        >
                                            {elementItem.name}
                                        </Button>
                                    ))}
                                </div>
                            </DropDownButton>
                        </>) : (<>
                            <Button
                                isLink
                                ignoreClass
                                id={element.name}
                                href={element.href}
                                className={aClassName}
                            >
                                {element.name}
                            </Button>
                        </>)}
                </div>
            ))}
        </>
    )
}