import { Menu, Transition } from "@headlessui/react"
import { LayoutMenuItem } from "./layout"


interface LayoutMenuProps {
    menus?: LayoutMenuItem[],
}

export default function LayoutMenu(props: LayoutMenuProps) {

    const aClassName = "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-75"
    return (
        <>
            {props.menus.map((element, index) => (
                <Menu as="div" className="relative" key={index + element.name}>
                    {element.subMenus ?
                        (<>
                            <Menu.Button>
                                <a
                                    className={aClassName}>
                                    {element.name}
                                </a>
                            </Menu.Button>
                        </>) : (<>
                            <a
                                className={aClassName}
                                href={element.href}>
                                {element.name}
                            </a>
                        </>)}

                    {element.subMenus && (
                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0">
                            <Menu.Items
                                className={`
                                    p-2
                                    w-max
                                    left-0 
                                    absolute
                                    bg-gray-800 rounded-md 
                                    focus:outline-none`}>
                                {element.subMenus.map((elementItem, index) => (
                                    <Menu.Item
                                        disabled={elementItem.disabled}
                                        key={index + elementItem.name}>
                                        {({ active }) => (
                                            <a
                                                className={aClassName}
                                                href={elementItem.href}
                                            >
                                                {elementItem.name}
                                            </a>
                                        )}
                                    </Menu.Item>
                                ))}
                            </Menu.Items>
                        </Transition>
                    )}
                </Menu>
            ))}
        </>
    )
}